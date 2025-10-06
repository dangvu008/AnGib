"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Share2, 
  Facebook, 
  MessageCircle, 
  Copy, 
  Download,
  Link as LinkIcon,
  Check
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'

interface ShareButtonProps {
  content: {
    title: string
    description: string
    type: 'recipe' | 'menu' | 'shopping' | 'weekly-plan'
    data: any
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function ShareButton({ 
  content, 
  className = '', 
  size = 'md',
  variant = 'outline'
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateShareUrl = () => {
    const baseUrl = window.location.origin
    const encodedData = encodeURIComponent(JSON.stringify(content))
    return `${baseUrl}/share?type=${content.type}&data=${encodedData}`
  }

  const generateImage = async () => {
    setIsGenerating(true)
    try {
      // Find the content element to capture
      const element = document.getElementById(`share-content-${content.type}`)
      if (!element) {
        toast.error('Không tìm thấy nội dung để chia sẻ')
        return null
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      })
      
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Lỗi khi tạo ảnh chia sẻ')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToFacebook = async () => {
    const shareUrl = generateShareUrl()
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
    toast.success('Đã mở Facebook để chia sẻ')
  }

  const shareToZalo = async () => {
    const shareUrl = generateShareUrl()
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(content.title)}`
    window.open(zaloUrl, '_blank', 'width=600,height=400')
    toast.success('Đã mở Zalo để chia sẻ')
  }

  const copyLink = async () => {
    const shareUrl = generateShareUrl()
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Đã sao chép link chia sẻ')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadImage = async () => {
    const imageDataUrl = await generateImage()
    if (imageDataUrl) {
      const link = document.createElement('a')
      link.download = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`
      link.href = imageDataUrl
      link.click()
      toast.success('Đã tải ảnh chia sẻ')
    }
  }

  const shareWithImage = async (platform: 'facebook' | 'zalo') => {
    const imageDataUrl = await generateImage()
    if (!imageDataUrl) return

    const shareUrl = generateShareUrl()
    
    if (platform === 'facebook') {
      // For Facebook, we'll share the URL and let Facebook fetch the image
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
      window.open(facebookUrl, '_blank', 'width=600,height=400')
    } else {
      // For Zalo, we can share with image
      const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(content.title)}`
      window.open(zaloUrl, '_blank', 'width=600,height=400')
    }
    
    toast.success(`Đã chia sẻ lên ${platform === 'facebook' ? 'Facebook' : 'Zalo'}`)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`gap-2 ${className}`}
          >
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chia sẻ {content.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-sm mb-1">{content.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {content.description}
              </p>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={shareToFacebook}
                variant="outline"
                className="gap-2 h-12"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                onClick={shareToZalo}
                variant="outline"
                className="gap-2 h-12"
              >
                <MessageCircle className="h-5 w-5 text-blue-500" />
                Zalo
              </Button>
            </div>

            {/* Advanced Options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tùy chọn nâng cao</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={copyLink}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Đã sao' : 'Sao chép link'}
                </Button>
                
                <Button
                  onClick={downloadImage}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  disabled={isGenerating}
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? 'Đang tạo...' : 'Tải ảnh'}
                </Button>
              </div>
            </div>

            {/* Share with Image */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Chia sẻ kèm ảnh</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => shareWithImage('facebook')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isGenerating}
                >
                  <Facebook className="h-4 w-4" />
                  Facebook + Ảnh
                </Button>
                
                <Button
                  onClick={() => shareWithImage('zalo')}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isGenerating}
                >
                  <MessageCircle className="h-4 w-4" />
                  Zalo + Ảnh
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Quick share buttons for specific platforms
export function QuickShareButtons({ content }: { content: ShareButtonProps['content'] }) {
  const shareUrl = `${window.location.origin}/share?type=${content.type}&data=${encodeURIComponent(JSON.stringify(content))}`

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
    toast.success('Đã mở Facebook để chia sẻ')
  }

  const shareToZalo = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(content.title)}`
    window.open(zaloUrl, '_blank', 'width=600,height=400')
    toast.success('Đã mở Zalo để chia sẻ')
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={shareToFacebook}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Facebook className="h-4 w-4 text-blue-600" />
        Facebook
      </Button>
      
      <Button
        onClick={shareToZalo}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <MessageCircle className="h-4 w-4 text-blue-500" />
        Zalo
      </Button>
    </div>
  )
}
