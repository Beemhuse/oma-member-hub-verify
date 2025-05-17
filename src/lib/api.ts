// lib/api.ts
interface SignatureUploadResponse {
  success: boolean;
  message: string;
  asset: {
    _id: string;
    url: string;
  };
}

export const uploadSignature = async (
  file: File
): Promise<SignatureUploadResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    "https://oma-backend-1.onrender.com/upload-image",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload signature");
  }

  return response.json();
};
