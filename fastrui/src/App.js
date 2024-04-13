import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AnimatePresence } from "framer-motion";
import {Toaster} from 'react-hot-toast'
import PaymentPage from './Components/PaymentPage/PaymentPage.jsx';
function App() {
  return (
    <div>
    <PaymentPage />
    <Toaster />
    {/* 
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/services" element={<Services />}>
        <Route path="/services" element={<Card />}></Route>
        <Route path="/services/netbanking" element={<NetBanking />}></Route>
        <Route path="/services/upi" element={<UPI />}></Route>
        <Route path="/services/e-currency" element={<ECurrency />}></Route>
        </Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
      </AnimatePresence> */}
    </div>
  );
}

export default App;
