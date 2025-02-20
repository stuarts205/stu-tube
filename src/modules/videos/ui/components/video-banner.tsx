import React from 'react'
import { VideoGetOneOutput } from '../../types'
import { AlertTriangleIcon } from 'lucide-react'

interface VideoBannerProps {
    status: VideoGetOneOutput['muxStatus']
}


const VideoBanner = ({status}: VideoBannerProps) => {
    if(status === 'ready') return null

  return (
    <div className='bg-yellow-500 py-3 px-4 rounded-b-xl flex items-center gap-2'>
        <AlertTriangleIcon className='size-4' />
        <p className='text-black text-xs md:text-sm font-medium line-clamp-1'>Video is still processing</p>
    </div>
  )
}

export default VideoBanner