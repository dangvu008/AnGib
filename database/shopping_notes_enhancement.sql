-- =====================================================
-- SHOPPING NOTES ENHANCEMENT
-- Cải thiện tính năng ghi chú cho mua sắm
-- =====================================================

-- Bảng ingredient_shopping_notes - Ghi chú mặc định cho từng nguyên liệu
CREATE TABLE IF NOT EXISTS public.ingredient_shopping_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    note_type VARCHAR(50) NOT NULL, -- 'quality_tip', 'storage', 'selection', 'substitution', 'custom'
    note_text TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false, -- Hiển thị mặc định khi thêm vào shopping list
    priority INT DEFAULT 0, -- 0 = thấp, 1 = trung bình, 2 = cao
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ingredient_shopping_notes_ingredient ON public.ingredient_shopping_notes(ingredient_id);
CREATE INDEX idx_ingredient_shopping_notes_type ON public.ingredient_shopping_notes(note_type);

ALTER TABLE public.ingredient_shopping_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view ingredient shopping notes"
    ON public.ingredient_shopping_notes FOR SELECT
    USING (true);

-- Bảng user_shopping_note_templates - Template ghi chú của user
CREATE TABLE IF NOT EXISTS public.user_shopping_note_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    note_text TEXT NOT NULL,
    category VARCHAR(50), -- 'reminder', 'preference', 'quality', 'location'
    use_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_shopping_note_templates_user ON public.user_shopping_note_templates(user_id);

ALTER TABLE public.user_shopping_note_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own note templates"
    ON public.user_shopping_note_templates FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Bảng shopping_list_item_tags - Tags cho shopping list items
CREATE TABLE IF NOT EXISTS public.shopping_list_item_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_list_item_id UUID NOT NULL REFERENCES public.shopping_list_items(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL, -- 'urgent', 'optional', 'bulk_buy', 'fresh_only', 'organic_preferred'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shopping_list_item_tags_item ON public.shopping_list_item_tags(shopping_list_item_id);

ALTER TABLE public.shopping_list_item_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shopping item tags"
    ON public.shopping_list_item_tags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_list_items sli
            JOIN public.shopping_lists sl ON sli.shopping_list_id = sl.id
            WHERE sli.id = shopping_list_item_tags.shopping_list_item_id
            AND sl.user_id = auth.uid()
        )
    );

