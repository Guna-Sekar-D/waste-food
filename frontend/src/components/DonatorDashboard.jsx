import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/DonatorDashboard.css'; // Import the CSS file

const DonatorDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const { data } = await axios.get('http://localhost:5000/api/food/available-food', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFoodItems(data.food);
      } catch (err) {
        console.log('Failed to fetch food items', err);
      }
    };

    fetchFoodItems();
  }, []);

  const handleEdit = (foodItem) => {
    navigate('/donator/food-donate', { state: { foodItem } });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.delete(`http://localhost:5000/api/food/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFoodItems(foodItems.filter(item => item._id !== id));
      alert(response.data.message || 'Food donation deleted successfully');
    } catch (err) {
      console.error('Failed to delete food item', err.response ? err.response.data : err.message);
      alert('Error deleting food item: ' + (err.response ? err.response.data.message : err.message));
    }
  };

  return (
    <div className="donator-dashboard-container">
      <h2>Your Food Donations</h2>
      <ul>
        {foodItems.map((food) => (
          <li key={food._id}>
            <p>Donator Name: {food.donatorName}</p>
            <p>Phone: {food.phone}</p>
            <p>Location: {food.location}</p>
            <p>Details: {food.foodDetails}</p>
            {food.image && <img src={`http://localhost:5000/uploads/${food.image}`} alt="Food" />}
            <button onClick={() => handleEdit(food)}>Edit</button>
            <button className="delete-button" onClick={() => handleDelete(food._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonatorDashboard;
