import { Skeleton } from '@/components/ui/skeleton';
import { type FC, memo } from 'react';
import { FileText, Download, Play, Music } from 'lucide-react';
import { API_URL } from '@/config/api.config'; 

const PROTOCOLS = [
    { protocol: 'http', openInNewTab: true, isEmbeddable: false },
    { protocol: 'https', openInNewTab: true, isEmbeddable: true },
];

const TENOR_ORIGIN = 'https://media.tenor.com';

const EXTENSIONS = {
    IMAGE: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
    VIDEO: ['.mp4', '.webm', '.ogg'],
    AUDIO: ['.mp3', '.wav', '.mpeg'],
    PDF:   ['.pdf']
};

const getFullUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const baseUrl = API_URL ? new URL(API_URL).origin : 'http://localhost:3000';
    return `${baseUrl}${path}`;
};

const getFileType = (path: string) => {
    if (!path.startsWith('/assets/attachments/')) return null;
    
    const lower = path.toLowerCase();
    
    if (EXTENSIONS.IMAGE.some(ext => lower.endsWith(ext))) return 'image';
    if (EXTENSIONS.VIDEO.some(ext => lower.endsWith(ext))) return 'video';
    if (EXTENSIONS.AUDIO.some(ext => lower.endsWith(ext))) return 'audio';
    if (EXTENSIONS.PDF.some(ext => lower.endsWith(ext))) return 'pdf';
    
    return 'file';
};

const getFileName = (path: string) => {
    const rawName = path.split('/').pop() || 'file';
    const cleanName = rawName.replace(/^\d+-\d+-/, '');
    return cleanName.replace(/_/g, ' ');
};

interface MessageTextSkeletonProps {
    height: number;
    width: number;
}

export const MessageTextSkeleton: FC<MessageTextSkeletonProps> = memo(({ height, width }) => {
    return (
        <Skeleton style={{ height: `${height}rem`, width: `${width}rem` }} />
    )
})

interface MessageTextProps {
    content: string;
    isSelfMessage?: boolean;
}

export const MessageText: FC<MessageTextProps> = ({ content, isSelfMessage }) => {
    const lines = content.split('\n');
    const messageElements = lines.flatMap((line, i) => {
        const parts = line.split(' ');
        
        return (
            <div key={`line-${i}`} className={`w-full flex gap-1 flex-wrap whitespace-pre-wrap wrap-anywhere ${isSelfMessage ? 'justify-end text-end' : 'justify-start text-start'}`}>
                {parts.map((part, j) => {
                    if (getFileType(part)) {
                        return null; 
                    }
                    const protocolObj = PROTOCOLS.find(p => part.startsWith(`${p.protocol}://`));
                    if (!!protocolObj) {
                        return (
                            <a
                                key={`part-${i}-${j}`}
                                className="text-[#3e85e0] hover:underline break-all"
                                href={part}
                                target={protocolObj.openInNewTab ? "_blank" : ''}
                                rel="noopener noreferrer"
                            >
                                {part}
                            </a>
                        );
                    }

                    return <span key={`part-${i}-${j}`}>{part}</span>;
                })}
            </div>
        );
    });

    const embeddableElements = lines.flatMap((line, i) => {
        return line.split(' ').map((part, j) => {
            const fileType = getFileType(part);
            const fullSrc = getFullUrl(part);

            if (fileType) {
                switch (fileType) {
                    case 'image':
                        return (
                            <img
                                key={`media-${i}-${j}`}
                                src={fullSrc}
                                alt="attachment"
                                className="max-w-[250px] md:max-w-[350px] rounded-md mt-2 cursor-pointer hover:opacity-95"
                                onClick={() => window.open(fullSrc, '_blank')}
                            />
                        );
                    
                    case 'video':
                        return (
                            <video
                                key={`media-${i}-${j}`}
                                controls
                                className="max-w-[250px] md:max-w-[350px] rounded-md mt-2 bg-black"
                                src={fullSrc}
                            />
                        );

                    case 'audio':
                        return (
                            <div key={`media-${i}-${j}`} className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md mt-2 min-w-[250px]">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Music className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                     <span className="text-xs text-muted-foreground truncate max-w-[180px] mb-1">
                                        {getFileName(part)}
                                     </span>
                                    <audio controls className="h-8 w-full max-w-[200px]" src={fullSrc} />
                                </div>
                            </div>
                        );

                    case 'pdf':
                    case 'file':
                        return (
                            <a 
                                key={`media-${i}-${j}`}
                                href={fullSrc}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 bg-secondary/30 hover:bg-secondary/50 border border-border p-3 rounded-lg mt-2 transition-colors max-w-[300px] text-left group"
                            >
                                <div className="bg-primary/10 p-2 rounded-md">
                                    {fileType === 'pdf' 
                                        ? <FileText className="h-6 w-6 text-red-500" />
                                        : <FileText className="h-6 w-6 text-blue-500" />
                                    }
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium truncate text-foreground">
                                        {getFileName(part)}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase">
                                        {part.split('.').pop()} File
                                    </p>
                                </div>
                                <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                        );
                }
            }

            if (part.startsWith(TENOR_ORIGIN) && part.endsWith('.gif')) {
                return (
                    <img
                        key={`tenor-${i}-${j}`}
                        className="max-w-[250px] md:max-w-[350px] rounded-md mt-2"
                        src={part}
                        alt="GIF"
                    />
                );
            }

            return null;
        }).filter(Boolean);
    });

    return (
        <div className="w-full flex flex-col">
             <div className={`w-full flex flex-col ${isSelfMessage ? 'items-end text-end' : 'items-start text-start'}`}>
                {messageElements}
            </div>

            {embeddableElements.length > 0 && (
                <div className={`w-full flex flex-col gap-2 ${isSelfMessage ? 'items-end text-end' : 'items-start text-start'}`}>
                    {embeddableElements}
                </div>
            )}
        </div>
    );
}