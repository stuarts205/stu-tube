import { Video } from "@mux/mux-node/resources/index.mjs";
import React from "react";
import { VideoGetManyOutput } from "../../types";
import { useMemo } from "react";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import { combineEventHandlers } from "recharts/types/util/ChartUtils";
import { formatDistanceToNow } from "date-fns";
import VideoMenu from "./video-menu";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en', {
            notation: 'compact',            
        }).format(data.viewCount)
    }, [data.viewCount])

    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, {addSuffix: true})
    }, [data.createdAt])

  return (
    <div className="flex gap-3">
      <Link href={`/videos/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="imin-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
            {data.title}
          </h3>
        </Link>
        <Link href={`/videos/${data.user.id}`}>
            <UserInfo
                name={data.user.name}
            />
        </Link>
        <Link href={`/videos/${data.user.id}`}>
            <p className='text-sm text-gray-600 line-clamp-1'>
                {compactViews} views <span>&bull;</span> {compactDate} likes
            </p>
        </Link>
      </div>
      <div className='flex-shrink-0'>
        <VideoMenu
            videoId={data.id}
            onRemove={onRemove}
        />
      </div>
    </div>
  );
};

export default VideoInfo;
