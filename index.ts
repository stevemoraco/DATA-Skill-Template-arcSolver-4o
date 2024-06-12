import { execSync } from 'node:child_process';

const setupScript = `
#!/bin/bash

# Replace package.json file
echo "Replacing package.json file..."
cat > package.json <<EOL
{
 "dependencies": {
  "axios": "^0.21.1",
  "next": "^12.3.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-markdown": "^8.0.0",
  "react-modal": "^3.16.1"
 },
 "devDependencies": {
  "@types/node": "^18.0.0",
  "@types/react": "^18.0.14",
  "typescript": "^4.7.4"
 },
 "scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
 }
}
EOL

# Replace .replit file
echo "Replacing .replit file..."
cat > .replit <<EOL
run = "npm run dev"
entrypoint = "index.tsx"
modules = ["nodejs-20:v9-20231020-a3526c9"]
hidden = [".config", "package-lock.json", ".next", ".swc"]
[nix]
channel = "stable-23_05"
[env]
NEXT_TELEMETRY_DISABLED = "1"
[deployment]
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
deploymentTarget = "cloudrun"
[[ports]]
localPort = 3000
externalPort = 80
[[ports]]
localPort = 3001
externalPort = 3001
EOL
`;

function runSetup() {
 try {
   execSync(setupScript, { shell: '/bin/bash', stdio: 'inherit' });
   console.log('\n\nDATA CREATORS: \nWelcome to the DATA Skill test interface!\nBrought to you by Replit.com\n\n---\n\nPlease click RUN again now\n\n---\n\nKeep an eye out for the message \n"Port :3000 opened on {...}.replit.dev"\nIt will appear among the console logs that will generate below. \n\nWhen you see that message, click it to open the web view and test your new DATA Skill!"');
 } catch (error) {
   console.error('Error running setup:', error);
 }
}

runSetup();