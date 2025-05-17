import React from "react";
import { Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberImageUploadProps {
  control: any;
  defaultImage?: string;
  onImageUploaded: (url: string | null) => void;
  onUploadStatusChange: (isUploading: boolean) => void;
  isEditing: boolean;
}

const MemberImageUpload: React.FC<MemberImageUploadProps> = ({
  control,
  defaultImage,
  onImageUploaded,
  onUploadStatusChange,
  isEditing,
}) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [currentImage, setCurrentImage] = React.useState<string | null>(
    defaultImage || null
  );

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      onUploadStatusChange(true);

      try {
        // Replace this with your actual upload logic
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("https://oma-backend-1.onrender.com/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        const imageUrl = data.asset._id; // Adjust based on your API response
        setCurrentImage(imageUrl);
        onImageUploaded(imageUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        setPreviewImage(null);
        onImageUploaded(null);
      } finally {
        onUploadStatusChange(false);
      }
    },
    [onImageUploaded, onUploadStatusChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = () => {
    setPreviewImage(null);
    setCurrentImage(null);
    onImageUploaded(null);
  };

  // Determine if we should show the current image or the preview
  const displayImage = previewImage || currentImage;

  return (
    <Controller
      name="image"
      control={control}
      render={({ fieldState }) => (
        <div>
          <label className="block text-sm font-medium mb-2">Profile Image</label>
          <div className="flex items-center gap-4">
            {displayImage ? (
              <div className="relative">
                <img
                  src={displayImage}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full object-cover border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer w-full ${
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="h-8 w-8 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? "Drop the image here"
                      : "Drag & drop an image here, or click to select"}
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, WEBP (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          {fieldState.error && (
            <p className="text-sm text-red-500 mt-1">
              {fieldState.error.message}
            </p>
          )}
          {isEditing && currentImage && (
            <p className="text-xs text-gray-500 mt-2">
              Click the X to remove current image or drag a new one to replace
            </p>
          )}
        </div>
      )}
    />
  );
};

export default MemberImageUpload;