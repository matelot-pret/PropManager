// ...existing code...
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Biens from "./pages/Biens.jsx";
import Locataires from "./pages/Locataires.jsx";
import BienDetails from "./pages/BienDetails.jsx";
import ChambreDetails from "./pages/ChambreDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Router>
      <nav
        style={{
          padding: 16,
          background: "#f8fafc",
          marginBottom: 24,
          display: "flex",
          gap: 24,
        }}
      >
        <Link to="/">Dashboard</Link>
        <Link to="/biens">Biens</Link>
        <Link to="/locataires">Locataires</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/biens" element={<Biens />} />
        <Route path="/locataires" element={<Locataires />} />
        <Route path="/biens/:id" element={<BienDetails />} />
        <Route path="/chambres/:id" element={<ChambreDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
