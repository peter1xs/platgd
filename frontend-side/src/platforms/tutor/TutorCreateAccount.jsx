import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios' 
import './styles/TutorAouth.css'




function TutorCreateAccount() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:3001/cobotKidsKenya/employees/register", { name, email, password })
            .then(result => {
                console.log(result)
                navigate("/tutorLogInAuth")
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="student-login-container">
            <div className="student-login-animation">
                <div className="floating-shapes">
                    <div className="shape triangle"></div>
                    <div className="shape circle"></div>
                    <div className="shape square"></div>
                </div>

                <div className="character">
                    <div className="head">
                        <div className="eyes">
                            <div className={`eye left `}>

                            </div>
                            <div className={`eye right `}></div>
                        </div>
                        <div className={`mouth `}></div>
                    </div>
                    <div className="body"></div>
                    <div className="arm left"></div>
                    <div className="arm right"></div>
                </div>
                <div className="character">
                    <div className="head">
                        <div className="eyes">
                            <div className={`eye left `}>

                            </div>
                            <div className={`eye right `}></div>
                        </div>
                        <div className={`mouth `}></div>
                    </div>
                    <div className="body"></div>
                    <div className="arm left"></div>
                    <div className="arm right"></div>
                </div>



               

            </div>
            <div className="login-form">
                <h2>Welcome Tutor!</h2>
                <p className="subtitle">Please Enter Your Company Details To Create Account</p>
                 <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="text">
                            <strong>Name</strong>
                        </label>
                        <input type="text"
                            placeholder='Enter Name'
                            autoComplete='off'
                            name='text'
                            className='form-control rounded-0'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">
                            <strong>Email</strong>
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
                        Sign Up
                    </button>
                </form>
                <p>Already have an account?</p>
                <Link to="/tutorLogInAuth" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default TutorCreateAccount