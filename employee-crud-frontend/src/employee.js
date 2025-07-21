import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/employees';

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
    const res = await fetch(API_URL);
    const data = await res.json();
    setEmployees(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
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
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchEmployees();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Employee Management</h1>

      <div className="card mb-5">
        <div className="card-body">
          <div className="row g-3">
            {['name', 'email', 'designation', 'department', 'salary', 'doj', 'lastDay'].map((field) => (
              <div className="col-md-6" key={field}>
                <label className="form-label text-capitalize">{field}</label>
                <input
                  type={field === 'salary' ? 'number' : 'text'}
                  name={field}
                  className="form-control"
                  value={form[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="col-12">
              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                {editingId ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {employees.map((emp) => (
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
      ))}
    </div>
  );
}
