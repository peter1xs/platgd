; import React, { useState } from 'react'
import './styles/AddStudent.css'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios' 
function AddStudent() {
      const [name, setName] = useState()
         const [userName, setUserName] = useState()
         const [password, setPassword] = useState()
         const navigate = useNavigate()
     

 const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:3001/cobotKidsKenya/students/register", { name, userName, password })
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }





    return (
        <div className="modal-overlay">
            <div className="exam-modal">
                <h2>Register A New Student </h2>
                <p>Please Ensure That The Student Details Are Correct</p>

                <form class="student-form" onSubmit={handleSubmit}>
                    {/* <!-- Personal Information --> */}
                    <div class="form-group">
                      <label htmlFor="text">
                            <strong>Name</strong>
                        </label>
                       <input type="text"
                            placeholder='Enter Student Full Names'
                            autoComplete='off'
                            name='text'
                            className='form-control rounded-0'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                   

                    <div class="form-group">
                        <label for="studentUserName">UserName</label>
                        <input type="text"
                            placeholder='Create A UserName '
                            autoComplete='off'
                            name='text'
                            id='studentUserName'
                            className='form-control rounded-0'
                            onChange={(e) =>setUserName(e.target.value)}
                        />
                    </div>


                    {/* <!-- Privacy Information --> */}
                    <div class="form-group">
                        <label for="studentPassword">Password</label>
                        <input type="password"
                            placeholder='Enter 1234 '
                            autoComplete='off'
                            name='text'
                            id='studentPassword'
                            className='form-control rounded-0'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>



                    {/* <!-- Academic Information --> */}
                    {/* <div class="form-group">
                        <label for="department">Department</label>
                        <select id="department" required>
                            <option value="">Select Department</option>
                            <option value="computer-science">Computer Science</option>
                            <option value="electrical-eng">Electrical Engineering</option>
                            <option value="mechanical-eng">Mechanical Engineering</option>
                            <option value="business">Business Administration</option>
                            <option value="biology">Biology</option>
                            <option value="mathematics">Mathematics</option>
                        </select>
                    </div> */}

                    {/* <div class="form-group">
                        <label for="year">Year</label>
                        <select id="year" required>
                            <option value="">Select Year</option>
                            <option value="1">First Year</option>
                            <option value="2">Second Year</option>
                            <option value="3">Third Year</option>
                            <option value="4">Fourth Year</option>
                        </select>
                    </div> */}
                    {/* <!-- Submit Button --> */}
                    <button type="submit" class="submit-btn">Register Student</button>
                </form>
            </div>
        </div>
    )
}

export default AddStudent