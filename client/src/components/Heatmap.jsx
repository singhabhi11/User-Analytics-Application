

import { useEffect, useState } from "react";
import { getPages, getHeatmap } from "../api.js";

export default function Heatmap({ refreshKey = 0 }) {
  const [pages, setPages] = useState([]);
  const [url, setUrl] = useState("");
  const [clicks, setClicks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;

    getPages()
      .then((p) => {
        if (!current) return;
        setPages(p);
        setUrl((current) => (current && p.includes(current) ? current : p[0] || ""));
        setError("");
      })
      .catch((e) => {
        if (current) setError(e.message);
      });

    return () => {
      current = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    let current = true;

    if (!url) {
      setClicks([]);
      return () => {
        current = false;
      };
    }

    getHeatmap(url)
      .then((c) => {
        if (!current) return;
        setClicks(c);
        setError("");
      })
      .catch((e) => {
        if (current) setError(e.message);
      });

    return () => {
      current = false;
    };
  }, [url, refreshKey]);

  return (
    <section className="panel">
      <div className="row">
        <div>
          <h2>Click heatmap</h2>
          <p className="muted">Dots represent recorded viewport-relative click positions.</p>
        </div>
        <select value={url} onChange={(e) => setUrl(e.target.value)}>
          {!pages.length && <option value="">No pages tracked yet</option>}
          {pages.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      <p>{clicks.length} click events</p>

      <div className="canvas">
        <div className="browser">● ● ●　{url}</div>
        <div className="fake-content">
          <h3>Sample page layout</h3>
          <p>Tracked click positions are shown as dots.</p>
          <div className="fake-cards"><span /><span /><span /></div>
        </div>
        {clicks.map((c, i) => (
          <i
            key={c._id || i}
            className="dot"
            title={`x=${c.x}, y=${c.y}`}
            style={{
              left: `${Math.min(100, Math.max(0, (c.x / (c.viewport_width || 1)) * 100))}%`,
              top: `${Math.min(100, Math.max(0, (c.y / (c.viewport_height || 1)) * 100))}%`,
            }}
          />
        ))}
        {!clicks.length && <p className="canvas-empty">No clicks yet. Visit the demo page and click around.</p>}
      </div>

      <p className="muted">Trade-off: this is a generic canvas rather than a screenshot of the original page.</p>
    </section>
  );
}
