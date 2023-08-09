const fs = require('fs/promises');
const path = require('path');

const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_EXPIRY;

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Persistant data operations
async function saveArrayToFile(array, entityName) {
  const fileName = entityName + '.json';
  const filePath = path.join(__dirname, 'data', fileName);

  const fileContent = JSON.stringify(array, null, 2);
  await fs.writeFile(filePath, fileContent, { encoding: 'utf-8' });
}

async function loadDataIntoArray(array, entityName) {
  const fileName = entityName + '.json';
  const filePath = path.join(__dirname, 'data', fileName);

  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  const data = JSON.parse(fileContent);

  array.splice(0, array.length);
  Object.assign(array, data);
}

async function loadAllData() {
  console.log('Loading Data');

  await loadDataIntoArray(ADMINS, 'admins');
  await loadDataIntoArray(USERS, 'users');
  await loadDataIntoArray(COURSES, 'courses');

  console.log('Data Loaded Successfully');
}

// Authentication
const adminAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Auth token missing' });

  const token = authorization.split(' ')[1];

  if (!token)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Auth token missing' });

  jwt.verify(token, jwtSecret, (err, data) => {
    if (err)
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });

    if (!data.username || data.role !== 'admin')
      return res
        .status(403)
        .json({ status: 'fail', message: 'Not authorized to access route' });

    const admin = ADMINS.find((a) => a.username === data.username);
    if (!admin)
      return res
        .status(401)
        .json({ status: 'fail', message: 'Admin no longer exists' });

    req.admin = admin;
    next();
  });
};

const userAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Auth token missing' });

  const token = authorization.split(' ')[1];

  if (!token)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Auth token missing' });

  jwt.verify(token, jwtSecret, (err, data) => {
    if (err)
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });

    if (!data.username || data.role !== 'user')
      return res
        .status(403)
        .json({ status: 'fail', message: 'Not authorized to access route' });

    const user = USERS.find((u) => u.username === data.username);
    if (!user)
      return res
        .status(401)
        .json({ status: 'fail', message: 'User no longer exists' });

    req.user = user;

    next();
  });
};

// Admin routes

app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Empty username/password' });

  const admin = { username, password };
  const existingAdmin = ADMINS.find((a) => a.username === username);
  if (existingAdmin)
    return res.status(400).json({
      status: 'fail',
      message: 'Admin already exists',
    });

  ADMINS.push(admin);
  await saveArrayToFile(ADMINS, 'admins');

  const token = jwt.sign({ username, role: 'admin' }, jwtSecret, {
    expiresIn: jwtExpiry,
  });

  res
    .status(201)
    .json({ status: 'success', message: 'Admin created successfully', token });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (!admin)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Incorrect username or password' });

  const token = jwt.sign({ username, role: 'admin' }, jwtSecret, {
    expiresIn: jwtExpiry,
  });

  res
    .status(200)
    .json({ status: 'success', message: 'Logged in successfully', token });
});

app.post('/admin/courses', adminAuth, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;

  const newCourse = { title, description, price, imageLink, published };
  newCourse.id = Date.now();

  COURSES.push(newCourse);
  saveArrayToFile(COURSES, 'courses');

  res.status(201).json({
    status: 'success',
    message: 'Course created successfully',
    courseId: newCourse.id,
  });
});

app.put('/admin/courses/:courseId', adminAuth, (req, res) => {
  // logic to edit a course
  const courseId = Number.parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.id === courseId);

  if (!course)
    return res
      .status(404)
      .json({ status: 'fail', message: 'Course not found' });

  Object.assign(course, req.body);
  saveArrayToFile(COURSES, 'courses');

  res.status(200).json({ message: 'Course updated successfully' });
});

app.get('/admin/courses', adminAuth, (req, res) => {
  // logic to get all courses
  res.status(200).json({
    status: 'success',
    results: COURSES.length,
    data: { courses: COURSES },
  });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ status: 'fail', message: 'Empty username/password' });

  const user = { username, password };
  const existingUser = USERS.find((u) => u.username === username);
  if (existingUser)
    return res.status(400).json({
      status: 'fail',
      message: 'User already exists',
    });

  user.purchasedCourseIds = [];
  USERS.push(user);
  saveArrayToFile(USERS, 'users');

  const token = jwt.sign({ username, role: 'user' }, jwtSecret, {
    expiresIn: jwtExpiry,
  });

  res
    .status(201)
    .json({ status: 'success', message: 'User created successfully', token });
});

app.post('/users/login', (req, res) => {
  // logic to log in user

  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Incorrect username or password' });

  const token = jwt.sign({ username, role: 'user' }, jwtSecret, {
    expiresIn: jwtExpiry,
  });

  res
    .status(200)
    .json({ status: 'success', message: 'Logged in successfully', token });
});

app.get('/users/courses', userAuth, (req, res) => {
  // logic to list all courses
  const publishedCourses = COURSES.filter((c) => c.published === true);

  res.status(200).json({
    status: 'success',
    results: publishedCourses.length,
    data: { courses: publishedCourses },
  });
});

app.post('/users/courses/:courseId', userAuth, (req, res) => {
  // logic to purchase a course
  const courseId = Number.parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.published === true && c.id === courseId);

  if (!course)
    return res
      .status(404)
      .json({ status: 'fail', message: 'Course cannot be found' });

  if (req.user.purchasedCourseIds.includes(courseId))
    return res
      .status(400)
      .json({ status: 'fail', message: 'Course already purchased' });

  req.user.purchasedCourseIds.push(courseId);
  saveArrayToFile(USERS, 'users');

  res
    .status(200)
    .json({ status: 'success', message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', userAuth, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = req.user.purchasedCourseIds.map((cid) =>
    COURSES.find((c) => c.id === cid)
  );
  res.status(200).json({
    status: 'success',
    results: purchasedCourses.length,
    data: {
      purchasedCourses,
    },
  });
});

app.all('*', (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.listen(3000, async () => {
  await loadAllData();
  console.log('Server is listening on port 3000');
});
