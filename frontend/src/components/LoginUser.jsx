import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginUser.css'; // Import the CSS file

const LoginUser = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login-user', { username, password });

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);
      alert(`Logged in as ${role}`);

      if (data.role === 'donator') {
        navigate('/donator/food-donate');
      } else if (data.role === 'receiver') {
        navigate('/receiver/view-food');
      }
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="login-user-container">
      <h2>{role} Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginUser;
