import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSettingsStore } from '@/hooks/state/useSettingsStore';
import { Settings } from 'lucide-react'
import { useState } from 'react';

export const SettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDark, setIsDark } = useSettingsStore();

    const handleToggleTheme = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        setIsDark(!isDark);
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className='focus:outline-none'>
                <Settings
                    className={
                        'cursor-pointer min-w-6 size-6 transition-[rotate] duration-800 ease-out ' +
                        `${isOpen ? 'rotate-180' : 'rotate-0'}`
                    }
                    onClick={() => setIsOpen(!isOpen)}
                >
                </Settings>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side='bottom'
                align='end'
                sideOffset={12}
                alignOffset={20}
                className='[&>*]:cursor-pointer'
            >
                <DropdownMenuItem onClick={handleToggleTheme}>Toggle theme</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
