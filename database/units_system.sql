-- =====================================================
-- HỆ THỐNG ĐƠN VỊ ĐO LƯỜNG ĐA VĂN HÓA
-- Hỗ trợ nhiều đơn vị cho cùng một nguyên liệu
-- theo văn hóa vùng miền và quốc gia
-- =====================================================

-- =====================================================
-- BẢNG UNITS - Danh sách tất cả đơn vị đo
-- =====================================================
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE, -- 'kg', 'g', 'qua', 'lang', 'can'
    name VARCHAR(100) NOT NULL, -- 'Kilogram', 'Gram', 'Quả'
    name_vi VARCHAR(100) NOT NULL, -- 'Ki-lô-gam', 'Gam', 'Quả'
    symbol VARCHAR(20), -- 'kg', 'g', 'quả'
    
    -- Phân loại
    category VARCHAR(50) NOT NULL, -- 'weight', 'volume', 'count', 'length', 'area'
    system VARCHAR(20) NOT NULL, -- 'metric', 'imperial', 'traditional_vietnam', 'traditional_china', 'custom'
    
    -- Vùng miền / Văn hóa
    regions TEXT[], -- ['vietnam', 'china', 'thailand', 'asia']
    countries TEXT[], -- ['VN', 'CN', 'TH', 'US', 'UK']
    is_universal BOOLEAN DEFAULT false, -- Đơn vị phổ biến toàn cầu (kg, g, ml)
    
    -- Chuyển đổi cơ bản (so với đơn vị chuẩn)
    base_unit VARCHAR(20), -- Đơn vị chuẩn để chuyển đổi (VD: 'g' cho weight)
    conversion_factor DECIMAL(15, 6), -- Hệ số chuyển đổi về base_unit
    
    -- Thông tin bổ sung
    description TEXT,
    usage_context TEXT, -- "Thường dùng cho rau củ ở chợ Việt Nam"
    examples TEXT[], -- ['1 kg = 10 lạng', '1 lạng = 100g']
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_units_category ON public.units(category);
CREATE INDEX idx_units_system ON public.units(system);
CREATE INDEX idx_units_regions ON public.units USING GIN(regions);
CREATE INDEX idx_units_countries ON public.units USING GIN(countries);

-- =====================================================
-- BẢNG INGREDIENT_UNITS - Đơn vị phù hợp cho từng nguyên liệu
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ingredient_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units(id),
    
    -- Thứ tự ưu tiên hiển thị
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false, -- Đơn vị chính cho nguyên liệu này
    is_recommended BOOLEAN DEFAULT true, -- Đơn vị được khuyến nghị
    
    -- Context sử dụng
    usage_context TEXT, -- "Phổ biến ở siêu thị", "Thường dùng ở chợ"
    regions TEXT[], -- Vùng miền phù hợp
    
    -- Chuyển đổi tiêu chuẩn cho nguyên liệu này
    -- VD: 1 quả cà chua trung bình = 150g
    standard_conversion_value DECIMAL(10, 3), -- 1
    standard_conversion_unit_id UUID REFERENCES public.units(id), -- 'qua'
    converts_to_value DECIMAL(10, 3), -- 150
    converts_to_unit_id UUID REFERENCES public.units(id), -- 'g'
    conversion_notes TEXT, -- "Quả trung bình"
    
    -- Giá tham khảo theo đơn vị này
    typical_price_per_unit DECIMAL(10, 2),
    price_currency VARCHAR(3) DEFAULT 'VND',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(ingredient_id, unit_id)
);

CREATE INDEX idx_ingredient_units_ingredient ON public.ingredient_units(ingredient_id);
CREATE INDEX idx_ingredient_units_primary ON public.ingredient_units(is_primary);
CREATE INDEX idx_ingredient_units_regions ON public.ingredient_units USING GIN(regions);

