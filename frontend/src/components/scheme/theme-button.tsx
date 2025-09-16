import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FC, RefObject } from "react"
import { useSettingsStore } from "@/hooks/state/useSettingsStore"

type ToggleThemeButtonProps = {
    ref?: RefObject<HTMLButtonElement>
} & React.ComponentProps<'button'>

export const ToggleThemeButton: FC<ToggleThemeButtonProps> = ({ ref, ...props }) => {

    const { isDark, setIsDark } = useSettingsStore();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        props?.onClick?.(e);
        setIsDark(!isDark)
    }

    return (
        <Button
            ref={ref}
            type="button"
            size="icon"
            variant="outline"
            aria-label="Toggle theme"
            className={`rounded-full shadow-md ${props.className}`}
            {...props}
            onClick={handleClick}
        >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
    )
}