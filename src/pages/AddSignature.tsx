// components/members/AddSignaturePage.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSignatureUpload } from "@/hooks/useSignature";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";

const AddSignaturePage = ({ onRefresh }: { onRefresh: () => void }) => {
  const navigate = useNavigate();
  const { trigger: uploadSignature, isMutating } = useSignatureUpload();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 1. Fetch existing signature info, replace `/signature` with your actual endpoint
  const {
    data: signatureData,
    mutate,
    isLoading,
  } = useApiQuery<{
    signatureUrl?: string;
    signatureId?: string;
    success?: string;
  }>({
    url: "/signature",
  });
  const { mutate: deleteSignature, isMutating: isDeleting } = useApiMutation<
    { success: boolean },
    { id: string }
  >({
    method: "DELETE",
    url: "/signature",
    onSuccess: () => {
      // Refresh data after delete
        onRefresh()
        mutate()
    },
    onError: (err) => setError(err.message),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (only images)
    if (!file.type.match("image.*")) {
      setError("Please upload an image file for the signature");
      return;
    }

    // Validate file size (e.g., 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError("Signature image must be less than 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a signature image");
      return;
    }

    try {
      const res = await uploadSignature(file);
      const response = await fetch(
        "https://oma-backend-1.onrender.com/signature",
        // "http://localhost:5000/signature",
        {
          method: "POST",
          body: JSON.stringify({ assetId: res?.asset._id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload signature");
      }
      mutate();
      //   navigate(".", { replace: true, state: { key: Date.now() } });
      return response.json();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload signature"
      );
    }
  };
  const handleDelete = () => {
    if (signatureData?.signatureId) {
      deleteSignature({ id: signatureData.signatureId });
    }
  };
//   console.log(signatureData, mutate())
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Admin Signature</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {signatureData?.success ? (
          <div>
            <p className="text-sm text-gray-500 mb-2">Current Signature:</p>
            <img
              src={signatureData.signatureUrl}
              alt="Current Signature"
              className="h-20 w-auto border rounded object-contain mb-4"
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex justify-center rounded-md border border-red-500 bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Signature"}
            </button>
          </div>
        ) : (
          <>
            <div>
              <label
                htmlFor="adminSignature"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Signature (Image Only)
              </label>
              <input
                type="file"
                name="adminSignature"
                id="adminSignature"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {preview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Signature Preview:</p>
                  <img
                    src={preview}
                    alt="Signature preview"
                    className="h-20 w-auto border rounded object-contain"
                  />
                </div>
              )}
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isMutating}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMutating ? "Uploading..." : "Upload Signature"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddSignaturePage;
