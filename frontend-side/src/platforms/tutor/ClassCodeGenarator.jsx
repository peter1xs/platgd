import React, { useState } from "react";
import axios from "axios";
function ClassCodeGenerator() {
  const [randomNumber, setRandomNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
  });


  const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

  const generateRandomNumber = () => {
    // Generate a random 4-digit code (including leading zeros)
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    setRandomNumber(randomNum);
    setFormData({ ...formData, classCode: randomNum });
    setIsSubmitted(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  // Validate inputs
  if (!randomNumber) {
    setError('Please generate a class code first');
    setIsLoading(false);
    return;
  }
  if (!formData.className.trim()) {
    setError('Please enter a valid class name');
    setIsLoading(false);
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3001/cobotKidsKenya/classCode",
      {
        className: formData.className.trim(),
        classCode: randomNumber
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500 // Treat 400-level as non-errors
      }
    );

    if (response.status === 201) {
      setIsSubmitted(true);
      // Reset form if needed
      setFormData({ className: '', classCode: '' });
      setRandomNumber('');
    } else {
      setError(response.data.error || 'Request failed');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.error || 
                        err.message || 
                        'Network error - check connection';
    setError(errorMessage);
    console.error('Submission error:', err);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="modal-overlay">
      <div className="exam-modal">
        <h2>Generate A Class Code</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="className"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Class Name:
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Class Code:
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                name="classCode"
                value={randomNumber}
                readOnly
                style={{
                  width: "100px",
                  padding: "8px",
                  marginRight: "10px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ddd",
                }}
              />
              <button
                type="button"
                onClick={generateRandomNumber}
                style={{
                  padding: "8px 15px",
                  fontSize: "14px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Generate Code
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Create Class
          </button>
        </form>

        {isSubmitted && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: "5px",
            }}
          >
            Class created successfully with code: {randomNumber}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassCodeGenerator;
