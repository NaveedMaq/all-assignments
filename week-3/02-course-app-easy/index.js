const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Authentication

const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (!admin)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Incorrect username or password' });

  req.admin = admin;
  next();
};

const userAuth = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user)
    return res
      .status(401)
      .json({ status: 'fail', message: 'Incorrect username or password' });

  req.user = user;
  next();
};

// Admin routes

app.post('/admin/signup', (req, res) => {
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
  res
    .status(201)
    .json({ status: 'success', message: 'Admin created successfully' });
});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  res
    .status(200)
    .json({ status: 'success', message: 'Logged in successfully' });
});

app.post('/admin/courses', adminAuth, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;

  const newCourse = { title, description, price, imageLink, published };
  newCourse.id = Date.now();

  COURSES.push(newCourse);
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

  const existingUser = USERS.find((u) => u.username === username);

  if (existingUser)
    return res
      .status(400)
      .json({ status: 'fail', message: 'User already exists' });

  const newUser = { username, password, purchasedCourseIds: [] };

  USERS.push(newUser);
  res
    .status(201)
    .json({ status: 'success', message: 'User created successfully' });
});

app.post('/users/login', userAuth, (req, res) => {
  // logic to log in user
  res
    .status(200)
    .json({ status: 'success', message: 'Logged in successfully' });
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

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
