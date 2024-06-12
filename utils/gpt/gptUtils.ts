// utils/gpt/gptUtils.ts
import axios from 'axios';

const BASE_URL = 'https://heydata.org';

export async function gptRequest(model: string, temperature: number, content: string, prompt: string, phoneNumber: string, email: string, maxTokens: number, imageUrl?: string, detail?: string, bannedWords?: string) {
 try {
    //console.log('Sending GPT Request to DATA with these variables: ', model, temperature, content, prompt, phoneNumber, email, maxTokens, imageUrl, detail, bannedWords);
    const response = await axios.post(`${BASE_URL}/api/gptRequests`, {
     model,
     temperature,
     content,
     prompt,
     phoneNumber,
     email,
     maxTokens,
     imageUrl,
     detail,
     bannedWords,
   });
   //console.log(`Received GPT Response from DATA:`, response.data);
   return response.data.gptOutput;
 } catch (error) {
   console.error('Error in gptRequest:', error);
   throw error;
 }
}

export async function activateDATA(
 userRequest: string,
 phoneNumber: string,
 email: string,
 location?: string,
 systemPrompt?: string,
 subject?: string,
 commandsDisabled?: boolean | string,
 model?: string,
 outputLength?: number,
 callType?: string,
 replyType?: string,
 stop?: string,
 bot?: string,
 userName?: string,
 time?: string
) {
 try {
   console.log('Sending activateDATA request to DATA with these variables: ', userRequest, phoneNumber, email, location, systemPrompt, subject, commandsDisabled, model, outputLength, callType, replyType, stop, bot, userName, time);
   const response = await axios.post(`${BASE_URL}/api/v1/coreDATA`, {
     userRequest,
     phoneNumber,
     email,
     location,
     systemPrompt,
     subject,
     commandsDisabled,
     model,
     outputLength,
     callType,
     replyType,
     stop,
     bot,
     userName,
     time,
   });
   console.log(`Received activateDATA response from DATA:`, response.data);
   return response;
 } catch (error) {
   console.error('Error in activateDATA:', error);
   throw error;
 }
}