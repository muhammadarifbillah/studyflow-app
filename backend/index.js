const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database sementara (Array in Memory)
let tasks = [
  { id: 1, title: 'Belajar React Dasar', subject: 'Frontend', status: 'Belum' },
  { id: 2, title: 'Setup Express API', subject: 'Backend', status: 'Selesai' }
];

// Endpoint GET: Mengambil semua task
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Endpoint POST: Menambah task baru
app.post('/tasks', (req, res) => {
  const { title, subject, status } = req.body;

  // Validasi sederhana
  if (!title || !subject) {
    return res.status(400).json({ message: 'Title dan Subject harus diisi' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    subject,
    status: status || 'Belum'
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Backend StudyFlow berjalan di http://localhost:${PORT}`);
});