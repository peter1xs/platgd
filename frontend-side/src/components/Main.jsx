import React from 'react';
import CourseCard from '../components/CourseCard';
import InteractiveConsole from './InteractiveConsole';
const Main = () => {
  const courses = [
    {
      emoji: "🐍",
      title: "Python Playground",
      description: "Learn Python by creating games and solving puzzles!",
      course: 'View Course', url: './tutorAuth' ,
    },
     {
      emoji: "🐍",
      title: "Python Playground",
      description: "Learn Python by creating games and solving puzzles!"
    },
    {
      emoji: "🌐",
      title: "Web Wizard",
      description: "Build your first website with HTML, CSS & JavaScript!",
       course: 'View Course', url: './tutorAuth' ,
    },
    {
      emoji: "🔐",
      title: "Cyber Security",
      description: "Learn how to protect computers and stay safe online!",
       course: 'View Course', url: './tutorAuth' ,
    },
     {
      emoji: "🔐",
      title: "Cyber Security",
      description: "Learn how to protect computers and stay safe online!",
       course: 'View Course', url: './tutorAuth' ,
    },
     {
      emoji: "🔐",
      title: "Cyber Security",
      description: "Learn how to protect computers and stay safe online!",
       course: 'View Course', url: './tutorAuth' ,
    },
     {
      emoji: "🔐",
      title: "Cyber Security",
      description: "Learn how to protect computers and stay safe online!",
       course: 'View Course', url: './tutorAuth' ,
    },
     {
      emoji: "🔐",
      title: "Cyber Security",
      description: "Learn how to protect computers and stay safe online!",
       course: 'View Course', url: './tutorAuth' ,
    }
  ];

  return (
    <main>
      <section id="courses" className="courses">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            emoji={course.emoji}
            title={course.title}
            description={course.description}
            course={course.course}

          />
          
        ))}
      </section>
      
      <InteractiveConsole />
    </main>
  );
};

export default Main;