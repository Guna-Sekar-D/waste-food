import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FoodCard from './FoodCard';
import '../css/FoodList.css'; // Import the CSS

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const { data } = await axios.get('http://localhost:5000/api/food/available-food', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFoodItems(data.food);
      } catch (error) {
        console.error('Error fetching food items', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    alert('Logged out successfully');
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="food-list-container">
      <h2>Available Food</h2>
      <div className="food-list">
        {foodItems.map((food) => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className='logout-button'>Logout</button>
    </div>
  );
};

export default FoodList;
