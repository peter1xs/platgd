# Tutor Dashboard

A comprehensive dashboard for tutors to manage their classes, students, lessons, assignments, exams, and schools.

## Features

### 🎯 Dashboard Overview
- Statistics Cards: View total students, lessons, assignments, and exams
- Recent Activities: See recent lessons, upcoming lessons, pending assignments, and recent exams
- Quick Actions: Easy access to create new content and view recent activities

### 📚 Lessons Management
- Create Lessons: Add new lessons with title, description, subject, class, content, scheduled date, duration, and difficulty
- Edit Lessons: Modify existing lessons
- Delete Lessons: Remove lessons from the system
- Lesson Status: Track lesson status (draft, published, archived)
- Lesson Details: View comprehensive lesson information including materials, objectives, and attendance

### 👥 Students Management
- Student List: View all students assigned to your classes
- Student Details: Comprehensive student profiles including personal, academic, and medical information
- Search & Filter: Find students by name, email, class, or status
- Student Status: Track student status (active, inactive, suspended, graduated)

### 📝 Assignments Management
- Create Assignments: Add new assignments with title, description, subject, class, due date, total points, and instructions
- Edit Assignments: Modify existing assignments
- Grade Submissions: Grade student submissions with feedback
- Assignment Status: Track assignment status (draft, published, submitted, graded, archived)
- Submission Tracking: Monitor student submissions and grades

### 📋 Exams Management
- Create Exams: Add new exams with questions, duration, start/end dates, and total points
- Edit Exams: Modify existing exams
- Grade Exams: Grade student exam submissions
- Exam Status: Track exam status (draft, published, active, completed, archived)
- Question Types: Support for multiple choice, true/false, short answer, and essay questions

### 🏫 Schools Management
- School Overview: View assigned schools with statistics
- School Details: Comprehensive school information including classes and students
- Class Information: View class details, schedules, and student counts
- Student Lists: Browse students by school

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- RESTful API architecture

### Frontend
- React.js with functional components and hooks
- Modern CSS with glassmorphism design
- Responsive design for mobile and desktop

### Models
- Tutor: Tutor information and credentials
- Student: Student profiles and academic information
- Lesson: Lesson content and scheduling
- Assignment: Assignment details and submissions
- Exam: Exam questions and submissions
- School: School information and classes

## API Endpoints

### Dashboard
- GET /api/tutor-dashboard/dashboard/:tutorId - Get dashboard overview

### Lessons
- GET /api/tutor-dashboard/lessons/:tutorId - Get all lessons
- POST /api/tutor-dashboard/lessons - Create new lesson
- PUT /api/tutor-dashboard/lessons/:lessonId - Update lesson
- DELETE /api/tutor-dashboard/lessons/:lessonId - Delete lesson

### Students
- GET /api/tutor-dashboard/students/:tutorId - Get all students
- GET /api/tutor-dashboard/students/:tutorId/:studentId - Get student details

### Assignments
- GET /api/tutor-dashboard/assignments/:tutorId - Get all assignments
- POST /api/tutor-dashboard/assignments - Create new assignment
- PUT /api/tutor-dashboard/assignments/:assignmentId - Update assignment
- POST /api/tutor-dashboard/assignments/:assignmentId/grade - Grade submission

### Exams
- GET /api/tutor-dashboard/exams/:tutorId - Get all exams
- POST /api/tutor-dashboard/exams - Create new exam
- PUT /api/tutor-dashboard/exams/:examId - Update exam
- POST /api/tutor-dashboard/exams/:examId/grade - Grade exam submission

### Schools
- GET /api/tutor-dashboard/schools/:tutorId - Get assigned schools
- GET /api/tutor-dashboard/schools/:tutorId/:schoolId - Get school details

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string and other configurations
   ```

4. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Accessing the Dashboard
1. Navigate to the tutor dashboard URL: `http://localhost:3000/tutor-dashboard/:tutorId`
2. Replace `:tutorId` with the actual tutor ID
3. The dashboard will load with the overview tab active

### Creating Content
1. **Lessons**: Click the "Lessons" tab and then "New Lesson" button
2. **Assignments**: Click the "Assignments" tab and then "New Assignment" button
3. **Exams**: Click the "Exams" tab and then "New Exam" button

### Managing Students
1. Click the "Students" tab to view all students
2. Click on a student card to view detailed information
3. Use the search and filter options to find specific students

### Grading Submissions
1. Navigate to Assignments or Exams tab
2. Click the "Grade" button on any assignment or exam
3. Enter grades and feedback for student submissions
4. Click "Grade" to save the grades

## Design Features

### Modern UI/UX
- Glassmorphism Design: Modern glass-like interface with backdrop blur effects
- Gradient Backgrounds: Beautiful gradient backgrounds for visual appeal
- Smooth Animations: Hover effects and transitions for better user experience
- Responsive Design: Works seamlessly on desktop, tablet, and mobile devices

### Color Scheme
- Primary: Blue gradient (#667eea to #764ba2)
- Secondary: White with transparency
- Accent: Various status colors for different states

### Typography
- Headings: Bold, modern fonts for hierarchy
- Body Text: Clean, readable fonts for content
- Status Badges: Compact, colored badges for status indicators

## Security Features

### Authentication
- Tutor authentication required for all endpoints
- Session management for secure access
- Role-based access control

### Data Validation
- Input validation on all forms
- Server-side validation for all API endpoints
- Error handling and user feedback

## Performance Optimization

### Frontend
- Lazy Loading: Components load only when needed
- Optimized Images: Compressed images for faster loading
- Efficient State Management: React hooks for optimal performance

### Backend
- Database Indexing: Optimized queries with proper indexing
- Pagination: Large datasets are paginated for better performance
- Caching: Frequently accessed data is cached

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

