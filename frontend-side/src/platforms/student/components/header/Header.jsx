import React from "react";
import Logo from "../../../../components/logo/Logo";
import LogOutBtn from "../buttons/LogOutBtn";
import './Header.css'
function Header() {
  return (
    <div className="student-dashboard-header">
      <Logo />
      <LogOutBtn />
    </div>
  );
}

export default Header;
