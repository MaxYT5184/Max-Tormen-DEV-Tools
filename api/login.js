import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const usersPath = path.join(process.cwd(), 'db/users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });

  const token = randomUUID();
  return res.status(200).json({ token });
}
