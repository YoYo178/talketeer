import { useMutation } from '@tanstack/react-query';
import { API as axiosInstance } from "../../../config/api.config"
import { toast } from 'sonner'; 

type UploadVariables = {
  file: File;
  roomId: string;
};

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: async ({ file, roomId }: UploadVariables) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);

      // const { data } = await axiosInstance.post('/files/upload', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      const { data } = await axiosInstance.post('/files/upload', formData);
      return data;
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    }
  });
};