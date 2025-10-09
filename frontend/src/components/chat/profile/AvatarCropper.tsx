import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCroppedImage } from '@/utils/avatar.utils';
import { useCallback, useState, type FC } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop';

interface AvatarCropperProps {
    imageSrc: string;
    onCancel: () => void;
    onCropDone: (file: File) => void;
}

export const AvatarCropper: FC<AvatarCropperProps> = ({ imageSrc, onCancel, onCropDone }) => {
    const [isOpen, setIsOpen] = useState(true);

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setcroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedArea: Area) => {
        setcroppedAreaPixels(croppedArea)
    }, []);

    const createCroppedImage = async () => {
        if (!croppedAreaPixels)
            return;

        const file = await getCroppedImage(imageSrc, croppedAreaPixels);
        onCropDone(file);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='h-[500px] '>

                <DialogHeader>
                    <DialogTitle>Crop avatar</DialogTitle>
                    <DialogDescription>Crop avatar as per you like!</DialogDescription>
                </DialogHeader>

                <div className='relative h-[300px]'>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        cropShape='round'
                        showGrid={false}
                        classes={{
                            containerClassName: '',
                            mediaClassName: ''
                        }}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline' onClick={onCancel}>
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={createCroppedImage}>
                        Save
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
