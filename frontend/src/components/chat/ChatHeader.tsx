import { Button } from '../ui/button'

export const ChatHeader = () => {
    return (
        <div className='flex w-[calc(100%-1.5rem)] bg-(--color-primary-foreground) m-3 mb-0 p-5 rounded-xl'>
            <h1 className='text-2xl font-bold'>Talketeer</h1>
            <Button className='ml-auto'>Log out</Button>
        </div>
    )
}
