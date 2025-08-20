import type { IRoom } from '@/types/room.types'

export const ChatWindow = ({ selectedRoom }: { selectedRoom: IRoom | null }) => {
    if (!selectedRoom) {
        return (
            <div className='flex-1 bg-background p-6 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-xl font-semibold mb-1'>Join a room to get started!</div>
                    <div className='text-sm text-muted-foreground'>Select a room on the left or create a new one.</div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 bg-card mt-3 p-0 rounded-xl flex flex-col h-full'>
            <div className='flex-1 overflow-y-auto p-4'>
                {/* Messages list placeholder until backend is ready */}
                <div className='text-sm text-muted-foreground'>No messages yet.</div>
            </div>
            <div className='border-t border-border/40 p-3'>
                {/* Composer placeholder */}
                <div className='text-sm text-muted-foreground'>Message composer will appear here.</div>
            </div>
        </div>
    )
}
