const User = require('../models/User');
const bcrypt = require('bcryptjs');
//create user
const nodemailer = require('nodemailer');

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  let { designation } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    designation = designation || "Fresher";

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email Template (HTML)
    const mailOptions = {
      from: `"VNC Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to VNC – Your Login Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <h2 style="color: #003366;">Hi ${name},</h2>
          <p>Welcome to <strong>VNC</strong>! You’ve been successfully registered to our platform.</p>
          <p>Here are your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
            <li><strong>Role:</strong> ${role}</li>
          </ul>
          <p style="color: #555;">Please log in and change your password after your first login for security.</p>
          <br>
          <p>Regards,<br><strong>VNC Team</strong></p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Now create and save user
    const newUser = new User({ name, email, password, role, designation });
    await newUser.save();

    res.status(201).json({
      message: 'User created and email sent successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


//update user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, designation } = req.body;

        // Check if the user is trying to update their own details or if they are an admin
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        if (name) user.name = name;
        if (email) user.email = email;
        if (designation) user.designation = designation;
        await user.save(); // Save the updated user

        res.json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//update password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword;  // No need to hash the password here if the model hashes it
    await user.save();

    res.json({ message: 'Password updated successfully' });
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
