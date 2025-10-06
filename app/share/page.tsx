"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShareContent } from '@/components/ShareContent'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'

export default function SharePage() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    const data = searchParams.get('data')
    
    if (type && data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setContent({
          title: parsedData.title || 'Nội dung chia sẻ',
          description: parsedData.description || '',
          type: type as 'recipe' | 'menu' | 'shopping' | 'weekly-plan',
          data: parsedData.data || {}
        })
      } catch (error) {
        console.error('Error parsing share data:', error)
        setContent({
          title: 'Lỗi tải nội dung',
          description: 'Không thể tải nội dung chia sẻ',
          type: 'recipe',
          data: {}
        })
      }
    }
  }, [searchParams])

  const downloadImage = async () => {
    if (!content) return
    
    setIsGenerating(true)
    try {
      const element = document.getElementById(`share-content-${content.type}`)
      if (!element) {
        toast.error('Không tìm thấy nội dung để tải')
        return
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      })
      
      const link = document.createElement('a')
      link.download = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      toast.success('Đã tải ảnh thành công')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Lỗi khi tạo ảnh')
    } finally {
      setIsGenerating(false)
    }
  }

  const shareCurrentPage = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.title || 'Nội dung chia sẻ',
        text: content?.description || '',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link chia sẻ')
    }
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải nội dung...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/95 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{content.title}</h1>
              <p className="text-sm text-muted-foreground">Nội dung được chia sẻ từ AnGi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={downloadImage}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? 'Đang tạo...' : 'Tải ảnh'}
            </Button>
            
            <Button
              onClick={shareCurrentPage}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Share Content */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
            <ShareContent content={content} />
          </div>

          {/* Info */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Cảm ơn bạn đã chia sẻ!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nội dung này được tạo bởi AnGi - Trợ lý ẩm thực AI thông minh. 
              Hãy khám phá thêm nhiều công thức và kế hoạch bữa ăn tuyệt vời khác.
            </p>
            
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button>
                  Khám phá thêm
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline">
                  Xem thực đơn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
