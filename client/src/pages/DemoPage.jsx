import { useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const FEATURES = [
  { icon: "✳", title: "Find your focus" },
  { icon: "⌁", title: "Work together" },
  { icon: "✦", title: "Make progress" },
];

export default function DemoPage() {
  useEffect(() => {
    // Reuse the tracker when navigating back to the demo page.
    if (window.__pulseAnalytics) {
      window.__pulseAnalytics.trackPageView();
      return;
    }

    // Avoid adding another script if one is still loading.
    if (document.getElementById("pulse-tracker")) return;

    const script = document.createElement("script");
    script.id = "pulse-tracker";
    script.src = "/tracker.js";
    script.dataset.api = API_BASE + "/events";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  function scrollToFeatures() {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  }

  function toggleChosen(event) {
    event.currentTarget.classList.toggle("chosen");
  }

  function showTrackedAlert() {
    alert("Nice click! This event is tracked.");
  }

  return (
    <div className="demo">
      <nav>
        <b>BrightSpace</b>
        <Link to="/">← Dashboard</Link>
      </nav>

      <section className="hero">
        <small>MADE FOR YOUR FLOW</small>
        <h1>
          Make room for
          <br />
          <em>great ideas.</em>
        </h1>
        <p>
          This sample webpage generates page views and click events. Try
          clicking buttons, cards and links, then view the dashboard.
        </p>
        <button onClick={scrollToFeatures}>Explore features ↓</button>{" "}
        <Link to="/">View analytics ↗</Link>
      </section>

      <section id="features" className="features">
        <h2>Small details. Big difference.</h2>

        <div className="cards">
          {FEATURES.map(({ icon, title }) => (
            <button key={title} onClick={toggleChosen}>
              <span>{icon}</span>
              <h3>{title}</h3>
              <p>Bring ideas together and turn them into meaningful progress.</p>
              Click to interact ↗
            </button>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Build something worth clicking.</h2>
        <button onClick={showTrackedAlert}>Try an interactive button ↗</button>
      </section>
    </div>
  );
}