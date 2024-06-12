// utils/skills/commandUtil.ts
import axios from 'axios';

const BASE_URL = 'https://heydata.org';

export async function runCommand(commandFileName: string, userRequest: string, phoneNumber?: string, email?: string, model?: string, location?: string, currentUserTime?: string, clipboardCopy?: string, args?: any, returnType?: string, bot?: string) {
 console.log('Sending runCommand request to DATA: ', commandFileName, userRequest, phoneNumber, email, model, location, currentUserTime);
 try {
   const response = await axios.post(`${BASE_URL}/api/v1/skills/${commandFileName}`, {
     userRequest,
     phoneNumber,
     email,
     model,
     location,
     currentUserTime,
     clipboardCopy,
     args,
     returnType,
     bot,
   });
   console.log(`Received runCommand ${commandFileName} response from DATA:`, response.data);
   return response;
 } catch (error) {
   console.error('Error in runCommand:', error);
   throw error;
 }
}