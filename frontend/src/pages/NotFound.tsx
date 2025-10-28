import { Button } from "@/components/ui/button"
import { MessagesSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6">

        <div className='flex gap-2 items-center'>
          <MessagesSquare className='size-12' />
          <h1 className='text-4xl font-bold'>Talketeer</h1>
        </div>

        <div className='text-center'>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Page not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The page you are looking for cannot be found.
          </p>
          <Button
            onClick={() => navigate('/', { replace: true })}
            className="px-4 py-2"
          >
            Return to home
          </Button>
        </div>
      </div>
    </div>
  )
}
