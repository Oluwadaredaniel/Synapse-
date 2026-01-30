import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Helper to generate signature for signed uploads to Cloudinary
export const generateCloudinarySignature = () => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'mock_secret';
  
  // Parameters to sign (typically timestamp and upload_preset if used, or just timestamp)
  const paramsToSign = `timestamp=${timestamp}`;
  
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY || 'mock_key',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud'
  };
};