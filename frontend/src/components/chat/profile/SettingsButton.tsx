import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSettingsStore } from '@/hooks/state/useSettingsStore';
import { Settings } from 'lucide-react'
import type { FC } from 'react';

interface SettingsButtonProps {
    isOpen: boolean;
    onOpenChange: (state: boolean) => void;
}

export const SettingsButton: FC<SettingsButtonProps> = ({ isOpen, onOpenChange }) => {
    const { isDark, setIsDark } = useSettingsStore();

    const handleToggleTheme = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        setIsDark(!isDark);
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger className='focus:outline-none'>
                <Settings
                    className={
                        'cursor-pointer min-w-6 size-6 transition-all duration-800 ease-out ' +
                        `${isOpen ? 'rotate-180' : 'rotate-0'}`
                    }
                    onClick={() => onOpenChange(!isOpen)}
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
