import { ToggleThemeButton } from "@/components/scheme/theme-button"
import { Outlet } from "react-router-dom"

export function GuestLayout() {
  return (
    <div className="min-h-svh">
      <Outlet />
      <ToggleThemeButton className="fixed bottom-4 right-4 z-50" />
    </div>
  )
}

export default GuestLayout;
