const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './config.env' });

const { User, Admin, Course } = require('./Model');

const {
  JWT_SECRET,
  JWT_EXPIRY,
  DATABASE_PASSWORD,
  DATABASE_URL,
  DATABASE_NAME,
} = process.env;

const mongoConnectionUrl =
  DATABASE_URL.replace('<PASSWORD>', DATABASE_PASSWORD) + DATABASE_NAME;

mongoose.connect(mongoConnectionUrl);

const app = express();

app.use(express.json());

// Auth middlewares
const adminAuth = async (req, res, next) => {
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

  jwt.verify(token, JWT_SECRET, async (err, data) => {
    if (err)
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });

    if (!data.username || data.role !== 'admin')
      return res
        .status(403)
        .json({ status: 'fail', message: 'Not authorized to access route' });

    const admin = await Admin.findOne({ username: data.username });

    if (!admin)
      return res
        .status(401)
        .json({ status: 'fail', message: 'Admin no longer exists' });

    req.admin = admin;
    next();
  });
};

const userAuth = async (req, res, next) => {
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

  jwt.verify(token, JWT_SECRET, async (err, data) => {
    if (err)
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });

    if (!data.username || data.role !== 'user')
      return res
        .status(403)
        .json({ status: 'fail', message: 'Not authorized to access route' });

    const user = await User.findOne({ username: data.username });

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

  const existingAdmin = await Admin.findOne({ username });

  if (existingAdmin) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Admin already exists' });
  }

  const admin = await Admin.create({ username, password });
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: { admin: { ...admin.toJSON(), password: undefined } },
  });
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });

  if (!admin)
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect username or password',
    });

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  res.status(200).json({ status: 'success', token });
});

app.post('/admin/courses', adminAuth, async (req, res) => {
  // logic to create a course
  const course = await Course.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Course created successfully',
    courseId: course._id,
  });
});

app.put('/admin/courses/:courseId', adminAuth, async (req, res) => {
  // logic to edit a course
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course)
    return res
      .status(404)
      .json({ status: 'fail', message: 'Course not found' });

  Object.assign(course, req.body);
  await course.save();

  res.status(200).json({ message: 'Course updated successfully' });
});

app.get('/admin/courses', adminAuth, async (req, res) => {
  // logic to get all courses

  const allCourses = await Course.find();

  res.status(200).json({
    status: 'success',
    results: allCourses.length,
    data: { courses: allCourses },
  });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'User already exists' });
  }

  const user = await User.create({ username, password });

  const token = jwt.sign({ username, role: 'user' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: { user: { ...user.toJSON(), password: undefined } },
  });
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user)
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect username or password',
    });

  const token = jwt.sign({ username, role: 'user' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
  res.status(200).json({ status: 'success', token });
});

app.get('/users/courses', userAuth, async (req, res) => {
  // logic to list all courses
  const publishedCourses = await Course.find({ published: true });

  res.status(200).json({
    status: 'success',
    results: publishedCourses.length,
    data: { courses: publishedCourses },
  });
});

app.post('/users/courses/:courseId', userAuth, async (req, res) => {
  // logic to purchase a course
  const { courseId } = req.params;
  const course = await Course.findOne({ _id: courseId, published: true });

  if (!course)
    return res
      .status(404)
      .json({ status: 'fail', message: 'Course cannot be found' });

  if (req.user.purchasedCourses.includes(courseId))
    return res
      .status(400)
      .json({ status: 'fail', message: 'Course already purchased' });

  req.user.purchasedCourses.push(courseId);
  await req.user.save();

  res
    .status(200)
    .json({ status: 'success', message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', userAuth, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    'purchasedCourses'
  );

  res.status(200).json({
    status: 'success',
    results: user.purchasedCourses.length,
    data: user.purchasedCourses,
  });
});

app.all('*', (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
