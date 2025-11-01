import { LoaderCircle, MessagesSquare } from 'lucide-react'

export const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-6">

                <div className='flex gap-2 items-center'>
                    <MessagesSquare className='size-12' />
                    <h1 className='text-4xl font-bold'>Talketeer</h1>
                </div>

                <div className='text-center'>
                    <LoaderCircle className='size-10 animate-spin' />
                </div>
            </div>
        </div>
    )
}
