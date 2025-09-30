import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, type FC, type ReactNode } from 'react'

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

// Hyperlink and embedding configuration
const supportedProtocols = [
    { protocol: 'http', openInNewTab: true, isEmbeddable: false },
    { protocol: 'https', openInNewTab: true, isEmbeddable: true },
    { protocol: 'steam', openInNewTab: false, isEmbeddable: false }
];
const supportedEmbedOrigins = ['https://media.tenor.com'];

interface MessageTextProps {
    content: string;
    isSelfMessage?: boolean;
}

export const MessageText: FC<MessageTextProps> = ({ content, isSelfMessage }) => {
    // Split messages by newlines first
    const lines = content.split('\n');

    const messageElements = lines.flatMap(line => {
        // Split each line by spaces
        const parts = line.split(' ');

        return (
            <div className={`w-full flex gap-1 flex-wrap ${isSelfMessage ? 'justify-end text-end' : 'justify-start text-start'}`}>
                {parts.map(part => {
                    const protocolObj = supportedProtocols.find(p => part.startsWith(`${p.protocol}://`));

                    if (!!protocolObj) {
                        return (
                            <a
                                key={part}
                                className={`text-[#3e85e0] visited:text-[#5f46ce] dark:text-[#5c59dd] dark:visited:text-[#714acc] hover:underline`}
                                href={part}
                                target={protocolObj.openInNewTab ? "_blank" : ''}
                                rel="noopener noreferrer"
                            >
                                {part}
                            </a>
                        )
                    }

                    return (
                        <span>{part}</span>
                    )
                })}
            </div>
        )
    })

    const embeddableElements = lines.flatMap(line => {
        return line.split(' ').map(part => {
            const protocolObj = supportedProtocols.find(p => part.startsWith(`${p.protocol}://`));
            if (!protocolObj) return null;

            // strictly for Tenor currently
            const isTenorLink = supportedEmbedOrigins.some(origin => part.startsWith(origin) && part.endsWith('.gif'));
            const tenorAltString = part.split('/').at(-1);

            return (protocolObj.isEmbeddable && isTenorLink) ? (
                <img
                    key={part}
                    className='max-w-[300px]'
                    src={part}
                    alt={tenorAltString}
                />
            ) : null;
        })
    });

    return (
        <div className={`w-full flex flex-col`}>
            <div className={`w-full flex flex-col ${isSelfMessage ? 'items-end text-end' : 'items-start text-start'}`}>
                {messageElements}
            </div>

            {embeddableElements.length > 0 && (
                <div className={`w-full flex flex-col ${isSelfMessage ? 'items-end text-end' : 'items-start text-start'}`}>
                    {embeddableElements}
                </div>
            )}
        </div>
    )
}
