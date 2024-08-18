const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const coursesFilePath = path.join(__dirname, '../data/courses.json');

// Helper function to load courses
const loadCourses = () => {
  const data = fs.readFileSync(coursesFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to save courses
const saveCourses = (courses) => {
  fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), 'utf8');
};

// GET all courses
router.get('/', (req, res) => {
  try {
    const courses = loadCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error loading courses.' });
  }
});

// POST new course
router.post('/', (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    // Load existing courses
    const courses = loadCourses();

    // Generate a new ID
    const newId = courses.length ? Math.max(courses.map(course => course.id)) + 1 : 1;

    // Create the new course
    const newCourse = {
      id: newId,
      name,
      price,
      image,
      description
    };

    // Add the new course to the list
    courses.push(newCourse);

    // Save the updated list of courses
    saveCourses(courses);

    // Send the new course as a response
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error adding course.' });
  }
});

module.exports = router;
