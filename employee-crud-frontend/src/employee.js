import React, { useState, useEffect } from 'react';

//const API_URL = 'http://localhost:5000'; // for local run without .env
//const API_URL =  import.meta.env.VITE_API_URL;
const API_URL = "https://employee-fullstack-crud.onrender.com";

export default function EmployeeCRUDApp() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    designation: '',
    department: '',
    salary: '',
    doj: '',
    lastDay: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('Expected array, but got:', data);
        setEmployees([]);
        return;
      }

      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, designation, department, salary, doj } = form;

    if (!name.trim() || !email.trim() || !designation.trim() || !department.trim() || !salary || !doj) {
      alert('Please fill all required fields.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format.');
      return false;
    }

    if (isNaN(salary) || Number(salary) <= 0) {
      alert('Salary must be a positive number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  const payload = {
    ...form,
    salary: Number(form.salary), // Ensure salary is a number
  };

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `${API_URL}/employees/${editingId}` : `${API_URL}/employees`;

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setForm({
      name: '',
      email: '',
      designation: '',
      department: '',
      salary: '',
      doj: '',
      lastDay: '',
    });
    setEditingId(null);
    fetchEmployees();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Employee Management</h1>

      <div className="card mb-5">
        <div className="card-body">
          <div className="row g-3">
            {['name', 'email', 'designation', 'department', 'salary', 'doj', 'lastDay'].map((field) => (
              <div className="col-md-6" key={field}>
                <label className="form-label text-capitalize">
                  {field} {['name', 'email', 'designation', 'department', 'salary', 'doj'].includes(field) && '*'}
                </label>
                <input
                  type={
                    field === 'salary'
                      ? 'number'
                      : field === 'email'
                      ? 'email'
                      : field === 'doj' || field === 'lastDay'
                      ? 'date'
                      : 'text'
                  }
                  name={field}
                  className="form-control"
                  value={form[field]}
                  onChange={handleChange}
                  required={['name', 'email', 'designation', 'department', 'salary', 'doj'].includes(field)}
                />
              </div>
            ))}
            <div className="col-12 d-grid gap-2">
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingId ? 'Update Employee' : 'Add Employee'}
              </button>
              {editingId && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm({
                      name: '',
                      email: '',
                      designation: '',
                      department: '',
                      salary: '',
                      doj: '',
                      lastDay: '',
                    });
                    setEditingId(null);
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {Array.isArray(employees) && employees.length > 0 ? (
        employees.map((emp) => (
          <div className="card mb-3" key={emp._id}>
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">{emp.name}</h5>
                <p className="mb-1"><strong>Email:</strong> {emp.email}</p>
                <p className="mb-1"><strong>Designation:</strong> {emp.designation}</p>
                <p className="mb-1"><strong>Department:</strong> {emp.department}</p>
                <p className="mb-1"><strong>Salary:</strong> ₹{emp.salary}</p>
                <p className="mb-1"><strong>Date of Joining:</strong> {emp.doj}</p>
                <p className="mb-1"><strong>Last Working Day:</strong> {emp.lastDay}</p>
              </div>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-warning" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No employees to display.</p>
      )}
    </div>
  );
}
