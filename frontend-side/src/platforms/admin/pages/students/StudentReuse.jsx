import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './studentMangement.css'; // We'll create this CSS file

const StudentManagement = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ 
    fname: '', 
  lname: '',
  username: '',
  password: '1234'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:3001/cobotKidsKenya/schools');
        setSchools(response.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };
    fetchSchools();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedSchool && selectedClass) {
      const fetchStudents = async () => {
        try {
          const school = schools.find(s => s._id === selectedSchool);
          if (school) {
            const classData = schools.classes.find(c => c._id === selectedClass);
            setStudents(classData?.students || []);
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };
      fetchStudents();
    }
  }, [selectedSchool, selectedClass, schools]);
const handleAddStudent = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    // 1. Get school data to generate username
    const school = schools.find(s => s._id === selectedSchool);
    if (!school) throw new Error('School not found');

    // 2. Generate username (schoolcode-fname.lname)
    const generatedUsername = `${school.code}-${formData.fname.toLowerCase()}.${formData.lname.toLowerCase()}`;

    // 3. Prepare complete student data
    const studentData = {
      fname: formData.fname.trim(),
      lname: formData.lname.trim(),
      username: generatedUsername, // Include generated username
      password: "1234" // Default password
    };

    console.log('Submitting:', studentData); // Debug log

    // 4. Send request
    const response = await axios.post(
      `http://localhost:3001/api/cobotKidsKenya/schools/${selectedSchool}/classes/${selectedClass}/students`,
      studentData, // Send complete data
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // 5. Update state
    setStudents([...students, response.data]);
    setFormData({ fname: '', lname: '' });
    setShowAddForm(false);

  } catch (error) {
    console.error('Full error:', {
      requestData: error.config?.data,
      response: error.response?.data
    });
    alert(error.response?.data?.error || 'Failed to add student');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="student-management-container">
      <h1>Student Management</h1>
      
      {/* School/Class Selection */}
      <div className="selection-container">
        <select
          value={selectedSchool || ''}
          onChange={(e) => {
            setSelectedSchool(e.target.value);
            setSelectedClass(null);
            setStudents([]);
          }}
        >
          <option value="">Select School</option>
          {schools.map((school) => (
            <option key={school._id} value={school._id}>
              {school.name} ({school.code})
            </option>
          ))}
        </select>

        <select
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(e.target.value)}
          disabled={!selectedSchool}
        >
          <option value="">Select Class</option>
          {selectedSchool && schools.find(s => s._id === selectedSchool)?.classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} ({cls.level})
            </option>
          ))}
        </select>

        <button 
          onClick={() => setShowAddForm(true)}
          disabled={!selectedClass}
          className="add-button"
        >
          Add Student
        </button>
      </div>

      {/* Students Table */}
      {students.length > 0 ? (
        <table className="students-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.fname}</td>
                <td>{student.lname}</td>
                <td>{student.username}</td>
                <td>
                  {selectedSchool && 
                   schools.find(s => s._id === selectedSchool)
                    ?.classes.find(c => c.students.some(s => s._id === student._id))?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found. Please select a school and class.</p>
      )}

      {/* Add Student Overlay */}
      {showAddForm && (
        <div className="overlay">
          <div className="add-form">
            <h2>Add New Student</h2>
            <button 
              className="close-button" 
              onClick={() => {
                setShowAddForm(false);
                setSuccessMessage('');
              }}
            >
              ×
            </button>
            
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={formData.fname}
                  onChange={(e) => setFormData({...formData, fname: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={formData.lname}
                  onChange={(e) => setFormData({...formData, lname: e.target.value})}
                  required
                />
              </div>
              
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Student'}
              </button>
              
              {successMessage && (
                <div className={`success-message ${successMessage.includes('Failed') ? 'error' : ''}`}>
                  {successMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;