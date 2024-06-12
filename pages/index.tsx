import { NextPage } from 'next';
import React, { useState, useEffect, useContext, useRef, ReactNode } from 'react';
import styles from '../styles/Index.module.css';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import SkillDefModal from '../components/SkillDefModal';
import Cookie from 'js-cookie';

interface ModelTokens {
  [key: string]: number;
}

const Home: NextPage = () => {
 const [userRequest, setUserRequest] = useState(Cookie.get('userRequest') || 'test test');
 const [phoneNumber, setPhoneNumber] = useState(Cookie.get('phoneNumber') || '[Your Number]');
 const [email, setEmail] = useState(Cookie.get('email') || '[Enter Your Email Here]');
 const [firstName, setFirstName] = useState(Cookie.get('firstName') || '[Your  Name]');
 const [bot, setBot] = useState(Cookie.get('bot') || 'DATA');
 const [location, setLocation] = useState(Cookie.get('location') || 'New York City');
 const [model, setModel] = useState(Cookie.get('model') || 'claude-3-haiku-20240307');
 const [skillResponse, setSkillResponse] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [storedDropdownOptions, setStoredDropdownOptions] = useState<string[]>([]);
 const [isSubmitting, setIsSubmitting] = useState(false);


 interface ModelTokens {
   [key: string]: number;
 }

 const [skillDef, setSkillDef] = useState(null);
const [isSkillDefModalOpen, setIsSkillDefModalOpen] = useState(false);

 
const fetchSkillDef = async () => {
  let skillDefFetched = '';
  try {
    const response = await axios.post('/api/v1/skills/newSkill', { returnType: 'skillDef' });
    console.log('Fetched newSkill definition:', response.data.dataSkillDef);
    skillDefFetched = response.data.dataSkillDef;
    setSkillDef(skillDefFetched);
  } catch (error) {
    console.error('Failed to fetch skillDef: ', error)};
};

 const showSkillDef = async () => {
  await fetchSkillDef();
  setIsSkillDefModalOpen(true);
 }

 const [readMe, setReadMe] = useState('');

 const clearSavedValues = async () => {
  Cookie.set('userRequest', '');
  Cookie.set('phoneNumber', '');
  Cookie.set('email', '');
  Cookie.set('firstName', '');
  Cookie.set('bot', '');
  Cookie.set('location', '');
  Cookie.set('model', '');
  setUserRequest('');
  setPhoneNumber('');
  setEmail('');
  setFirstName('');
  setBot('');
  setLocation('');
  setModel('');
  
 };
 const currentDate = new Date();
 const currentUserTime = currentDate.toLocaleString('en-US', {
   weekday: 'long',
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: 'numeric',
   minute: 'numeric',
   second: 'numeric',
   fractionalSecondDigits: 3,
   timeZoneName: 'short',
 });

 const [clipboardCopyDraft, setClipboardCopyDraft] = useState(`Enter demo conversation history here (leaving this blank is also fine).
 
(${currentUserTime}) ${firstName}: Hi ${bot}, what it do trick?

(${currentUserTime}) ${bot}: /${skillDef?.displayName || 'newSkill'}: This is a cool new skill, bro.

This is placeholder content, you can ignore it. If you need content formatted correctly, grab it from chat.heydata.org > Advanced Settings > Personal Info > Clipboard Copy.`);
 const [clipboardCopy, setClipboardCopy] = useState(``);

 useEffect(() => {
  setClipboardCopyDraft(`Enter demo conversation history here (leaving this blank is also fine)

(${currentUserTime}) ${firstName}: Hi ${bot}, what it do trick?

(${currentUserTime}) ${bot}: /${skillDef?.displayName || 'newSkill'}: This is a cool new skill, bro.

This is placeholder content, you can ignore it. If you need content formatted correctly, grab it from chat.heydata.org > Advanced Settings > Personal Info > Clipboard Copy.`);
 }, [firstName, skillDef, bot, userRequest, location]); 

 const getReadMe = async () => {
  try {
    const response = await fetch('/api/readMe');
    const data = await response.json();
   // trim everything after "Just hit the paste emoji on DATA's reply with all the code in it" in readMe.me
    const trimmedReadMe = data.content.split('Just hit the paste emoji on DATA\'s reply with all the code in it')[0]
    setReadMe(trimmedReadMe);
  } catch (error) {
    console.error('Failed to fetch readMe:', error);
  }
 }

 const handleSubmitSkill = async () => {
  setIsSubmitting(true);
  
  const response = await fetch('/api/getSkillFiles');
  const { sourceCode, readMeContent } = await response.json();

  try {
   await fetchSkillDef();
  } catch (error: any) {
   // do nothing if the route doesn't build
  }
  


  const skillName = skillDef?.displayName || 'This Skill Is Not Ready For Submission yet! Please double-check that the SkillDef loads and click the submit button again. If it does not load, please review the tutorial at https://twitter.com/SteveMoraco/status/1774927234123375067 and make sure it builds, runs, and you have customized the prompts to your liking using your expertise before submitting your skill.';
  const altSkillName = skillDef?.fileName || 'newSkill';

  const skillVersion = skillDef?.skillVersion || 'v0.1';

   const emailContent = `Hi DATA Council,

Here is my skill ready for submission: ${skillName} 

This is ${altSkillName} ${skillVersion}, by ${email} submitted on ${currentUserTime}.

I confirm that it builds, runs, and I have customized the prompts to my liking with my own expertise and experience.

Below, I've included my final debugged source code and readMe.md file with the original source below. I understand that if it doesn't run, it wont' be reviewed.

Here are additional comments and questions I have, if any:
(please write any comments here!!)

Source Code:
\`\`\`typescript
${sourceCode}
\`\`\`

ReadMe:
\`\`\`markdown
${readMeContent}
\`\`\`

Warmest Regards,
${email}`;
  
const emailSubject = `New DATA Skill Submission - ${altSkillName} ${skillVersion}, by ${email} submitted on ${currentUserTime}`;
const emailBody = encodeURIComponent(emailContent);
window.location.href = `mailto:DATASkills@lander.media?subject=${emailSubject}&body=${emailBody}`;
  setIsSubmitting(false);

 };



 useEffect(() => {
  getReadMe();
   const fetchDropdownOptions = async () => {
     const options = await Promise.all(Object.entries(models).map(async ([modelName, maxTokens]) => {
      const formattedModelName = modelName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
       const roundedMaxTokens = `${Math.round(maxTokens / 1000)}k Max Context`;
       return `${formattedModelName} | ${roundedMaxTokens}`;
     }));
     setStoredDropdownOptions(options);
   };

   fetchDropdownOptions();
 }, []); // Ensure this runs once on component mount
 const models: ModelTokens = {
   'gpt-4o': 128000,
   'gpt-4o-2024-05-13': 128000,
   'gpt-3.5-turbo-0125': 15600,
   'gpt-3.5-turbo-16k': 15600,
   'gpt-4-turbo-2024-04-09': 128000,
   'gpt-4-turbo-preview': 128000,
   'gpt-4-vision-preview': 128000,
   'gpt-4': 8000,
   'gpt-4-32k': 32000,
   'gpt-4-32k-0613-preview': 32000,
   'gpt-4-0125-preview': 128000,
   'gpt-4-1106-preview': 128000,
   'gpt-4-0613-preview': 8000,
   'gpt-4-0314-preview': 8000,
   'gemini-1.5-flash-preview-0514': 1000000,
   'gemini-1.5-pro-preview-0409': 1000000,
   'gemini-pro': 32768,
   'gemini-pro-vision': 16384,
   'claude-3-haiku-20240307': 200000,
   'claude-3-opus-20240229': 200000,
   'claude-3-sonnet-20240229': 200000,
   'claude-2.1': 200000,
   'claude-instant-1.2': 200000,
   'claude-instant-1': 100000,
   'mixtral-8x7b-32768': 32768,
   'mistral-small-latest': 32000,
   'mistral-medium-latest': 32000,
   'mistral-large-latest': 32000,
   'meta-llama/Meta-Llama-3-70B': 8192,
   'meta-llama/Llama-3-70b-chat-hf': 8192,
   'meta-llama/Llama-3-8b-hf': 8192,
   'meta-llama/Llama-3-8b-chat-hf': 8192,
   'microsoft/WizardLM-2-8x22B': 32768,
   'mistralai/Mixtral-8x22B': 32768,
   'mistralai/Mixtral-8x22B-Instruct-v0.1': 32768,
   'mistralai/Mixtral-8x7B-Instruct-v0.1': 32768,
   'mistralai/Mistral-7B-Instruct-v0.2': 32768,
   'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO': 32768,
   'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT': 32768,
   'deepseek-ai/deepseek-coder-33b-instruct': 16384,
   'teknium/OpenHermes-2p5-Mistral-7B': 8192,
   'DiscoResearch/DiscoLM-mixtral-8x7b-v2': 32768,
   'llama-3-sonar-small-32k-chat': 32768,
   'llama-3-sonar-small-32k-online': 28000,
   'llama-3-sonar-large-32k-chat': 32768,
   'llama-3-sonar-large-32k-online': 28000,
 };
 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsLoading(true);

   try {
     const response = await fetch('/api/v1/skills/newSkill', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         userRequest,
         phoneNumber,
         email,
         model,
         location,
         currentUserTime,
         bot,
       }),
     });

     const data = await response.json();
