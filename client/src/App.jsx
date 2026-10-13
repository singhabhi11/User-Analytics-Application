import { NavLink, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import DemoPage from "./pages/DemoPage.jsx";

export default function App() {
  return (
    <div className="shell">
      <header>
        <NavLink className="brand" to="/">
          ◈ User Analytics
        </NavLink>

        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/demo">Demo page</NavLink>
        </nav>

        <span className="live">● Tracking demo</span>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer>User Analytics · Lightweight event tracking demo</footer>
    </div>
  );
}