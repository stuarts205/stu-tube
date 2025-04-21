import ResponsiveModal from '@/components/responsive-modal'
import { UploadDropzone } from '@/lib/uploadthing'
import { trpc } from '@/trpc/client'
import React from 'react'

interface BannerUploadModalProps {
    userId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BannerUploadModal = ({userId, open, onOpenChange}:BannerUploadModalProps) => {
  const utils = trpc.useUtils()
  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId})    
    onOpenChange(false)    
  }

  return (
    <ResponsiveModal title='Upload a banner' open={open} onOpenChange={onOpenChange}>
        <UploadDropzone endpoint='bannerUploader' onClientUploadComplete={onUploadComplete} />
    </ResponsiveModal>
  )
}

export default BannerUploadModal