import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { MenuNotification } from "@/components/MenuNotification"
import { HiddenItemsProvider } from "@/contexts/HiddenItemsContext"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "MealPlan AI - Trợ lý ẩm thực thông minh",
  description: 'Giải quyết câu hỏi "Hôm nay ăn gì?" với kế hoạch bữa ăn cá nhân hóa, quản lý dinh dưỡng và chi tiêu',
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
              <AuthProvider>
                <HiddenItemsProvider>
                  <Suspense fallback={null}>{children}</Suspense>
                  <MenuNotification />
                  <Toaster position="top-center" richColors closeButton />
                  <Analytics />
                </HiddenItemsProvider>
              </AuthProvider>
            </body>
    </html>
  )
}
