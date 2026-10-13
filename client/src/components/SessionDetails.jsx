export default function SessionDetails({ session, events, loading, onClose }) {
  if (!session) {
    return (
      <section className="panel empty">
        <h2>Select a session</h2>
        <p>Choose a session to inspect its ordered user journey.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="row">
        <h2>User journey</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <p className="muted">
        Session ID: <code>{session.session_id}</code>
      </p>

      <div className="stats">
        <span>
          Events <b>{session.total_events}</b>
        </span>
        <span>
          Views <b>{session.page_views}</b>
        </span>
        <span>
          Clicks <b>{session.clicks}</b>
        </span>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="journey">
          {events.map((event, index) => (
            <article key={event._id || index}>
              <b>
                {event.event_type === "page_view"
                  ? "◉ Page viewed"
                  : "↗ Click recorded"}
              </b>
              <time>{new Date(event.timestamp).toLocaleString()}</time>
              <p>{event.page_url}</p>

              {event.event_type === "click" && (
                <small>
                  x={Math.round(event.x)}, y={Math.round(event.y)}
                </small>
              )}
            </article>
          ))}

          {!events.length && <p>No events for this session.</p>}
        </div>
      )}
    </section>
  );
}