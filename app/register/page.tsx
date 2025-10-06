"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AppHeader } from "@/components/AppHeader"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [preferences, setPreferences] = useState({
    diet: "vegetarian",
    allergies: [] as string[],
    budget: 1000000
  })
  
  const { login } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (name === "allergies") {
      setPreferences(prev => ({
        ...prev,
        allergies: checked 
          ? [...prev.allergies, value]
          : prev.allergies.filter(allergy => allergy !== value)
      }))
    } else {
      setPreferences(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }))
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ tên")
      return false
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email")
      return false
    }
    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu")
      return false
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const userData = {
        id: "user-" + Date.now(),
        name: formData.name,
        email: formData.email,
        avatar: "/placeholder-user.jpg",
        preferences: {
          diet: preferences.diet,
          allergies: preferences.allergies,
          budget: preferences.budget
        }
      }
      
      login(userData)
      toast.success("Đăng ký thành công! Chào mừng bạn đến với AnGi!")
      router.push("/")
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Đăng ký tài khoản
              </CardTitle>
              <CardDescription className="text-center">
                Tạo tài khoản AnGi để sử dụng đầy đủ tính năng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại (tùy chọn)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Sở thích cá nhân</h3>
                  
                  <div className="space-y-2">
                    <Label>Chế độ ăn</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="diet"
                          value="vegetarian"
                          checked={preferences.diet === "vegetarian"}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-primary"
                        />
                        <span className="text-sm">Chay</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="diet"
                          value="vegan"
                          checked={preferences.diet === "vegan"}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-primary"
                        />
                        <span className="text-sm">Thuần chay</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="diet"
                          value="omnivore"
                          checked={preferences.diet === "omnivore"}
                          onChange={handlePreferenceChange}
                          className="h-4 w-4 text-primary"
                        />
                        <span className="text-sm">Ăn tạp</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dị ứng thực phẩm</Label>
                    <div className="space-y-2">
                      {["gluten", "lactose", "nuts", "soy"].map((allergy) => (
                        <label key={allergy} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="allergies"
                            value={allergy}
                            checked={preferences.allergies.includes(allergy)}
                            onChange={handlePreferenceChange}
                            className="h-4 w-4 text-primary"
                          />
                          <span className="text-sm capitalize">{allergy}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Ngân sách hàng tuần (VNĐ)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="1000000"
                      value={preferences.budget}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        budget: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Đăng ký
                    </>
                  )}
                </Button>
              </form>
              
              <div className="text-center text-sm">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
