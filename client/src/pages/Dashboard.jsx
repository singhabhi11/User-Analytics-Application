import { useEffect, useRef, useState } from "react";
import { getSessions, getSessionEvents } from "../api.js";
import SessionDetails from "../components/SessionDetails.jsx";
import Heatmap from "../components/Heatmap.jsx";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState("sessions");
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshInProgress = useRef(false);
  const selectedId = useRef(null);
  const eventRequest = useRef(0);

  async function refresh() {
    if (refreshInProgress.current) return;

    refreshInProgress.current = true;
    setLoading(true);
    setError("");

    try {
      const freshSessions = await getSessions();
      setSessions(freshSessions);
      setRefreshKey((key) => key + 1);

      const currentSelectedId = selectedId.current;
      if (!currentSelectedId) return;

      const freshSelected = freshSessions.find(
        (session) => session.session_id === currentSelectedId
      );

      if (!freshSelected) {
        selectedId.current = null;
        eventRequest.current += 1;
        setSelected(null);
        setEvents([]);
        setDetailsLoading(false);
        return;
      }

      setSelected(freshSelected);
      setDetailsLoading(true);

      const requestId = ++eventRequest.current;

      try {
        const freshEvents = await getSessionEvents(currentSelectedId);

        if (requestId === eventRequest.current) {
          setEvents(freshEvents);
        }
      } catch (e) {
        if (requestId === eventRequest.current) {
          setError(
            (e?.message || "Unable to load session events") +
            " — check the backend and MongoDB."
          );
        }
      } finally {
        if (requestId === eventRequest.current) {
          setDetailsLoading(false);
        }
      }
    } catch (e) {
      setError(
        (e?.message || "Unable to load dashboard data") +
        " — check the backend and MongoDB."
      );
    } finally {
      refreshInProgress.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // Initial dashboard load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function choose(session) {
    selectedId.current = session.session_id;
    setSelected(session);
    setEvents([]);
    setError("");
    setDetailsLoading(true);

    const requestId = ++eventRequest.current;

    try {
      const sessionEvents = await getSessionEvents(session.session_id);

      if (requestId === eventRequest.current) {
        setEvents(sessionEvents);
      }
    } catch (e) {
      if (requestId === eventRequest.current) {
        setError(e?.message || "Unable to load session events.");
      }
    } finally {
      if (requestId === eventRequest.current) {
        setDetailsLoading(false);
      }
    }
  }

  function closeDetails() {
    selectedId.current = null;
    eventRequest.current += 1;
    setSelected(null);
    setEvents([]);
    setDetailsLoading(false);
  }

  const total = sessions.reduce(
    (n, session) => n + session.total_events,
    0
  );

  const views = sessions.reduce(
    (n, session) => n + session.page_views,
    0
  );

  const clicks = sessions.reduce(
    (n, session) => n + session.clicks,
    0
  );

  const metrics = [
    {
      label: "Total sessions",
      value: sessions.length,
      icon: "◉",
      color: "bg-violet-100 text-violet-700",
      description: "Unique visitor sessions",
    },
    {
      label: "Events collected",
      value: total,
      icon: "⌁",
      color: "bg-blue-100 text-blue-700",
      description: "Total recorded activity",
    },
    {
      label: "Page views",
      value: views,
      icon: "▤",
      color: "bg-emerald-100 text-emerald-700",
      description: "Pages viewed by visitors",
    },
    {
      label: "Total clicks",
      value: clicks,
      icon: "⌖",
      color: "bg-amber-100 text-amber-700",
      description: "Recorded click events",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-10">


      <div className="mx-auto max-w-[1600px] space-y-8">

        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Analytics overview
            </div>

            <h1 className="  animate-[slideRight_2s_ease-in-out_infinite]text-xl font-bold tracking-tight text-slate-950 sm:text-xl">
              “Track visitors. Discover insights.”
            </h1>
          </div>


        </header>








        {/* Metric cards */}
        <section
          aria-label="Analytics metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    {metric.value.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${metric.color}`}
                >
                  {metric.icon}
                </div>
              </div>

              <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {metric.description}
              </p>
            </div>
          ))}
        </section>

        {/* Main analytics panel */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Tabs and status */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div
              className="flex items-center gap-1"
              role="tablist"
              aria-label="Analytics views"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "sessions"}
                onClick={() => setTab("sessions")}
                className={`relative rounded-t-lg px-4 py-3 text-sm font-semibold transition ${tab === "sessions"
                  ? "bg-violet-50 text-violet-700 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-violet-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                Sessions
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tab === "heatmap"}
                onClick={() => setTab("heatmap")}
                className={`relative rounded-t-lg px-4 py-3 text-sm font-semibold transition ${tab === "heatmap"
                  ? "bg-violet-50 text-violet-700 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-violet-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                Heatmap
              </button>
            </div>

            <div className="flex items-center gap-2 pb-4 text-xs font-medium text-slate-500 sm:pb-0">
              <span
                className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-amber-400" : "bg-emerald-500"
                  }`}
              />
              {loading ? "Updating analytics..." : "Dashboard ready"}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
            >
              <span className="font-semibold">Something went wrong: </span>
              {error}
            </div>
          )}

          {/* Tab content */}
          <div className="p-4 sm:p-6">
            {tab === "heatmap" ? (
              <div className="min-w-0">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Click activity heatmap
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Explore where visitors interact with your pages.
                  </p>
                </div>

                <Heatmap refreshKey={refreshKey} />
              </div>
            ) : (
              <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">

                {/* Sessions table */}
                <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Recent sessions
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Select a visitor to explore their journey.
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {sessions.length} sessions
                    </span>
                  </div>

                  {!sessions.length && loading ? (
                    <div className="space-y-4 p-6">
                      <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                      <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                      <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                    </div>
                  ) : !sessions.length ? (
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-3xl text-violet-600">
                        ◉
                      </div>
                      <h3 className="mt-4 font-semibold text-slate-900">
                        No sessions yet
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        Open your demo page and interact with it to collect
                        visitor events. Then refresh the dashboard.
                      </p>

                      <button
                        type="button"
                        onClick={refresh}
                        disabled={loading}
                        className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Check again
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left">
                        <thead className="bg-white">
                          <tr className="border-b border-slate-100">
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                              Visitor session
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Events
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Last active
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {sessions.map((session) => {
                            const isSelected =
                              selected?.session_id === session.session_id;

                            return (
                              <tr
                                key={session.session_id}
                                onClick={() => choose(session)}
                                aria-selected={isSelected}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" ||
                                    e.key === " "
                                  ) {
                                    e.preventDefault();
                                    choose(session);
                                  }
                                }}
                                className={`cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 ${isSelected
                                  ? "bg-violet-50/80"
                                  : "hover:bg-slate-50"
                                  }`}
                              >
                                <td className="px-4 py-4 sm:px-5">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isSelected
                                        ? "bg-violet-600 text-white"
                                        : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                      {session.session_id
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                                        {session.session_id.slice(0, 18)}…
                                      </p>
                                      <p className="mt-1 text-xs text-slate-500">
                                        {session.page_views} views ·{" "}
                                        {session.clicks} clicks
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <span className="inline-flex min-w-10 justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-slate-700">
                                    {session.total_events}
                                  </span>
                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-xs leading-5 text-slate-500">
                                  {new Date(
                                    session.last_seen
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                    <p className="text-xs text-slate-500">
                      Showing up to 500 recent sessions.
                    </p>
                  </div>
                </section>

                {/* Session details */}
                <section className="min-w-0">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      Session details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Inspect individual visitor activity.
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
                    <SessionDetails
                      session={selected}
                      events={events}
                      loading={detailsLoading}
                      onClose={closeDetails}
                    />
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Analytics dashboard
            <span className="mx-2 text-slate-300">•</span>
            Anonymous visitor IDs
          </p>
          {/* <p>Data updates when you refresh.</p> */}
        </footer>
      </div>
    </main>
  );
}