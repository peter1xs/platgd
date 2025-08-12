import React from 'react';
import "../stylesFolder/CourseCard.css"
import {Link} from 'react-router-dom'


const CourseCard = ({ emoji, title, description,course }) => {







  return (
    <div className="course-card">
      <div className="course-image">{emoji}</div>
      <div className="course-content">
        <h3 className="course-title">{title}</h3>
        <p>{description}</p>
        <br />
        <Link>{course}</Link>
      </div>
    </div>
  );
};

export default CourseCard;