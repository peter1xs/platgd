import React from 'react'
import GenarateCode from './GenarateCode'
import './styles/TutorDashboardMainArea.css'
import Header from './components/header/Header'

function TutorDashboardMainArea() {
    
  return (
    // <!-- Main Content Area -->
        <div class="main-content">
           {/* Header */}
           <Header/>
            <div class="content-section">
                <div class="section-header">
                    <h2>Assigned Schools</h2>
                    <div class="section-actions">
                        <button class="secondary-button" id="copy-all-button">
                            <i class="fas fa-copy"></i> Copy All
                        </button>
                        <button class="secondary-button" id="disable-all-button">
                            <i class="fas fa-ban"></i> Disable All
                        </button>
                    </div>
                </div>

                <div class="class-codes-list" id="class-codes-list">
            <GenarateCode/>
            <GenarateCode/>
            <GenarateCode/>
            <GenarateCode/>
            <GenarateCode/>
                </div>

                <div class="section-header inactive-codes-header">
                    <h2>Inactive Class Codes</h2>
                </div>

                <div class="class-codes-list inactive" id="inactive-codes-list">
                   <GenarateCode/>
            <GenarateCode/>
            <GenarateCode/>
            <GenarateCode/>
            <GenarateCode/>
                </div>
            </div>
        </div>
  )
}

export default TutorDashboardMainArea