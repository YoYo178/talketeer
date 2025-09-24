import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChatButton } from './utility/ChatButton'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetGIFsQuery } from '@/hooks/network/gifs/useGetGIFsQuery';
import { useQueryClient } from '@tanstack/react-query';

export const GIFButton = () => {
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    const [GIFs, setGIFs] = useState<TenorGIFResponseObject[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const [query, setQuery] = useState('');
    const [lastQuery, setLastQuery] = useState('');

    const { data, refetch } = useGetGIFsQuery({
        queryKey: ['gif-search', query],
        queryParams: { query },
        enabled: false
    });

    useEffect(() => {
        if (!query) return;

        setIsLoading(true);

        const timeout = setTimeout(() => {
            queryClient.cancelQueries({ queryKey: ['gif-search', lastQuery] })
            setLastQuery(query);

            if (!data)
                refetch();
        }, 300);

        return () => {
            clearTimeout(timeout);
            setGIFs([])
        }
    }, [query]);

    useEffect(() => {
        if (data?.data?.results.length)
            setGIFs(data.data.results)
    }, [data])

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setGIFs([]);
        }
    }, [isOpen])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipContent>
                    <p>Send GIF</p>
                </TooltipContent>
                <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                        <ChatButton>GIF</ChatButton>
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
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {GIFs.length > 0 || isLoading ? (
                            <ScrollArea className='h-[314px] w-full'>
                                <div className="h-full grid grid-cols-2 gap-2">
                                    {GIFs.map(obj => (
                                        <img
                                            key={obj.id}
                                            className='hover:cursor-pointer break-inside-avoid'
                                            src={obj.media_formats?.tinygif?.url}
                                        />
                                    ))}
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
