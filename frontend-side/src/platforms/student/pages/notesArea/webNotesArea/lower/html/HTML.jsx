
import React, { useState, useEffect } from "react";
import ComingSoon from "../../../../../../../components/comingSoon/ComingSoon";
import './componets/HtmlLessonOne'
import './html.css'
import HtmlLessonOne from "./componets/HtmlLessonOne";
import HtmlLessonTwo from "./componets/HtmlLessonTwo"
import HtmlLessonThree from "./componets/HtmlLessonThree"
import HtmlLessonFour from "./componets/HtmlLessonFour"
function HTML() {
 const [activeTab, setActiveTab] = useState("lessonOne");

  const lessonOne = [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];


  const lessonTwo = [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];

  const lessonThree = [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];


 const lessonFour= [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];

const lessonFive= [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];

  const lessonSix= [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];

  const lessonSeven= [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];


const lessonEight= [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];

  return (
  <div className="student-dashboard-container">
      {/* Main Content */}
      <div className="student-dashboard-content">
        {/* Sidebar */}
        <aside className="student-sidebar">
          <nav>
            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonOne" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonOne")}
            >
              <span className="icon">
                <i class="fa-solid fa-chalkboard"></i>
              </span>
              <span className="icon-name">Introduction</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonTwo" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonTwo")}
            >
              <span className="icon">
                <i class="fa-solid fa-chalkboard"></i>
              </span>
              <span className="icon-name">HTML Basics</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonThree" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonThree")}
            >
              <span className="icon">
                <i class="fa-solid fa-graduation-cap"></i>
              </span>
              <span className="icon-name">Paragraph & Text Formatting</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonFour" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonFour")}
            >
              <span className="icon">
                <i class="fa-solid fa-people-group"></i>
              </span>
              <span className="icon-name">Working With Images</span>
            </button>
            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonFive" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonFive")}
            >
              <span className="icon">
                <i class="fa-solid fa-people-group"></i>
              </span>
              <span className="icon-name">Animations With Images</span>
            </button>
            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonSix" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonSix")}
            >
              <span className="icon">
                <i class="fa-solid fa-people-group"></i>
              </span>
              <span className="icon-name">Adding Videos</span>
            </button>
            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonSeven" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonSeven")}
            >
              <span className="icon">
                <i class="fa-solid fa-people-group"></i>
              </span>
              <span className="icon-name">HTML Lists</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "lessonEight" ? "active" : ""
              }`}
              onClick={() => setActiveTab("lessonEight")}
            >
              <span className="icon">
                <i class="fa-solid fa-people-group"></i>
              </span>
              <span className="icon-name">HTML Input Types</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {/* Lesson One*/}
          {activeTab === "lessonOne" && (
            <div className="challenges-section">
              <div className="challenges-list">
                {lessonOne.map((lessonOne) => (
                  <HtmlLessonOne/>
                ))}
              </div>
            </div>
          )}

          
          {/* Lesson Two */}
          {activeTab === "lessonTwo" && (
            <div className="performance-section">
              <HtmlLessonTwo/>
            </div>
          )}

          {/*  Lesson Three*/}
          {activeTab === "lessonThree" && (
            <div className="followers-section">
              <HtmlLessonThree />
            </div>
          )}

          {/*  Lesson Four*/}
          {activeTab === "lessonFour" && (
            <div className="followers-section">
              <h2>Lesson 4</h2>

              <HtmlLessonFour/>
            </div>
          )}
       
       {/*  Lesson Five*/}
          {activeTab === "lessonFive" && (
            <div className="followers-section">
              <h2>Lesson 5</h2>

              <ComingSoon />
            </div>
          )}

          {/*  Lesson Six*/}
          {activeTab === "lessonSix" && (
            <div className="followers-section">
              <h2>Lesson 6</h2>

              <ComingSoon />
            </div>
          )}
          {/*  Lesson Seven*/}
          {activeTab === "lessonSeven" && (
            <div className="followers-section">
              <h2>Lesson 7</h2>

              <ComingSoon />
            </div>
          )}

          {/*  Lesson 8*/}
          {activeTab === "lessonEight" && (
            <div className="followers-section">
              <h2>Lesson 8</h2>

              <ComingSoon />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default HTML