-- =====================================================
-- BẢNG UNIT_CONVERSIONS - Chuyển đổi giữa các đơn vị
-- =====================================================
CREATE TABLE IF NOT EXISTS public.unit_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_unit_id UUID NOT NULL REFERENCES public.units(id),
    to_unit_id UUID NOT NULL REFERENCES public.units(id),
    
    -- Công thức chuyển đổi
    conversion_factor DECIMAL(15, 6) NOT NULL, -- from * factor = to
    conversion_type VARCHAR(20) DEFAULT 'standard', -- 'standard', 'approximate', 'contextual'
    
    -- Context
    ingredient_category VARCHAR(50), -- Áp dụng cho loại nguyên liệu nào
    region VARCHAR(50), -- Vùng miền sử dụng
    
    -- Thông tin
    formula TEXT, -- "1 cân = 10 lạng = 600g"
    notes TEXT,
    is_bidirectional BOOLEAN DEFAULT true, -- Có thể chuyển ngược lại không
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(from_unit_id, to_unit_id, ingredient_category, region)
);

CREATE INDEX idx_unit_conversions_from ON public.unit_conversions(from_unit_id);
CREATE INDEX idx_unit_conversions_to ON public.unit_conversions(to_unit_id);

-- =====================================================
-- BẢNG REGIONAL_UNIT_PREFERENCES - Sở thích đơn vị theo vùng
-- =====================================================
CREATE TABLE IF NOT EXISTS public.regional_unit_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region VARCHAR(50) NOT NULL, -- 'vietnam_north', 'vietnam_south', 'china_guangdong'
    country_code VARCHAR(3) NOT NULL, -- 'VN', 'CN', 'TH'
    ingredient_category VARCHAR(50), -- 'vegetable', 'protein', 'grain'
    
    preferred_units UUID[] NOT NULL, -- Mảng các unit_id theo thứ tự ưu tiên
    
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(region, ingredient_category)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_unit_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Units are viewable by everyone"
    ON public.units FOR SELECT
    USING (true);

CREATE POLICY "Ingredient units are viewable by everyone"
    ON public.ingredient_units FOR SELECT
    USING (true);

CREATE POLICY "Unit conversions are viewable by everyone"
    ON public.unit_conversions FOR SELECT
    USING (true);

CREATE POLICY "Regional preferences are viewable by everyone"
    ON public.regional_unit_preferences FOR SELECT
    USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Lấy tất cả đơn vị phù hợp cho một nguyên liệu