setSkillResponse(`Received newSkill Output! \n\n---\n\nHere is the message the user will receive:\n<Markdown Formatted Chat Reply from DATA>\n\n` + data.message + `\n\n</Markdown Formatted Chat Reply from DATA>\n\n---\n\nIn addition to this message, DATA Skills should always generate a full log of all the prompts that went into generating the DATA Skill, and a short version of the reply for notifying the user. Here is the SMS generated to notify them when the skill finishes:\n\n<Text Message from DATA>\n\n` + data.smsReply + `\n\n</Text Message from DATA>\n\n---\n\nAnd is the debug information documenting DATA's process:\n\n` + data.debug);
   } catch (error) {
    console.error('Error in newSkill.ts:', error, error.debug ? error.debug : error.message);
    const errorMessage = error.debug ? error.debug : error.message
   setSkillResponse(`An error occurred in newSkill.ts while testing the newSkill. \n\n---\n\n${errorMessage}`);         }

   setIsLoading(false);
 };

 return (
   <div className={styles.testBody}>
     <h1>DATA Skill Testing Interface for newSkill</h1>
      <p>Publishing interactive voice-powered software to your community of fellow DATA Creators worldwide is as easy 1, 2, 3!<br/><br/><span className={styles.color}>Scroll down for steps 2 & 3 running & editing.</span><br/><br/></p>


      <h1 className={styles.modalHeader}>Step 1: Check Your Skill Definition</h1>

     <h2 className={styles.modalHeader2}>newSkill DATA Skill Definition & DATA Council Submit Button</h2>
       <p>This "Skill Definition" is what will show up when people click on your skill to customize it or figure out how to use it. This allows people and Large Language Models to understand what your skill does before deciding to use it. Your <span className={styles.color}>DATA Skill Defintion</span> is the primary affordance for your AI to understand how and when to use the software tool you have made for it.<br/><br/>Pressing this button may cause build errors if your skill has not been debugged yet, go to Step 3 below after trying it out by clicking "View Skill Definition" to debug your skill.</p>


       <button onClick={showSkillDef}>View Skill Definition</button> <button type="button" onClick={handleSubmitSkill} disabled={isSubmitting}>
      {isSubmitting ? 'Submitting... loading email contents.' : 'Submit Skill to The DATA Council'}

       </button>
       {skillDef && (
       <SkillDefModal
         isOpen={isSkillDefModalOpen}
         skillDef={skillDef}
         skillName="generateBlogPost"
         position={{ top: 0, left: 0 }}
         onRequestClose={() => setIsSkillDefModalOpen(false)}
         setDraftMessage={() => {}}     
         setActiveCommand={() => {}}
       />)}
     <p>
       <span className={styles.color}>When you are done with steps 2 & 3 debugging and verifying your skill works below, come back here to submit your final skill!</span> Make Sure "View Skill Definion" Button Works & Skill Runs Successfully Above Before Submitting!<br/><br/>If your skill is accepted, you will receive $500 DATA Credits for your first skill, and $50 for every skill after that. Congrats, you're a developer! Welcome to being a DATA Creator!
     </p>  
     <br/><br/><br/><br/>
     <h1 className={styles.modalHeader}>Step 2: Verify Your Skill Works</h1>

      <h2 className={styles.modalHeader2}>DATA Skill Testing Interface</h2>
     <form onSubmit={handleSubmit}>
       <label>
         Skill Inputs<br/>
        <input
         type="text"
         placeholder='Your DATA Email Here'
         value={email}
         onChange={(e) => {
          Cookie.set('email', e.target.value);
         setEmail(e.target.value);
         }}
        /> (email)<br/>
        <input
         type="text"
         placeholder='Your DATA Phone Number Here'
         value={phoneNumber}
         onChange={(e) => {
          Cookie.set('phoneNumber', e.target.value);
         setPhoneNumber(e.target.value);
         }}        
         /> (phoneNumber)<br/>
        <input
         type="text"
         placeholder='Your First Name Here'
         value={firstName}
         onChange={(e) => {
          Cookie.set('firstName', e.target.value);
         setFirstName(e.target.value);
         }}        
         /> (firstName)<br/>
       <input
         type="text"
         placeholder='Your DATA Name Here'
         value={bot}
        onChange={(e) => {
        Cookie.set('bot', e.target.value);
        setBot(e.target.value);
        }}        
        /> (botName)<br/>
        <input
         type="text"
         placeholder='Test Location String Here'
         value={location}
         onChange={(e) => {
          Cookie.set('location', e.target.value);
         setLocation(e.target.value);
         }}        
        /> (userLocation)<br/>
        <select
          value={model}
         onChange={(e) => {
          Cookie.set('model', e.target.value);
         setModel(e.target.value);
         }}        
        >
          {storedDropdownOptions.map((optionText, index) => (
            <option key={index} value={Object.keys(models)[index]}>
              {optionText}
            </option>
          ))}
        </select><br/>
        <textarea
           rows={8}           
           value={userRequest}
           placeholder='Enter demo user request here'
         onChange={(e) => {
          Cookie.set('userRequest', e.target.value);
         setUserRequest(e.target.value);
         }}        
         /><textarea
          rows={8}           
          value={clipboardCopy}
          placeholder={clipboardCopyDraft}
          onChange={(e) => setClipboardCopy(e.target.value)}
        />
      </label><br/><br/>(userRequest & clipboardCopy aka conversation history) <br/><br/><br/>
      When you click test, the skill will be tested and the response will be displayed after the skill has completed running <span className={styles.color}>below in the "<b>newSkill Response:</b>" section</span>.<br/><br/>While you wait, see the <span className={styles.color}>console tab</span> here in replit as well for details on all prompts sent to & received from DATA while your skill test runs.<br/><br/>
       <button type="submit" disabled={isLoading}>
        {isLoading ? 'Testing... see console tab for logs.' : 'Test newSkill'}
       </button>
      <button type="button" onClick={clearSavedValues}>
        Clear All Values (careful)
      </button>
    </form>

     <div>
       <h2>newSkill Response:</h2>
       <p>Your skill's output will show up in plaintext here when it's finished.</p>
       <pre>{skillResponse}</pre>
       All DATA Skills output 3 items: <br/><br/>
       1. the <span className={styles.color}>message</span>, a markdown document<br/>2. the <span className={styles.color}>smsReply</span>, a short response used for audible responses and text messages<br/>3. the <span className={styles.color}>debug</span> log, which is basically a copy of console logs documenting DATA's thinking as your skills runs.
     </div>
      <br/><br/><br/><br/>

     <h1 className={styles.modalHeader}>Step 3: Customize Your Skill </h1>

     <h2 className={styles.modalHeader2}>Instructions For Testing & Customizing Your New Skill</h2>
       <p>While your skill is running, watch the console logs to the side, and reflect on if you think it is working as well as you imagined, or if it should do something differently. 
         
          <br/><br/>Your entire new skill can be found in the sidebar under <span className={styles.color}>pages/api/v1/skills/skillName.ts</span> 
 
         <br/><br/>You do not need to know how to code to get your Skill running if it's not perfect yet.
         
         <br/><br/>Most of the code is plain english prompts, and the rest <span className={styles.color}>Replit AI can automatically fix for you, just ask nicely. </span>If your skill isn't running when you test it and you're not sure what to change or fix first, there should be errors in the console on the side.
         
         <br/><br/>In the sidebar where errors show up,  <span className={styles.color}>to fix an error, click on the name of your Skill with the line number where the error occured and it'll take you right to the error, then Replit AI can fix it</span>. Or, you can type "npm run build" in the shell tab here in replit and hit enter, this will show you build errors one at a time that you can resolve each until your skill runs.
         
         <br/><br/>To make adjustments to your skills source code, click into the files on the sidebar. The newSkill source code is in the folder: pages/api/v1/skills/newSkill.ts under the name newSkill.ts.
         
         <br/><br/>Do not change ANY other files or folders in this project or your skill may not run on DATA when submtted.
         
         <br/><br/>You can review all of <u><span className={styles.color}>DATA's thought process as it made your skill</span></u> in the email copy you recieved of this skill, or in the readMe.md file in the side bar or below.
         
         <br/><br/>If you share this replit, keep in mind that it is linked to your phone & email, so all usage will be counted against your DATA Credits. DATA Skills are meant to be submitted and used on the chat interface, so you may use this testing interface, but keep in mind your history here won't be saved, and none of the related automations DATA usually relies on to provide great in-context answers will run. This interface is primarily for individual skill testing and development.
       
       <br/><br/>Below, you'll find a copy of the readMe.md file imported dynamically. This pre-populates the rest of this page with documentation about the DATA Skill when these replits are made automatically.</p>
    <br/><br/><br/><br/>

    

   
    
    {readMe && (
    <>
     <br/><br/><br/><br/>

      <h1 className={styles.modalHeader}>Skill Documentation: DATA's Thought Process</h1>

       <h2 className={styles.modalHeader2}>DATA Skill ReadMe File for newSkill</h2>
     <p>This is all of the source code & draft material DATA wrote to make your skill, as well as the thinking that went into why it's contructed the way it is. <br/><br/>If your code is missing any pieces or malformed, it can be helpful to reference the original content. All of this is stored in readMe.md which you can see in the sidebar.</p><br/>
     
    <ReactMarkdown className={styles.modalField}>{readMe}</ReactMarkdown>
     </>
)}
   </div>
 );
};

export default Home;