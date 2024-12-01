import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('data', 'userData.json');

export default function handler(req, res) {
  const { method } = req;

  // Membaca data pengguna dari file JSON
  const userData = JSON.parse(fs.readFileSync(dataPath));

  // API untuk Login
  if (method === 'POST' && req.body.action === 'login') {
    const { username, password } = req.body;
    const user = userData.find(
      (user) => user.username === username && user.password === password
    );
    
    if (user) {
      return res.status(200).json({ message: 'Login successful!' });
    } else {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }
  }

  // API untuk Signup
  if (method === 'POST' && req.body.action === 'signup') {
    const { username, password } = req.body;
    const existingUser = userData.find((user) => user.username === username);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Menambahkan pengguna baru
    userData.push({ username, password });
    
    // Menyimpan kembali ke file JSON
    fs.writeFileSync(dataPath, JSON.stringify(userData, null, 2));

    return res.status(201).json({ message: 'Signup successful!' });
  }

  // Jika method tidak sesuai
  res.status(405).json({ message: 'Method Not Allowed' });
}