CREATE OR REPLACE FUNCTION public.get_ingredient_available_units(
    p_ingredient_id UUID,
    p_region VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    unit_id UUID,
    unit_code VARCHAR,
    unit_name VARCHAR,
    unit_symbol VARCHAR,
    is_primary BOOLEAN,
    is_recommended BOOLEAN,
    display_order INT,
    usage_context TEXT,
    conversion_info TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.code,
        u.name_vi,
        u.symbol,
        iu.is_primary,
        iu.is_recommended,
        iu.display_order,
        iu.usage_context,
        CASE 
            WHEN iu.converts_to_value IS NOT NULL THEN
                format('%s %s = %s %s', 
                    iu.standard_conversion_value::TEXT,
                    (SELECT symbol FROM public.units WHERE id = iu.standard_conversion_unit_id),
                    iu.converts_to_value::TEXT,
                    (SELECT symbol FROM public.units WHERE id = iu.converts_to_unit_id)
                )
            ELSE NULL
        END as conversion_info
    FROM public.ingredient_units iu
    JOIN public.units u ON iu.unit_id = u.id
    WHERE iu.ingredient_id = p_ingredient_id
        AND (p_region IS NULL OR p_region = ANY(iu.regions))
        AND u.is_active = true
    ORDER BY iu.is_primary DESC, iu.is_recommended DESC, iu.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Chuyển đổi giữa hai đơn vị
CREATE OR REPLACE FUNCTION public.convert_unit(
    p_from_unit_code VARCHAR,
    p_to_unit_code VARCHAR,
    p_value DECIMAL,
    p_ingredient_id UUID DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    v_from_unit_id UUID;
    v_to_unit_id UUID;
    v_conversion_factor DECIMAL;
    v_result DECIMAL;
BEGIN
    -- Get unit IDs
    SELECT id INTO v_from_unit_id FROM public.units WHERE code = p_from_unit_code;
    SELECT id INTO v_to_unit_id FROM public.units WHERE code = p_to_unit_code;
    
    IF v_from_unit_id IS NULL OR v_to_unit_id IS NULL THEN
        RAISE EXCEPTION 'Invalid unit code';
    END IF;
    
    -- Try direct conversion
    SELECT conversion_factor INTO v_conversion_factor
    FROM public.unit_conversions
    WHERE from_unit_id = v_from_unit_id 
        AND to_unit_id = v_to_unit_id
    LIMIT 1;
    
    -- If found, calculate
    IF v_conversion_factor IS NOT NULL THEN
        v_result := p_value * v_conversion_factor;
        RETURN ROUND(v_result, 3);
    END IF;
    
    -- Try ingredient-specific conversion
    IF p_ingredient_id IS NOT NULL THEN
        SELECT 
            (p_value / iu1.standard_conversion_value * iu1.converts_to_value) / 
            (iu2.converts_to_value / iu2.standard_conversion_value)
        INTO v_result
        FROM public.ingredient_units iu1
        JOIN public.ingredient_units iu2 ON iu1.ingredient_id = iu2.ingredient_id
        WHERE iu1.ingredient_id = p_ingredient_id
            AND iu1.unit_id = v_from_unit_id
            AND iu2.unit_id = v_to_unit_id
            AND iu1.converts_to_value IS NOT NULL
            AND iu2.converts_to_value IS NOT NULL
        LIMIT 1;
        
        IF v_result IS NOT NULL THEN
            RETURN ROUND(v_result, 3);
        END IF;
    END IF;
    
    -- Try base unit conversion
    DECLARE
        v_from_base_factor DECIMAL;
        v_to_base_factor DECIMAL;
    BEGIN
        SELECT conversion_factor INTO v_from_base_factor 
        FROM public.units WHERE id = v_from_unit_id;
        
        SELECT conversion_factor INTO v_to_base_factor 
        FROM public.units WHERE id = v_to_unit_id;
        
        IF v_from_base_factor IS NOT NULL AND v_to_base_factor IS NOT NULL THEN
            v_result := (p_value * v_from_base_factor) / v_to_base_factor;
            RETURN ROUND(v_result, 3);
        END IF;
    END;
    
    RAISE EXCEPTION 'Cannot convert between % and %', p_from_unit_code, p_to_unit_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lấy đơn vị ưu tiên theo vùng
CREATE OR REPLACE FUNCTION public.get_regional_preferred_units(
    p_region VARCHAR,
    p_ingredient_category VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    unit_id UUID,
    unit_code VARCHAR,
    unit_name_vi VARCHAR,
    unit_symbol VARCHAR,
    preference_order INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.code,
        u.name_vi,
        u.symbol,
        idx as preference_order
    FROM public.regional_unit_preferences rp
    CROSS JOIN LATERAL unnest(rp.preferred_units) WITH ORDINALITY AS t(unit_id, idx)
    JOIN public.units u ON u.id = t.unit_id
    WHERE rp.region = p_region
        AND (p_ingredient_category IS NULL OR rp.ingredient_category = p_ingredient_category)
    ORDER BY idx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Chuẩn hóa về đơn vị chuẩn (gram cho weight, ml cho volume)
CREATE OR REPLACE FUNCTION public.normalize_to_standard_unit(
    p_quantity DECIMAL,
    p_unit_code VARCHAR,
    p_ingredient_id UUID DEFAULT NULL
)
RETURNS TABLE (
    standard_quantity DECIMAL,
    standard_unit VARCHAR
) AS $$
DECLARE
    v_unit_category VARCHAR;
    v_base_unit VARCHAR;
BEGIN
    -- Get unit category
    SELECT category, base_unit INTO v_unit_category, v_base_unit
    FROM public.units
    WHERE code = p_unit_code;
    
    -- Determine standard unit based on category
    v_base_unit := COALESCE(v_base_unit, 
        CASE v_unit_category
            WHEN 'weight' THEN 'g'
            WHEN 'volume' THEN 'ml'
            WHEN 'count' THEN 'piece'
            ELSE p_unit_code
        END
    );
    
    RETURN QUERY
    SELECT 
        public.convert_unit(p_unit_code, v_base_unit, p_quantity, p_ingredient_id),
        v_base_unit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.units
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ingredient_units
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- SEED DATA - Đơn vị phổ biến
-- =====================================================

-- Metric System (Hệ mét - Phổ biến toàn cầu)
INSERT INTO public.units (code, name, name_vi, symbol, category, system, regions, countries, is_universal, base_unit, conversion_factor) VALUES
('kg', 'Kilogram', 'Ki-lô-gam', 'kg', 'weight', 'metric', ARRAY['global'], ARRAY['VN','CN','TH','US','UK','JP'], true, 'g', 1000),
('g', 'Gram', 'Gam', 'g', 'weight', 'metric', ARRAY['global'], ARRAY['VN','CN','TH','US','UK','JP'], true, 'g', 1),
('mg', 'Milligram', 'Mi-li-gam', 'mg', 'weight', 'metric', ARRAY['global'], ARRAY['VN','CN','TH','US','UK','JP'], true, 'g', 0.001),
('l', 'Liter', 'Lít', 'l', 'volume', 'metric', ARRAY['global'], ARRAY['VN','CN','TH','US','UK','JP'], true, 'ml', 1000),
('ml', 'Milliliter', 'Mi-li-lít', 'ml', 'volume', 'metric', ARRAY['global'], ARRAY['VN','CN','TH','US','UK','JP'], true, 'ml', 1)
ON CONFLICT (code) DO NOTHING;

-- Traditional Vietnamese Units (Đơn vị truyền thống Việt Nam)
INSERT INTO public.units (code, name, name_vi, symbol, category, system, regions, countries, is_universal, base_unit, conversion_factor, usage_context, examples) VALUES
('lang', 'Tael', 'Lạng', 'lạng', 'weight', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], false, 'g', 100, 'Phổ biến ở chợ truyền thống Việt Nam', ARRAY['1 lạng = 100g', '10 lạng = 1 kg']),
('can', 'Catty', 'Cân', 'cân', 'weight', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], false, 'g', 600, 'Dùng ở miền Bắc Việt Nam', ARRAY['1 cân = 600g', '1 cân = 10 lạng miền Bắc']),
('yen', 'Yen', 'Yến', 'yến', 'weight', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], false, 'g', 37.5, 'Đơn vị nhỏ, ít dùng', ARRAY['1 yến = 37.5g', '10 yến = 1 lạng']),
('ta', 'Tạ', 'Tạ', 'tạ', 'weight', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], false, 'g', 100000, 'Dùng cho khối lượng lớn', ARRAY['1 tạ = 100kg', '1 tạ = 1000 lạng'])
ON CONFLICT (code) DO NOTHING;

