import React from 'react'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/TutorAouth.css'
function TutorLoginPage() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:3001/cobotKidsKenya/employees/login", { email, password })
            .then(result => {
                console.log(result)
                if (result.data === "Success") {
                    navigate("/tutorDashBoard")
                } else {
                    navigate("/tutorCreateAuth")
                    alert("You are not registered to this service")

                }

            })
            .catch(err => console.log(err))
    }


    return (
        <div className="student-login-container">
            <div className="login-form">
                <h2>Welcome Back!</h2>
                <p className="subtitle">Please login to continue</p>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>
                        <input type="text"
                            placeholder='Enter Email'
                            autoComplete='off'
                            name='email'
                            className='form-control rounded-0'
                            onChange={(e) => setEmail(e.target.value)}

                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input type="password"
                            placeholder='Enter Password'
                            name='password'
                            className='form-control rounded-0'
                            onChange={(e) => setPassword(e.target.value)}

                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                <div className="bg-white p-3 rounded w-25">
                    <p>Don't have an account?</p>
                    <Link to="/tutorCreateAuth" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Sign Up
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default TutorLoginPage