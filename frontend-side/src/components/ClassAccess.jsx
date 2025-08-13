import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../stylesFolder/ClassAccess.css";
import { useNavigate } from "react-router-dom";

const ClassAccess = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(4).fill(""));

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedCode = otp.join("");

    // Basic client-side validation
    if (submittedCode.length !== 4) {
      alert("Please enter a 4-digit code");
      return;
    }

    axios
      .post("https://platform-zl0a.onrender.com/cobotKidsKenya/verifyClassCode", { otp })
      .then((response) => {
        if (response.data.valid) {
          // Successful verification
          navigate("/studentdashboard", {
            state: {
              className: response.data.class.className,
              classCode: response.data.class.classCode,
            },
          });
        } else {
          alert(response.data.error || "Invalid class code");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error verifying code. Please try again.");
      });
  };

  function handleOtpChange(e, index) {
    if (isNaN(e.target.value)) return false;

    setOtp([
      ...otp.map((data, indx) => (indx === index ? e.target.value : data)),
    ]);

    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  }

  return (
    <>
      <div className="class-access-container">
        <div className="animation-scene">
          {/* Classroom background */}
          <div className="classroom">
            <div className="board"></div>
            <div className="teacher-desk"></div>
            <div className="student-desks">
              <div className="desk"></div>
              <div className="desk"></div>
              <div className="desk"></div>
            </div>
          </div>

          {/* Animated characters */}
          <div className={`teacher ${isAnimating ? "animate" : ""}`}>
            <div className="teacher-head">
              <div className="eye left"></div>
              <div className="eye right"></div>
              <div className="mouth"></div>
            </div>
          </div>

          <div className={`student ${isAnimating ? "animate" : ""}`}>
            <div className="student-head">
              <div className="eye left"></div>
              <div className="eye right"></div>
              <div className="mouth happy"></div>
            </div>
          </div>
        </div>

        <div className="access-form">
          <h2>Enter Class Code</h2>
          <p className="subtitle">Get your code from your teacher</p>

          <form onSubmit={handleSubmit}>
            <div className="otp-area">
              {otp.map((data, i) => {
                return (
                  <input
                    type="text"
                    value={data}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e, i)}
                  />
                );
              })}
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#4CAF50", // Green color
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                margin: "10px 0",
                display: "inline-block",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")} // Darker green on hover
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")} // Original color on mouse out
            >
              Go To Class
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClassAccess;
