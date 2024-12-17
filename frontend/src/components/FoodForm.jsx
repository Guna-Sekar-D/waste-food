import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/FoodForm.css"; // Importing the CSS styles

const FoodForm = () => {
  const location = useLocation();
  const foodItem = location.state?.foodItem || null; // Get food item from location state
  const [formData, setFormData] = useState({
    donatorName: "",
    phone: "",
    location: "",
    foodDetails: "",
    image: null,
    available: true, // Default to true
    quantity: 1, // Default to 1
  });

  const navigate = useNavigate();

  // Populate the form with existing food item data if editing
  useEffect(() => {
    if (foodItem) {
      setFormData({
        donatorName: foodItem.donatorName,
        phone: foodItem.phone,
        location: foodItem.location,
        foodDetails: foodItem.foodDetails,
        image: null, // You might want to handle this differently if you display existing images
        available: foodItem.available,
        quantity: foodItem.quantity,
      });
    }
  }, [foodItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem("authToken");
      if (foodItem) {
        // Update existing food item
        await axios.put(
          `http://localhost:5000/api/food/${foodItem._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Food donation updated successfully");
      } else {
        // Create new food donation
        await axios.post("http://localhost:5000/api/food/donate", form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Food donation submitted successfully");
      }
      navigate("/donator-dashboard"); // Redirect to the Donator Dashboard
    } catch (err) {
      console.log("Food donation failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    alert("Logged out successfully");
    navigate("/login-donator"); // Redirect to login page
  };

  const viewDonations = () => {
    navigate("/donator-dashboard");
  };

  return (
    <div className="food-form-container">
      <h1>{foodItem ? "Update Food Donation" : "Food Donation Form"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="donatorName"
          value={formData.donatorName}
          onChange={handleChange}
          placeholder="Donator Name"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <textarea
          name="foodDetails"
          value={formData.foodDetails}
          onChange={handleChange}
          placeholder="Food Details"
          required
        />
        <input type="file" name="image" onChange={handleFileChange} />

        {/* New Fields for Quantity and Availability */}
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          min="1"
          required
        />
        <label>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={() =>
              setFormData({ ...formData, available: !formData.available })
            }
          />
          Available
        </label>

        <button type="submit">{foodItem ? "Update" : "Submit"}</button>
      </form>

      <div className="clearfix">
        {/* Logout Button */}
        <button onClick={handleLogout}>Logout</button>

        {/* View Donations Button */}
        <button onClick={viewDonations}>View Donations</button>
      </div>
    </div>
  );
};

export default FoodForm;
