import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersPath = path.join(process.cwd(), 'db/users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const users = JSON.parse(fs.readFileSync(usersPath));
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const hashed = await bcrypt.hash(password, 8);
  users.push({ id: randomUUID(), email, password: hashed });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  const token = randomUUID();
  return res.status(201).json({ token });
}
