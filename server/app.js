const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const coursesRoutes = require('./routes/courses');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount the courses routes
app.use('/api/courses', coursesRoutes);

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const secretKey = 'your-secret-key';  // Use a strong secret key for JWT

// Sign-up Route
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });

    const users = JSON.parse(data);
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { username, password: hashedPassword };

    users.push(newUser);
    fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
      if (err) return res.status(500).json({ message: 'Internal Server Error' });
      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// Sign-in Route
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });

    const users = JSON.parse(data);
    const user = users.find(user => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});



