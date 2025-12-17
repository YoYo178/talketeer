import { API_URL } from "@/config/api.config";
import type { Area } from "react-easy-crop";

// a little hackish solution by using .replace()
export const getAvatarUrl = (avatarPath: string) => `${API_URL.replace('talketeer/api', `talketeer/${avatarPath}`)}`;

export async function getCroppedImage(imageSrc: string, crop: Area): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    )

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
                resolve(file)
            }
        }, 'image/jpeg')
    })
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.crossOrigin = 'anonymous'
        image.src = url;
    });
}