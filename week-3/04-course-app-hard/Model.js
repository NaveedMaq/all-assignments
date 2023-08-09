const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Duplicate username not allowed'],
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },

  purchasedCourses: {
    type: [mongoose.Types.ObjectId],
    ref: 'Course',
  },
});

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Duplicate username not allowed'],
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
});

const courseSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const Admin = mongoose.model('Admin', adminSchema);
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = { User, Admin, Course };
