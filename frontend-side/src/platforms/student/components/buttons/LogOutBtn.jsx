import React from 'react'
import { Link } from "react-router-dom";
import './LogOutBtn.css'


function LogOutBtn() {
  return (
     <Link to="/studentauth" className="magic-button">
              End Class
            </Link>
  )
}

export default LogOutBtn