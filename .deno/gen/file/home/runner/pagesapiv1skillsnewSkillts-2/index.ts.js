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
        execSync(setupScript, {
            shell: '/bin/bash',
            stdio: 'inherit'
        });
        console.log('\n\nDATA CREATORS: \nWelcome to the DATA Skill test interface!\nBrought to you by Replit.com\n\n---\n\nPlease click RUN again now\n\n---\n\nKeep an eye out for the message \n"Port :3000 opened on {...}.replit.dev"\nIt will appear among the console logs that will generate below. \n\nWhen you see that message, click it to open the web view and test your new DATA Skill!"');
    } catch (error) {
        console.error('Error running setup:', error);
    }
}
runSetup();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvcGFnZXNhcGl2MXNraWxsc25ld1NraWxsdHMtMi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ25vZGU6Y2hpbGRfcHJvY2Vzcyc7XG5cbmNvbnN0IHNldHVwU2NyaXB0ID0gYFxuIyEvYmluL2Jhc2hcblxuIyBSZXBsYWNlIHBhY2thZ2UuanNvbiBmaWxlXG5lY2hvIFwiUmVwbGFjaW5nIHBhY2thZ2UuanNvbiBmaWxlLi4uXCJcbmNhdCA+IHBhY2thZ2UuanNvbiA8PEVPTFxue1xuIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgXCJheGlvc1wiOiBcIl4wLjIxLjFcIixcbiAgXCJuZXh0XCI6IFwiXjEyLjMuMFwiLFxuICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgXCJyZWFjdC1tYXJrZG93blwiOiBcIl44LjAuMFwiLFxuICBcInJlYWN0LW1vZGFsXCI6IFwiXjMuMTYuMVwiXG4gfSxcbiBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gIFwiQHR5cGVzL25vZGVcIjogXCJeMTguMC4wXCIsXG4gIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjAuMTRcIixcbiAgXCJ0eXBlc2NyaXB0XCI6IFwiXjQuNy40XCJcbiB9LFxuIFwic2NyaXB0c1wiOiB7XG4gIFwiZGV2XCI6IFwibmV4dCBkZXZcIixcbiAgXCJidWlsZFwiOiBcIm5leHQgYnVpbGRcIixcbiAgXCJzdGFydFwiOiBcIm5leHQgc3RhcnRcIlxuIH1cbn1cbkVPTFxuXG4jIFJlcGxhY2UgLnJlcGxpdCBmaWxlXG5lY2hvIFwiUmVwbGFjaW5nIC5yZXBsaXQgZmlsZS4uLlwiXG5jYXQgPiAucmVwbGl0IDw8RU9MXG5ydW4gPSBcIm5wbSBydW4gZGV2XCJcbmVudHJ5cG9pbnQgPSBcImluZGV4LnRzeFwiXG5tb2R1bGVzID0gW1wibm9kZWpzLTIwOnY5LTIwMjMxMDIwLWEzNTI2YzlcIl1cbmhpZGRlbiA9IFtcIi5jb25maWdcIiwgXCJwYWNrYWdlLWxvY2suanNvblwiLCBcIi5uZXh0XCIsIFwiLnN3Y1wiXVxuW25peF1cbmNoYW5uZWwgPSBcInN0YWJsZS0yM18wNVwiXG5bZW52XVxuTkVYVF9URUxFTUVUUllfRElTQUJMRUQgPSBcIjFcIlxuW2RlcGxveW1lbnRdXG5idWlsZCA9IFtcIm5wbVwiLCBcInJ1blwiLCBcImJ1aWxkXCJdXG5ydW4gPSBbXCJucG1cIiwgXCJydW5cIiwgXCJzdGFydFwiXVxuZGVwbG95bWVudFRhcmdldCA9IFwiY2xvdWRydW5cIlxuW1twb3J0c11dXG5sb2NhbFBvcnQgPSAzMDAwXG5leHRlcm5hbFBvcnQgPSA4MFxuW1twb3J0c11dXG5sb2NhbFBvcnQgPSAzMDAxXG5leHRlcm5hbFBvcnQgPSAzMDAxXG5FT0xcbmA7XG5cbmZ1bmN0aW9uIHJ1blNldHVwKCkge1xuIHRyeSB7XG4gICBleGVjU3luYyhzZXR1cFNjcmlwdCwgeyBzaGVsbDogJy9iaW4vYmFzaCcsIHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICBjb25zb2xlLmxvZygnXFxuXFxuREFUQSBDUkVBVE9SUzogXFxuV2VsY29tZSB0byB0aGUgREFUQSBTa2lsbCB0ZXN0IGludGVyZmFjZSFcXG5Ccm91Z2h0IHRvIHlvdSBieSBSZXBsaXQuY29tXFxuXFxuLS0tXFxuXFxuUGxlYXNlIGNsaWNrIFJVTiBhZ2FpbiBub3dcXG5cXG4tLS1cXG5cXG5LZWVwIGFuIGV5ZSBvdXQgZm9yIHRoZSBtZXNzYWdlIFxcblwiUG9ydCA6MzAwMCBvcGVuZWQgb24gey4uLn0ucmVwbGl0LmRldlwiXFxuSXQgd2lsbCBhcHBlYXIgYW1vbmcgdGhlIGNvbnNvbGUgbG9ncyB0aGF0IHdpbGwgZ2VuZXJhdGUgYmVsb3cuIFxcblxcbldoZW4geW91IHNlZSB0aGF0IG1lc3NhZ2UsIGNsaWNrIGl0IHRvIG9wZW4gdGhlIHdlYiB2aWV3IGFuZCB0ZXN0IHlvdXIgbmV3IERBVEEgU2tpbGwhXCInKTtcbiB9IGNhdGNoIChlcnJvcikge1xuICAgY29uc29sZS5lcnJvcignRXJyb3IgcnVubmluZyBzZXR1cDonLCBlcnJvcik7XG4gfVxufVxuXG5ydW5TZXR1cCgpOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLFFBQVEsUUFBUSxxQkFBcUI7QUFFOUMsTUFBTSxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0RyQixDQUFDO0FBRUQsU0FBUyxXQUFXO0lBQ25CLElBQUk7UUFDRixTQUFTLGFBQWE7WUFBRSxPQUFPO1lBQWEsT0FBTztRQUFVO1FBQzdELFFBQVEsR0FBRyxDQUFDO0lBQ2QsRUFBRSxPQUFPLE9BQU87UUFDZCxRQUFRLEtBQUssQ0FBQyx3QkFBd0I7SUFDeEM7QUFDRDtBQUVBIn0=