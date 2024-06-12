import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sourceCodePath = path.join(process.cwd(), 'pages', 'api', 'v1', 'skills', 'newSkill.ts');
    const sourceCode = fs.readFileSync(sourceCodePath, 'utf8');

    const readMePath = path.join(process.cwd(), 'readMe.md');
    const readMeContent = fs.readFileSync(readMePath, 'utf8');

    res.status(200).json({ sourceCode, readMeContent });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}