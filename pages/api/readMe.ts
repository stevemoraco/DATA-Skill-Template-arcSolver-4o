import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const readMePath = path.join(process.cwd(), './', `readMe.md`);
    const readMeContent = await fs.promises.readFile(readMePath, 'utf-8');
    res.status(200).json({ content: readMeContent });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}