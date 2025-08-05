import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Create from "@/components/pages/Create";
import Challenges from "@/components/pages/Challenges";
import Portfolio from "@/components/pages/Portfolio";
import Profile from "@/components/pages/Profile";
import StylerDetails from "@/components/pages/StylerDetails";
import ChallengeDetails from "@/components/pages/ChallengeDetails";
import Battle from "@/components/pages/Battle";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetails />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stylar/:id" element={<StylerDetails />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="custom-toast"
      />
    </BrowserRouter>
  );
}

export default App;