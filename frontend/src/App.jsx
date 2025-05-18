
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import First from "./pages/First";
import FarmerLogin from "./pages/Login/FarmerLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import Signup from "./pages/Signup/Signup";
import AdminSignup from "./pages/Signup/AdminSignup";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import FarmerDashboard from "./pages/Dashboard/FarmerDashboard";
import FarmerSignup from "./pages/Signup/Signup";
import { LanguageProvider, LanguageContext } from "./context/LanguageContext";
import Plant from "./pages/Farmer/Plant";
import Medicine from "./pages/farmer/Medicine";
import Methods from "./pages/farmer/Methods";
import AIAssistant from "./pages/farmer/AIAssistant";
import Helpdesk from "./pages/Farmer/Helpdesk";
import Addplant from "./pages/Admin/Addplant";
import AddMethod from "./pages/Admin/Addmethod";
import Community from "./pages/Community/Communitydash";
import FarmerHelpdesk from "./pages/Farmer/Helpdesk";
import AdminHelpdesk from "./pages/Admin/Helpdesk";
import AddMediance from "./pages/Admin/Mediance";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ConditionalHeader />
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/farmer-login" element={<FarmerLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/farmer-signup" element={<FarmerSignup />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/Plant" element={<Plant />} />
          <Route path="/" element={<FarmerDashboard />} />
          <Route path="/farmer/medicine" element={<Medicine />} />
          <Route path="/farmer/methods" element={<Methods />} />
          <Route path="/farmer/ai-assistant" element={<AIAssistant />} />
          <Route path="/farmer/helpdesk" element={<Helpdesk />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-plant" element={<Addplant />} />
          <Route path="/admin/add-method" element={<AddMethod />} />
          <Route path="/Community/communitydash" element={<Community />} />
          <Route path="/farmer/Helpdesk" element={<FarmerHelpdesk />} />
          <Route path="/admin/Helpdesk" element={<AdminHelpdesk />} />
          <Route path="/admin/mediance" element={<AddMediance />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

const Header = () => {
  const { language, setLanguage } = useContext(LanguageContext);


};

const ConditionalHeader = () => {
  const location = useLocation();
  return location.pathname !== "/farmer-login" &&
    location.pathname !== "/admin-login" ? (
    <Header />
  ) : null;
};

const ConditionalNavbar = () => {
  const location = useLocation();
  return location.pathname !== "/farmer-login" &&
    location.pathname !== "/admin-login" ? (
    <Navbar />
  ) : null;
};

export default App;
