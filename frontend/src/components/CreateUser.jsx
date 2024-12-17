import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreateUser.css'; // Import the CSS file

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donator');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:5000/api/users/create-user',
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('User created successfully');
      fetchUsers();
    } catch (err) {
      console.log('Failed to create user', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/users/all-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredUsers = response.data.filter(user => user.role === 'donator' || user.role === 'receiver');
      setUsers(filteredUsers);
    } catch (err) {
      console.log('Failed to fetch users', err);
    }
  };

  const handleDelete = async (username) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/users/delete-user/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.log('Failed to delete user', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="create-user-container">
      <h1>Create User (Donator/Receiver)</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="donator">Donator</option>
          <option value="receiver">Receiver</option>
        </select>
        <button type="submit">Create User</button>
      </form>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <h2>Admin Dashboard - User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <span>{user.username} ({user.role})</span>
            <button onClick={() => handleDelete(user.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateUser;