-- Cải thiện bảng shopping_list_items - Thêm cột mới
ALTER TABLE public.shopping_list_items 
ADD COLUMN IF NOT EXISTS custom_name VARCHAR(255), -- Tên tùy chỉnh (VD: "Cà chua bi hữu cơ" thay vì "Cà chua")
ADD COLUMN IF NOT EXISTS brand_preference VARCHAR(255), -- Thương hiệu ưa thích
ADD COLUMN IF NOT EXISTS store_location VARCHAR(255), -- Vị trí trong cửa hàng (VD: "Quầy rau tươi, hàng 3")
ADD COLUMN IF NOT EXISTS priority INT DEFAULT 0, -- 0 = bình thường, 1 = quan trọng, 2 = khẩn cấp
ADD COLUMN IF NOT EXISTS reminder TEXT, -- Lời nhắc đặc biệt
ADD COLUMN IF NOT EXISTS photo_url TEXT; -- Hình ảnh tham khảo

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Lấy ghi chú mặc định khi thêm ingredient vào shopping list
CREATE OR REPLACE FUNCTION public.get_ingredient_default_notes(p_ingredient_id UUID)
RETURNS TABLE (
    note_type VARCHAR,
    note_text TEXT,
    priority INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        isn.note_type,
        isn.note_text,
        isn.priority
    FROM public.ingredient_shopping_notes isn
    WHERE isn.ingredient_id = p_ingredient_id
        AND isn.is_default = true
    ORDER BY isn.priority DESC, isn.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Tự động thêm ghi chú mặc định khi tạo shopping list item
CREATE OR REPLACE FUNCTION public.auto_add_default_notes()
RETURNS TRIGGER AS $$
DECLARE
    default_note TEXT;
BEGIN
    -- Lấy ghi chú mặc định với priority cao nhất
    SELECT isn.note_text INTO default_note
    FROM public.ingredient_shopping_notes isn
    WHERE isn.ingredient_id = NEW.ingredient_id
        AND isn.is_default = true
    ORDER BY isn.priority DESC, isn.created_at DESC
    LIMIT 1;

    -- Nếu có và notes hiện tại là null thì thêm vào
    IF default_note IS NOT NULL AND NEW.notes IS NULL THEN
        NEW.notes := default_note;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER add_default_notes_to_shopping_item
    BEFORE INSERT ON public.shopping_list_items
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_add_default_notes();

-- Function: Tăng use_count cho template khi được sử dụng
CREATE OR REPLACE FUNCTION public.increment_template_use_count(p_template_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.user_shopping_note_templates
    SET use_count = use_count + 1
    WHERE id = p_template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Lấy các template phổ biến nhất của user
CREATE OR REPLACE FUNCTION public.get_popular_note_templates(p_user_id UUID, p_limit INT DEFAULT 5)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    note_text TEXT,
    category VARCHAR,
    use_count INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.note_text,
        t.category,
        t.use_count
    FROM public.user_shopping_note_templates t
    WHERE t.user_id = p_user_id
    ORDER BY t.use_count DESC, t.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Smart search shopping list items với notes
CREATE OR REPLACE FUNCTION public.search_shopping_items_with_notes(
    p_shopping_list_id UUID,
    p_search_query TEXT
)
RETURNS TABLE (
    id UUID,
    ingredient_name VARCHAR,
    quantity DECIMAL,
    unit VARCHAR,
    notes TEXT,
    custom_name VARCHAR,
    priority INT,
    is_purchased BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sli.id,
        i.name_vi,
        sli.quantity,
        sli.unit,
        sli.notes,
        sli.custom_name,
        sli.priority,
        sli.is_purchased
    FROM public.shopping_list_items sli
    JOIN public.ingredients i ON sli.ingredient_id = i.id
    WHERE sli.shopping_list_id = p_shopping_list_id
        AND (
            i.name_vi ILIKE '%' || p_search_query || '%'
            OR sli.notes ILIKE '%' || p_search_query || '%'
            OR sli.custom_name ILIKE '%' || p_search_query || '%'
        )
    ORDER BY sli.priority DESC, sli.is_purchased ASC, sli.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEED DATA - Ghi chú mặc định cho nguyên liệu phổ biến
-- =====================================================

-- Insert sample default notes cho một số nguyên liệu
INSERT INTO public.ingredient_shopping_notes (ingredient_id, note_type, note_text, is_default, priority)
SELECT 
    i.id,
    'quality_tip',
    CASE i.name
        WHEN 'tomato' THEN 'Chọn quả chắc, màu đỏ đều, không bị dập'
        WHEN 'tofu' THEN 'Kiểm tra hạn sử dụng, chọn loại còn tươi'
        WHEN 'mushroom' THEN 'Nấm tươi, không bị nhớt hay sũng nước'
        WHEN 'eggplant' THEN 'Chọn quả căng mọng, không nhăn nheo'
        WHEN 'water-spinach' THEN 'Lá xanh tươi, thân non không già'
    END,
    true,
    1
FROM public.ingredients i
WHERE i.name IN ('tomato', 'tofu', 'mushroom', 'eggplant', 'water-spinach')
ON CONFLICT DO NOTHING;

INSERT INTO public.ingredient_shopping_notes (ingredient_id, note_type, note_text, is_default, priority)
SELECT 
    i.id,
    'storage',
    CASE i.name
        WHEN 'tomato' THEN 'Để ngăn mát tủ lạnh, tránh ánh nắng'
        WHEN 'tofu' THEN 'Ngâm nước lạnh, để tủ lạnh, dùng trong 2-3 ngày'
        WHEN 'mushroom' THEN 'Bảo quản tủ lạnh, dùng trong 1-2 ngày'
        WHEN 'garlic' THEN 'Để khô ráo, thoáng mát'
    END,
    false,
    0
FROM public.ingredients i
WHERE i.name IN ('tomato', 'tofu', 'mushroom', 'garlic')
ON CONFLICT DO NOTHING;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ingredient_shopping_notes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_shopping_note_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Shopping list với notes và tags
CREATE OR REPLACE VIEW public.shopping_list_items_detailed AS
SELECT 
    sli.id,
    sli.shopping_list_id,
    sl.name as shopping_list_name,
    sl.user_id,
    i.name_vi as ingredient_name,
    i.image_url as ingredient_image,
    sli.custom_name,
    sli.quantity,
    sli.unit,
    sli.estimated_price,
    sli.actual_price,
    sli.is_purchased,
    sli.notes,
    sli.brand_preference,
    sli.store_location,
    sli.priority,
    sli.reminder,
    sli.photo_url,
    ARRAY_AGG(DISTINCT slit.tag) as tags,
    sli.created_at,
    sli.updated_at
FROM public.shopping_list_items sli
JOIN public.shopping_lists sl ON sli.shopping_list_id = sl.id
JOIN public.ingredients i ON sli.ingredient_id = i.id
LEFT JOIN public.shopping_list_item_tags slit ON sli.id = slit.shopping_list_item_id
GROUP BY sli.id, sl.name, sl.user_id, i.name_vi, i.image_url;

-- View: Ghi chú phổ biến cho từng nguyên liệu
CREATE OR REPLACE VIEW public.ingredient_notes_summary AS
SELECT 
    i.id as ingredient_id,
    i.name_vi as ingredient_name,
    COUNT(isn.id) as total_notes,
    COUNT(CASE WHEN isn.is_default THEN 1 END) as default_notes_count,
    ARRAY_AGG(DISTINCT isn.note_type) as note_types
FROM public.ingredients i
LEFT JOIN public.ingredient_shopping_notes isn ON i.id = isn.ingredient_id
GROUP BY i.id, i.name_vi;

