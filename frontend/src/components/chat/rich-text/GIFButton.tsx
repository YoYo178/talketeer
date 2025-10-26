import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChatButton } from './utility/ChatButton'
import { useEffect, useMemo, useState, type FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetGIFsQuery } from '@/hooks/network/gifs/useGetGIFsQuery';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/socket';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';

interface GIFButtonProps {
    disabled?: boolean;
}

export const GIFButton: FC<GIFButtonProps> = ({ disabled }) => {
    const queryClient = useQueryClient();
    const { dmRoomId, joinedRoomId } = useRoomsStore();

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [lastQuery, setLastQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const { data, refetch } = useGetGIFsQuery({
        queryKey: ['gif-search', query],
        queryParams: { query },
        enabled: false
    });

    const GIFs = useMemo(() => data?.data?.results ?? [], [data])

    useEffect(() => {
        if (!query) return;

        setIsLoading(true);

        const timeout = setTimeout(() => {
            queryClient.cancelQueries({ queryKey: ['gif-search', lastQuery] })
            setLastQuery(query);

            if (!data)
                refetch();
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (!isOpen)
            setQuery('');
    }, [isOpen])

    if (!joinedRoomId)
        return;

    const handleSendGIF = (link: string) => {
        if (!!dmRoomId)
            socket.emit('sendMessage', true, dmRoomId, link, ({ success }) => setIsOpen(!success))
        else if (!!joinedRoomId)
            socket.emit('sendMessage', false, joinedRoomId, link, ({ success }) => setIsOpen(!success))
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipContent>
                    <p>Send GIF</p>
                </TooltipContent>
                <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                        <ChatButton disabled={disabled}>GIF</ChatButton>
                    </TooltipTrigger>
                </PopoverTrigger>
                <PopoverContent
                    align='end'
                    side='top'
                    alignOffset={30}
                    sideOffset={0}
                    asChild
                >
                    <div className='flex flex-col gap-4 items-center h-[400px] w-[350px]'>
                        <Input
                            type='text'
                            placeholder='Cat vibing'
                            autoComplete='off'
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {GIFs.length > 0 || isLoading ? (
                            <ScrollArea className='h-[314px] w-full'>

                                {/* This grid contains 2 nested grids to ensure a masonry grid layout */}
                                <div className='h-full grid grid-cols-2 gap-2'>

                                    {/* Left column */}
                                    <div className='grid h-fit gap-2'>
                                        {GIFs.map((obj, i) => {
                                            if (i % 2 !== 0)
                                                return null;

                                            return (
                                                <img
                                                    key={obj.id}
                                                    className='hover:cursor-pointer break-inside-avoid'
                                                    src={obj.media_formats?.tinygif?.url}
                                                    onClick={() => handleSendGIF(obj.media_formats.gif.url)}
                                                />
                                            )
                                        })}
                                    </div>

                                    {/* Right column */}
                                    <div className='grid h-fit gap-2'>
                                        {GIFs.map((obj, i) => {
                                            if (i % 2 === 0)
                                                return null;

                                            return (
                                                <img
                                                    key={obj.id}
                                                    className='hover:cursor-pointer break-inside-avoid'
                                                    src={obj.media_formats?.tinygif?.url}
                                                    onClick={() => handleSendGIF(obj.media_formats.gif.url)}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className='flex-1 flex items-center justify-center text-center text-muted-foreground'>Write something to get started!</div>
                        )}
                    </div>
                </PopoverContent>
            </Tooltip>
        </Popover>
    )
}
