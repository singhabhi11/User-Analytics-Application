


(function () {
  "use strict";

  var script = document.currentScript;
  var api =
    (script && script.getAttribute("data-api")) ||
    "http://localhost:5000/api/events";
  var sessionKey = "pulse_analytics_session_id";

  function isDemoPage() {
    return location.pathname.replace(/\/+$/, "") === "/demo";
  }

  // Reuse the tracker if it has already been loaded.
  if (window.__pulseAnalytics) {
    if (isDemoPage()) {
      window.__pulseAnalytics.trackPageView();
    }
    return;
  }

  function generateId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return (
      "sid-" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  function readCookie(name) {
    var match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]*)")
    );

    return match ? decodeURIComponent(match[1]) : null;
  }

  function getSessionId() {
    try {
      var existing = localStorage.getItem(sessionKey);
      if (existing) return existing;

      var created = generateId();
      localStorage.setItem(sessionKey, created);
      return created;
    } catch (error) {
      var cookieId = readCookie(sessionKey);
      if (cookieId) return cookieId;

      var fresh = generateId();
      document.cookie =
        sessionKey +
        "=" +
        encodeURIComponent(fresh) +
        "; max-age=31536000; path=/; SameSite=Lax";

      return fresh;
    }
  }

  var sessionId = getSessionId();

  function send(eventType, point) {
    var data = {
      session_id: sessionId,
      event_type: eventType,
      page_url: location.href,
      timestamp: new Date().toISOString(),
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    };

    if (point) {
      data.x = point.x;
      data.y = point.y;
    }

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    })
      .then(function (response) {
        if (!response.ok) {
          console.error("Analytics event rejected:", response.status);
          return response.text().then(function (text) {
            console.error(text);
          });
        }
      })
      .catch(function (error) {
        console.warn("Analytics event failed:", error.message);
      });
  }

  window.__pulseAnalytics = {
    trackPageView: function () {
      if (isDemoPage()) {
        send("page_view");
      }
    },
  };

  // Only record events while the demo page is open—not dashboard refreshes.
  window.__pulseAnalytics.trackPageView();

  document.addEventListener(
    "click",
    function (event) {
      if (!isDemoPage()) return;

      send("click", {
        x: event.clientX,
        y: event.clientY,
      });
    },
    true
  );
})();