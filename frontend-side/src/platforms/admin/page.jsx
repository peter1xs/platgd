import { Routes, Route } from 'react-router-dom';
import TopNav from "./components/topNav/TopNav";
import Sidebar from "./components/sideBar/SideBar";
import Dashboard from "./pages/dashboard/page";
import SchoolsPage from "./pages/schools/page";
import ClassesPage from './pages/classes/page';
import AddCoursePage from './pages/courses/page';
import StudentManagement from './pages/students/page';
import TopicsPage from './pages/topics/page';
import TutorsPage from './pages/tutors/page';
import ExamsPage from './pages/exams/page';
import ExamDetailPage from './pages/exams/detail';
import TutorAssignmentsPage from './pages/tutorAssignments/page';
import ClassCodesPage from './pages/classCodes/page';
import AssignmentsPage from './pages/assignments/page';


function App() {
  return (
    <div className="app">
      <TopNav />
      <Sidebar />
      <main style={{ marginLeft: '240px', paddingTop: '60px' }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schoolsPage" element={<SchoolsPage />} />
          <Route path="/schools/:schoolId/classes" element={<ClassesPage />} />
          <Route path="coursePage" element={<AddCoursePage/>}/>
          <Route path="/schools/:schoolId/classes/:classId/students" element={<StudentManagement/>}/>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses/:courseId/topics" element={<TopicsPage />} />
          <Route path="tutorsPage" element={<TutorsPage />} />
          <Route path="examsPage" element={<ExamsPage />} />
          <Route path="courses/:courseId/exams/:examId" element={<ExamDetailPage />} />
          <Route path="tutorAssignments" element={<TutorAssignmentsPage />} />
          <Route path="classCodes" element={<ClassCodesPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;