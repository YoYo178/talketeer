import { Skeleton } from '@/components/ui/skeleton';
import React, { type FC } from 'react'

interface MessageTextSkeletonProps {
    height: number;
    width: number;
}

export const MessageTextSkeleton: FC<MessageTextSkeletonProps> = React.memo(({ height, width }) => {
    return (
        <Skeleton style={{
            height: `${height}rem`,
            width: `${width}rem`
        }} />
    )
})

interface MessageTextProps {
    content: string;
}

export const MessageText: FC<MessageTextProps> = ({ content }) => {
    return (
        <div className='whitespace-pre-wrap wrap-anywhere'>{content}</div>
    )
}