-- Count-based units (Đơn vị đếm)
INSERT INTO public.units (code, name, name_vi, symbol, category, system, regions, countries, is_universal, description) VALUES
('piece', 'Piece', 'Cái', 'cái', 'count', 'custom', ARRAY['global'], ARRAY['VN','CN','TH'], false, 'Đơn vị đếm chung'),
('qua', 'Fruit', 'Quả', 'quả', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đếm trái cây, rau củ'),
('trai', 'Item', 'Trái', 'trái', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đếm (tương tự quả)'),
('cu', 'Bulb', 'Củ', 'củ', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đếm củ (tỏi, hành, khoai)'),
('canh', 'Stalk', 'Cành', 'cành', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đếm cành (rau, hoa)'),
('bo', 'Bundle', 'Bó', 'bó', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đếm bó (rau)'),
('chum', 'Cluster', 'Chùm', 'chùm', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đếm chùm (chuối, nho)'),
('hop', 'Box', 'Hộp', 'hộp', 'count', 'custom', ARRAY['global'], ARRAY['VN','CN','TH'], false, 'Đơn vị đóng gói'),
('goi', 'Package', 'Gói', 'gói', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị đóng gói nhỏ'),
('thanh', 'Bar', 'Thanh', 'thanh', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị thanh (bánh mì, đậu hũ)'),
('tam', 'Sheet', 'Tấm', 'tấm', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị tấm (đậu hũ, bánh tráng)'),
('mieng', 'Piece', 'Miếng', 'miếng', 'count', 'custom', ARRAY['vietnam'], ARRAY['VN'], false, 'Đơn vị miếng (thịt, cá, đậu hũ)')
ON CONFLICT (code) DO NOTHING;

-- Volume units Vietnamese (Đơn vị thể tích Việt Nam)
INSERT INTO public.units (code, name, name_vi, symbol, category, system, regions, countries, base_unit, conversion_factor, description) VALUES
('chen', 'Cup', 'Chén', 'chén', 'volume', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], 'ml', 250, 'Chén ăn cơm (~250ml)'),
('muong_canh', 'Tablespoon', 'Muỗng canh', 'mc', 'volume', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], 'ml', 15, 'Muỗng canh (~15ml)'),
('muong_cafe', 'Teaspoon', 'Muỗng cà phê', 'mcf', 'volume', 'traditional_vietnam', ARRAY['vietnam'], ARRAY['VN'], 'ml', 5, 'Muỗng cà phê (~5ml)')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SEED DATA - Mapping nguyên liệu với đơn vị
-- =====================================================

-- Cà chua (Tomato) - có nhiều đơn vị
DO $$
DECLARE
    v_tomato_id UUID;
    v_kg_id UUID;
    v_g_id UUID;
    v_lang_id UUID;
    v_qua_id UUID;
BEGIN
    SELECT id INTO v_tomato_id FROM public.ingredients WHERE name = 'tomato';
    SELECT id INTO v_kg_id FROM public.units WHERE code = 'kg';
    SELECT id INTO v_g_id FROM public.units WHERE code = 'g';
    SELECT id INTO v_lang_id FROM public.units WHERE code = 'lang';
    SELECT id INTO v_qua_id FROM public.units WHERE code = 'qua';
    
    IF v_tomato_id IS NOT NULL THEN
        INSERT INTO public.ingredient_units (ingredient_id, unit_id, is_primary, is_recommended, display_order, usage_context, standard_conversion_value, standard_conversion_unit_id, converts_to_value, converts_to_unit_id, conversion_notes) VALUES
        (v_tomato_id, v_kg_id, true, true, 1, 'Phổ biến ở siêu thị', NULL, NULL, NULL, NULL, NULL),
        (v_tomato_id, v_lang_id, false, true, 2, 'Phổ biến ở chợ', NULL, NULL, NULL, NULL, NULL),
        (v_tomato_id, v_g_id, false, true, 3, 'Đo lường chính xác', NULL, NULL, NULL, NULL, NULL),
        (v_tomato_id, v_qua_id, false, true, 4, 'Mua lẻ', 1, v_qua_id, 150, v_g_id, 'Quả trung bình ~150g')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Đậu hũ (Tofu) - nhiều đơn vị đếm
DO $$
DECLARE
    v_tofu_id UUID;
    v_kg_id UUID;
    v_g_id UUID;
    v_mieng_id UUID;
    v_tam_id UUID;
    v_hop_id UUID;
BEGIN
    SELECT id INTO v_tofu_id FROM public.ingredients WHERE name = 'tofu';
    SELECT id INTO v_kg_id FROM public.units WHERE code = 'kg';
    SELECT id INTO v_g_id FROM public.units WHERE code = 'g';
    SELECT id INTO v_mieng_id FROM public.units WHERE code = 'mieng';
    SELECT id INTO v_tam_id FROM public.units WHERE code = 'tam';
    SELECT id INTO v_hop_id FROM public.units WHERE code = 'hop';
    
    IF v_tofu_id IS NOT NULL THEN
        INSERT INTO public.ingredient_units (ingredient_id, unit_id, is_primary, is_recommended, display_order, usage_context, standard_conversion_value, standard_conversion_unit_id, converts_to_value, converts_to_unit_id, conversion_notes) VALUES
        (v_tofu_id, v_kg_id, true, true, 1, 'Mua số lượng lớn', NULL, NULL, NULL, NULL, NULL),
        (v_tofu_id, v_g_id, false, true, 2, 'Đo chính xác', NULL, NULL, NULL, NULL, NULL),
        (v_tofu_id, v_tam_id, false, true, 3, 'Mua tấm đậu hũ', 1, v_tam_id, 400, v_g_id, 'Tấm trung bình ~400g'),
        (v_tofu_id, v_mieng_id, false, true, 4, 'Mua miếng nhỏ', 1, v_mieng_id, 100, v_g_id, 'Miếng nhỏ ~100g'),
        (v_tofu_id, v_hop_id, false, true, 5, 'Đậu hũ đóng hộp', 1, v_hop_id, 300, v_g_id, 'Hộp tiêu chuẩn ~300g')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Tỏi (Garlic) - đơn vị củ, nhánh
DO $$
DECLARE
    v_garlic_id UUID;
    v_kg_id UUID;
    v_g_id UUID;
    v_cu_id UUID;
    v_canh_id UUID;
BEGIN
    SELECT id INTO v_garlic_id FROM public.ingredients WHERE name = 'garlic';
    SELECT id INTO v_kg_id FROM public.units WHERE code = 'kg';
    SELECT id INTO v_g_id FROM public.units WHERE code = 'g';
    SELECT id INTO v_cu_id FROM public.units WHERE code = 'cu';
    SELECT id INTO v_canh_id FROM public.units WHERE code = 'canh';
    
    IF v_garlic_id IS NOT NULL THEN
        INSERT INTO public.ingredient_units (ingredient_id, unit_id, is_primary, is_recommended, display_order, usage_context, standard_conversion_value, standard_conversion_unit_id, converts_to_value, converts_to_unit_id, conversion_notes) VALUES
        (v_garlic_id, v_kg_id, true, true, 1, 'Mua số lượng lớn', NULL, NULL, NULL, NULL, NULL),
        (v_garlic_id, v_g_id, false, true, 2, 'Đo chính xác', NULL, NULL, NULL, NULL, NULL),
        (v_garlic_id, v_cu_id, false, true, 3, 'Mua theo củ', 1, v_cu_id, 50, v_g_id, 'Củ trung bình ~50g'),
        (v_garlic_id, v_canh_id, false, true, 4, 'Mua theo cành', 1, v_canh_id, 5, v_g_id, 'Cành nhỏ ~5g')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Rau muống (Water spinach) - bó, kg
DO $$
DECLARE
    v_spinach_id UUID;
    v_kg_id UUID;
    v_g_id UUID;
    v_bo_id UUID;
BEGIN
    SELECT id INTO v_spinach_id FROM public.ingredients WHERE name = 'water-spinach';
    SELECT id INTO v_kg_id FROM public.units WHERE code = 'kg';
    SELECT id INTO v_g_id FROM public.units WHERE code = 'g';
    SELECT id INTO v_bo_id FROM public.units WHERE code = 'bo';
    
    IF v_spinach_id IS NOT NULL THEN
        INSERT INTO public.ingredient_units (ingredient_id, unit_id, is_primary, is_recommended, display_order, usage_context, standard_conversion_value, standard_conversion_unit_id, converts_to_value, converts_to_unit_id, conversion_notes) VALUES
        (v_spinach_id, v_kg_id, true, true, 1, 'Mua số lượng lớn', NULL, NULL, NULL, NULL, NULL),
        (v_spinach_id, v_bo_id, false, true, 2, 'Phổ biến ở chợ', 1, v_bo_id, 300, v_g_id, 'Bó trung bình ~300g'),
        (v_spinach_id, v_g_id, false, true, 3, 'Đo chính xác', NULL, NULL, NULL, NULL, NULL)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- SEED DATA - Unit Conversions
-- =====================================================

INSERT INTO public.unit_conversions (from_unit_id, to_unit_id, conversion_factor, conversion_type, region, formula) 
SELECT 
    (SELECT id FROM public.units WHERE code = 'lang'),
    (SELECT id FROM public.units WHERE code = 'g'),
    100,
    'standard',
    'vietnam',
    '1 lạng = 100g'
WHERE EXISTS (SELECT 1 FROM public.units WHERE code = 'lang')
ON CONFLICT DO NOTHING;

INSERT INTO public.unit_conversions (from_unit_id, to_unit_id, conversion_factor, conversion_type, region, formula)
SELECT 
    (SELECT id FROM public.units WHERE code = 'can'),
    (SELECT id FROM public.units WHERE code = 'g'),
    600,
    'standard',
    'vietnam',
    '1 cân = 600g = 10 lạng (miền Bắc)'
WHERE EXISTS (SELECT 1 FROM public.units WHERE code = 'can')
ON CONFLICT DO NOTHING;

INSERT INTO public.unit_conversions (from_unit_id, to_unit_id, conversion_factor, conversion_type, region, formula)
SELECT 
    (SELECT id FROM public.units WHERE code = 'can'),
    (SELECT id FROM public.units WHERE code = 'lang'),
    10,
    'standard',
    'vietnam',
    '1 cân = 10 lạng'
WHERE EXISTS (SELECT 1 FROM public.units WHERE code = 'can')
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED DATA - Regional Preferences
-- =====================================================

INSERT INTO public.regional_unit_preferences (region, country_code, ingredient_category, preferred_units, description)
SELECT 
    'vietnam_north',
    'VN',
    'vegetable',
    ARRAY[
        (SELECT id FROM public.units WHERE code = 'bo'),
        (SELECT id FROM public.units WHERE code = 'kg'),
        (SELECT id FROM public.units WHERE code = 'lang')
    ],
    'Miền Bắc Việt Nam ưu tiên: bó, kg, lạng cho rau củ'
WHERE EXISTS (SELECT 1 FROM public.units WHERE code = 'bo')
ON CONFLICT DO NOTHING;

INSERT INTO public.regional_unit_preferences (region, country_code, ingredient_category, preferred_units, description)
SELECT 
    'vietnam_south',
    'VN',
    'vegetable',
    ARRAY[
        (SELECT id FROM public.units WHERE code = 'kg'),
        (SELECT id FROM public.units WHERE code = 'bo'),
        (SELECT id FROM public.units WHERE code = 'lang')
    ],
    'Miền Nam Việt Nam ưu tiên: kg, bó, lạng cho rau củ'
WHERE EXISTS (SELECT 1 FROM public.units WHERE code = 'kg')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Ingredient với tất cả đơn vị có sẵn
CREATE OR REPLACE VIEW public.ingredients_with_units AS
SELECT 
    i.id as ingredient_id,
    i.name,
    i.name_vi,
    i.category,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'unit_id', u.id,
            'unit_code', u.code,
            'unit_name', u.name_vi,
            'unit_symbol', u.symbol,
            'is_primary', iu.is_primary,
            'is_recommended', iu.is_recommended,
            'display_order', iu.display_order,
            'usage_context', iu.usage_context,
            'conversion', CASE 
                WHEN iu.converts_to_value IS NOT NULL THEN
                    JSONB_BUILD_OBJECT(
                        'from_value', iu.standard_conversion_value,
                        'from_unit', (SELECT symbol FROM public.units WHERE id = iu.standard_conversion_unit_id),
                        'to_value', iu.converts_to_value,
                        'to_unit', (SELECT symbol FROM public.units WHERE id = iu.converts_to_unit_id),
                        'notes', iu.conversion_notes
                    )
                ELSE NULL
            END
        ) ORDER BY iu.is_primary DESC, iu.display_order
    ) as available_units
FROM public.ingredients i
LEFT JOIN public.ingredient_units iu ON i.id = iu.ingredient_id
LEFT JOIN public.units u ON iu.unit_id = u.id AND u.is_active = true
GROUP BY i.id, i.name, i.name_vi, i.category;

