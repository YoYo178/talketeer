import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import { RoomMemberList } from './rooms/RoomMemberList'
import { useState } from 'react'

export const ChatMemberList = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isHoveringOnArrow, setIsHoveringOnArrow] = useState(false);

    return (
        <div className={`flex rounded-xl bg-accent dark:bg-primary-foreground transition-[padding-inline] duration-300 ${isCollapsed ? '' : 'pr-3'}`}>

            <button
                className={`h-full w-0 px-1.5 cursor-pointer flex flex-col items-center justify-center transition-[padding-inline] ${isHoveringOnArrow ? 'px-3' : ''}`}
                onMouseOver={() => setIsHoveringOnArrow(true)}
                onMouseOut={() => setIsHoveringOnArrow(false)}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ArrowLeftFromLine
                        className={`transition-[opacity] duration-100 text-muted-foreground size-4 ${isHoveringOnArrow ? 'opacity-100' : 'opacity-0'}`}
                    />
                ) : (
                    <ArrowRightFromLine
                        className={`transition-[opacity] duration-100 text-muted-foreground size-4 ${isHoveringOnArrow ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}
            </button>

            <div className={`w-86 my-4 flex flex-col gap-6 overflow-hidden transition-[opacity,max-width] duration-300 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-86'}`}>
                <p className='text-xl'>Member List</p>
                <RoomMemberList />
            </div>
        </div>
    )
}
