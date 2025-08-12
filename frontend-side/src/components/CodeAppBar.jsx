import React from 'react'
import '../stylesFolder/CodeEditorAppBar.css'; // Ensure you have the appropriate styles    
 import { Link } from 'react-router-dom';
function CodeAppBar() {
  return (
     <div class="code-editor-container">
       <div className="title-bar">
        <Link to="/studentdashboard" class="action-btn run">
         <i class="fas fa-play"></i> Go To DashBoard</Link>
        
       </div>
        
        <div class="action-bar">
            <button class="action-btn download">
                <i class="fas fa-download"></i> Download Code
            </button>
            <button class="action-btn post">
                <i class="fas fa-share-alt"></i> Post to Project
            </button>
            <button class="action-btn host">
                <i class="fas fa-globe"></i> Host Online
            </button>
            <button class="action-btn run">
                <i class="fas fa-play"></i> Run Code
            </button>
        </div>
        
       
    </div>
  )
}

export default CodeAppBar