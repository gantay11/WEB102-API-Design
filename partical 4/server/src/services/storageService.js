const supabase = require('../lib/supabase');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Generate a unique file name to avoid collisions
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
};

// Upload a file to Supabase Storage
const uploadFile = async (bucketName, filePath, fileData, mimeType) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileData, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const fileUrl = getPublicUrl(bucketName, filePath);
    return { data, fileUrl };
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    throw error;
  }
};

// Get a public URL for a file
const getPublicUrl = (bucketName, filePath) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

// Remove a file from storage
const removeFile = async (bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error removing file from ${bucketName}:`, error);
    throw error;
  }
};

// Upload a local file to Supabase
const uploadLocalFile = async (bucketName, localFilePath, remoteFilePath) => {
  try {
    const fileBuffer = fs.readFileSync(localFilePath);

    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
    if (bucketError) throw new Error(`Bucket connection error: ${bucketError.message}`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(remoteFilePath, fileBuffer, {
        contentType: getMimeType(localFilePath),
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const fileUrl = getPublicUrl(bucketName, remoteFilePath);
    return { data, fileUrl };
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    throw error;
  }
};

// Get the MIME type based on file extension
const getMimeType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

module.exports = {
  uploadFile,
  getPublicUrl,
  removeFile,
  uploadLocalFile,
  generateUniqueFileName
};