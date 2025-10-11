import { AuthForm } from '@/components/auth-form'
import { useQueryClient } from '@tanstack/react-query'

export const AuthPage = () => {
  const queryClient = useQueryClient();
  
  const handleSuccessfulLogin = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm onLoginSuccess={handleSuccessfulLogin} />
      </div>
    </div>
  )
}
