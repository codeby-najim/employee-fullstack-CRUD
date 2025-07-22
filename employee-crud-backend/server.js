// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

// Validate environment variables
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in environment variables.");
  process.exit(1);
}

// Middleware
const allowedOrigins = [
  'http://localhost:3000', // local frontend
  'https://employee-fullstack-curd.vercel.app' // deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Schema with basic validation
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  designation: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, min: 0 },
  doj: { type: Date, required: true },
  lastDay: { type: Date },
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

// Create new employee
app.post('/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: "Error creating employee", error });
  }
});

// Update employee
app.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: "Error updating employee", error });
  }
});

// Delete employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
});

// Server Listen
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
