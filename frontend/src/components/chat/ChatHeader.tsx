import { Button } from '../ui/button'

export const ChatHeader = () => {
    return (
        <div className='flex w-full bg-(--color-primary-foreground) p-5'>
            <h1 className='text-2xl font-bold'>Talketeer</h1>
            <Button className='ml-auto'>Log out</Button>
        </div>
    )
}
