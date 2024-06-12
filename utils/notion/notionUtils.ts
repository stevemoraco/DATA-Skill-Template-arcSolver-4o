// utils/notion/notionUtils.ts
import axios from 'axios';

const BASE_URL = 'https://heydata.org';

const fetchValidImageUrl = async (
  imagePrompt: string,
  phoneNumber: string,
  email: string,
  size: string = '1024x1792',
  retries: number = 3,
  delayMs: number = 5000
): Promise<string> => {
  try {
   console.log('Fetching image URL from DATA...', imagePrompt, phoneNumber, email, size, retries, delayMs);
    const response = await axios.post(BASE_URL, {
      action: 'fetchValidImageUrl',
      data: { imagePrompt, phoneNumber, email, size, retries, delayMs },
    });
    console.log('Received image URL from DATA:', response.data);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error fetching valid image URL:', error);
    return '';
  }
};

const isValidUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('Checking if URL is valid with DATA...', url);
    const response = await axios.post(BASE_URL, {
      action: 'isValidUrl',
      data: { url },
    });
    console.log('Received isValidUrl response from DATA:', response.data);
    return response.data.isValid;
  } catch (error) {
    console.error('Error checking URL validity:', error);
    return false;
  }
};

const compressImage = async (input: string | Buffer): Promise<Buffer | null> => {
  try {
   console.log('Compressing image with DATA...', input);
    const response = await axios.post(BASE_URL, {
      action: 'compressImage',
      data: { input },
    });
    console.log('Received compressed image from DATA:', response.data);
    return Buffer.from(response.data.compressedImageBuffer.data);
  } catch (error) {
    console.error('Error compressing image:', error);
    return null;
  }
};

const uploadImageToImgur = async (compressedImageBuffer: Buffer): Promise<string> => {
  try {
    console.log('Uploading image to Imgur with DATA...', compressedImageBuffer);
    const response = await axios.post(BASE_URL, {
      action: 'uploadImageToImgur',
      data: { buffer: compressedImageBuffer },
    });
   console.log(response.data);
    return response.data.imgurUrl;
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    return '';
  }
};

export { fetchValidImageUrl, isValidUrl, compressImage, uploadImageToImgur };