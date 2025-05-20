const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // בדיקה אם האימייל כבר קיים במערכת
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'כתובת האימייל כבר קיימת במערכת' });
    }

    // הצפנת הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת המשתמש
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    
    await newUser.save();
    
    res.status(201).json({
       message: 'User registered successfully',
      user : newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // חיפוש המשתמש במסד
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // יצירת טוקן
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token : token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};