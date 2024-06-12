// utils/skills/callbackUtil.ts
import axios from 'axios';

const BASE_URL = 'https://heydata.org';

export async function sendCallback(message: string, email: string, phoneNumber: string, currentUserTime: string, bot: string, smsReply: string) {
 console.log('Sending callback request to DATA with these variables: ', message, email, phoneNumber, currentUserTime, bot);
 try {
   const response = await axios.post(`${BASE_URL}/api/v1/callback`, {
     message,
     email,
     phoneNumber,
     currentUserTime,
     bot,
     smsReply,
   });
  console.log(`Received callback response from DATA:`, response.data);
   return response.data;
 } catch (error) {
   console.error('Error in sendCallback:', error);
   throw error;
 }
}