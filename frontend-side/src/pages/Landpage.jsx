import React from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import About from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import Contact from '../components/Contact';
// import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ClassAccess from '../components/ClassAccess';
function Landpage() {
  return (
   <div className="App">
    <Navbar />
      <Header />
      <Main />
       <About />
       <WhyChooseUs/>
       <Contact/>
       {/* <FAQ/> */}
       <Footer/>
    </div>
  )
}

export default Landpage