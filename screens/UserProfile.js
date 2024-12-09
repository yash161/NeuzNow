import React, { useState } from "react";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
    currentInterest: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
    currentInterest: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    const capitalLetter = /[A-Z]/;
    return capitalLetter.test(password) && password.length >= 8;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = { ...errors };

    // Password validation
    if (!validatePassword(formData.newPassword)) {
      formErrors.newPassword = "Password must have at least one capital letter and be at least 8 characters long.";
    } else {
      formErrors.newPassword = "";
    }

    if (formData.newPassword !== formData.retypePassword) {
      formErrors.retypePassword = "Passwords do not match.";
    } else {
      formErrors.retypePassword = "";
    }

    setErrors(formErrors);

    if (!formErrors.newPassword && !formErrors.retypePassword) {
      // Process the form data (e.g., send to server)
      alert("Profile updated successfully!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Current Password */}
        <div style={styles.inputGroup}>
          <label htmlFor="currentPassword" style={styles.label}>Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        {/* New Password */}
        <div style={styles.inputGroup}>
          <label htmlFor="newPassword" style={styles.label}>New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            style={styles.input}
          />
          {errors.newPassword && <p style={styles.error}>{errors.newPassword}</p>}
        </div>

        {/* Retype Password */}
        <div style={styles.inputGroup}>
          <label htmlFor="retypePassword" style={styles.label}>Retype Password:</label>
          <input
            type="password"
            id="retypePassword"
            name="retypePassword"
            value={formData.retypePassword}
            onChange={handleInputChange}
            style={styles.input}
          />
          {errors.retypePassword && <p style={styles.error}>{errors.retypePassword}</p>}
        </div>

        {/* Current Interest */}
        <div style={styles.inputGroup}>
          <label htmlFor="currentInterest" style={styles.label}>Current Interest:</label>
          <input
            type="text"
            id="currentInterest"
            name="currentInterest"
            value={formData.currentInterest}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={styles.submitButton}>Update Profile</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },
  error: {
    color: "red",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  submitButton: {
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default UserProfile;
