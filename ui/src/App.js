import React from "react";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import { Route,Routes } from "react-router-dom";
import Home from "./Navbar/Home";
import Services from "./Navbar/Services";
import About from "./Navbar/About";
import CardUpi from "./Card-UPI/CardUpi";
import UPI from "./UPI/UPI";
import MultiCard from "./MultiCards/MultiCard";
const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/services/*" element={<Services />}></Route>
      <Route path="services/card-upi" element={<CardUpi />}></Route>
      <Route path="services/upi" element={<UPI />}></Route>
      <Route path="services/multi-card" element={<MultiCard />}></Route>
      <Route path="/about" element={<About />}></Route>
    </Routes>
    <Footer />
    </>
  );
};

export default App;
