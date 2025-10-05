"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  ChefHat,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleGoogleLogin = () => {
    toast.info("🔐 Tính năng đang phát triển", {
      description: "Đăng nhập Google sẽ sớm có"
    })
  }

  const handleFacebookLogin = () => {
    toast.info("🔐 Tính năng đang phát triển", {
      description: "Đăng nhập Facebook sẽ sớm có"
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      toast.success("✅ Đăng nhập thành công!", {
        description: `Chào mừng trở lại, ${formData.email}`
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } else {
      toast.success("✅ Đăng ký thành công!", {
        description: "Tài khoản đã được tạo"
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-chart-1 to-chart-5 flex items-center justify-center shadow-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-5 bg-clip-text text-transparent">
                MealPlan AI
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin ? "Đăng nhập vào tài khoản" : "Tạo tài khoản mới"}
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={handleGoogleLogin}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Tiếp tục với Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-11"
                onClick={handleFacebookLogin}
              >
                <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Tiếp tục với Facebook
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                Hoặc
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Tên của bạn</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nhập tên..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => toast.info("Tính năng sớm có")}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full h-11" size="lg">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold hover:underline"
                >
                  {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
              </p>
            </div>

            {/* Guest Mode */}
            <div className="mt-6">
              <Link href="/">
                <Button variant="ghost" className="w-full" size="sm">
                  Tiếp tục với chế độ khách
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <button className="text-primary hover:underline">Điều khoản dịch vụ</button>
          {" "}và{" "}
          <button className="text-primary hover:underline">Chính sách bảo mật</button>
        </p>
      </motion.div>
    </div>
  )
}

