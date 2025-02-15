import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DownsamplerPage from "./pages/DownsamplerPage";
import PoseTransferPage from "./pages/PoseTransferPage";
import HomePage from "./pages/HomePage";
import "./components/styles.css";

export default function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/downsampler" style={{ marginRight: "1rem" }}>
            Downsampler
          </Link>
          <Link to="/pose-transfer">Pose Transfer</Link>
        </nav>
        <main style={{ padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/downsampler" element={<DownsamplerPage />} />
            <Route path="/pose-transfer" element={<PoseTransferPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
