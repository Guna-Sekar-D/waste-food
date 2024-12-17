import React from 'react';
import '../css/FoodCard.css';

const FoodCard = ({ food }) => {
  return (
    <div className="food-card">
      <h4>{food.donatorName}</h4>
      <p><strong>Phone:</strong> {food.phone}</p>
      <p><strong>Location:</strong> {food.location}</p>
      <p><strong>Details:</strong> {food.foodDetails}</p>
      <p><strong>Qty:</strong> {food.quantity}</p>
      <p style={{ color: food.available ? 'green' : 'red' }}>
        <strong>Status:</strong> {food.available ? 'Available' : 'Not Available'}
      </p>
      {food.image && (
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt="Food"
        />
      )}
    </div>
  );
};

export default FoodCard;
