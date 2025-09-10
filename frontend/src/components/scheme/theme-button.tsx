import { forwardRef, useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

const THEME_STORAGE_KEY = "theme-preference"

function getInitialIsDark(): boolean {
    if (typeof window === "undefined") return false
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "dark") return true
    if (stored === "light") return false
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const ToggleThemeButton = forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
    const [isDark, setIsDark] = useState<boolean>(getInitialIsDark)

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add("dark")
            window.localStorage.setItem(THEME_STORAGE_KEY, "dark")
        } else {
            root.classList.remove("dark")
            window.localStorage.setItem(THEME_STORAGE_KEY, "light")
        }
    }, [isDark])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        props?.onClick?.(e);
        setIsDark(v => !v)
    }

    return (
        <Button
            ref={ref}
            type="button"
            size="icon"
            variant="outline"
            aria-label="Toggle theme"
            className={`rounded-full shadow-md ${className}`}
            {...props}
            onClick={handleClick}
        >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
    )
})