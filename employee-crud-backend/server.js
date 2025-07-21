// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  designation: String,
  department: String,
  salary: Number,
  doj: String,
  lastDay: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

// Get all employees
app.get('/employees', async (req, res) => {
  const employees = await Employee.find();
  res.status(200).json(employees);
});

// Create a new employee
app.post('/employees', async (req, res) => {
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.status(201).json(newEmployee);
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
  const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedEmployee);
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
