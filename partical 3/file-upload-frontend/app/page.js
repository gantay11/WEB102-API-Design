'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { register, handleSubmit, setValue } = useForm();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': []
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setValue('file', acceptedFiles);

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type.startsWith('image/')) {
          setFilePreview({ url: URL.createObjectURL(file), name: file.name, type: file.type });
        } else if (file.type === 'application/pdf') {
          setFilePreview({ name: file.name, type: file.type });
        } else {
          setFilePreview(null);
        }
      }
    }
  });

  const onSubmit = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);

      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentage);
        }
      });

      setUploadResult({ success: true, message: 'File uploaded successfully!', data: response.data });
    } catch (error) {
      setUploadResult({
        success: false,
        message: error.response?.data?.error || 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">File Upload</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          {isDragActive
            ? <p>Drop the file here...</p>
            : <p>Drag and drop a file here, or click to select<br/>
                <span className="text-sm text-gray-500">JPEG, PNG, PDF — max 5MB</span>
              </p>
          }
        </div>

        {/* File preview */}
        {filePreview && (
          <div className="mb-4">
            <h3 className="font-medium mb-1">Preview:</h3>
            <div className="border rounded p-2">
              {filePreview.type?.startsWith('image/') ? (
                <img src={filePreview.url} alt={filePreview.name} className="max-w-full h-auto max-h-40 rounded"/>
              ) : filePreview.type === 'application/pdf' ? (
                <div className="py-2 px-3 bg-gray-100 rounded flex items-center gap-2">
                  <span className="text-red-500">PDF</span>
                  <span>{filePreview.name}</span>
                </div>
              ) : (
                <div>File selected: {filePreview.name}</div>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
            <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {/* Result */}
        {uploadResult && (
          <div className={`p-3 rounded ${uploadResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p>{uploadResult.message}</p>
            {uploadResult.success && (
              <p className="text-sm mt-1">Saved as: {uploadResult.data.filename}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
        </button>

      </form>
    </main>
  );
}