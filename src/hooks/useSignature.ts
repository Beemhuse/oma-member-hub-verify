// hooks/useSignatureUpload.ts
import useSWRMutation from 'swr/mutation';
import { uploadSignature } from '../lib/api';
import { toast } from './use-toast';

export const useSignatureUpload = () => {
  return useSWRMutation(
    'signature-upload',
    async (key, { arg }: { arg: File }) => {
      return uploadSignature(arg);
    },
    {
      onSuccess: (data) => {
        toast({
          title: 'Success',
          description: data.message || 'Signature uploaded successfully',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to upload signature',
          variant: 'destructive',
        });
      },
    }
  );
};