# User Analytics Application 

A full-stack analytics application built with the MERN stack to track
visitor interactions, explore user sessions, and visualize click
behavior through a heatmap.

The project includes a React dashboard, a Node.js/Express API, and
MongoDB storage for analytics events.

## Features

-   **Event tracking:** Records `page_view` and `click` events.
-   **Session tracking:** Associates events with a `session_id`.
-   **Event details:** Captures the page URL, timestamp, and click
    coordinates for click events.
-   **Sessions dashboard:** Lists sessions with event counts.
-   **User journey:** Displays the ordered events for a selected
    session.
-   **Click heatmap:** Visualizes click positions for a selected page.
-   **REST API:** Provides endpoints for event ingestion and analytics
    queries.
-   **Demo page:** Includes a page for trying out client-side tracking.

## Tech Stack

  Layer      Technology
  ---------- ---------------------
  Frontend   React, Tailwind CSS
  Backend    Node.js, Express.js
  Database   MongoDB
  API        REST
  Language   JavaScript

## Project Structure

The tree below follows the folder structure shown in this repository:

``` text
project-root/
├── client/
│   ├── dist/
│   │   └── tracker.js
│   ├── public/
│   │   └── tracker.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── Heatmap.jsx
│   │   │   └── SessionDetails.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── DemoPage.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Event.js
│   │   ├── routes/
│   │   │   └── analytics.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

`client/dist/` is a build-output directory. In general, generated build
files should be produced by the build command rather than edited
manually. Keep it in version control only if your project workflow
requires it.

## Getting Started

### Prerequisites

-   Node.js and npm
-   MongoDB running locally or a MongoDB Atlas database
-   Git

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your actual repository URL and folder
name.

### 2. Configure and start the backend

Open a terminal at the project root:

``` bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in the values required by your
server. For example, your configuration may include:

``` env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/user_analytics
```

These names and values are examples; use the exact environment-variable
names read by `server/src/server.js` and your MongoDB connection code.
For MongoDB Atlas, use your Atlas connection URI.

Start the backend using a script available in `server/package.json`. For
example, if the relevant script exists:

``` bash
npm run dev
```

Or use:

``` bash
npm start
```

The backend URL depends on your configured port.

### 3. Configure and start the frontend

Open a second terminal from the project root:

``` bash
cd client
npm install
```

Review `client/.env.example` and create a local `.env` file with the API
base URL expected by `client/src/api.js`. For example, if your frontend
uses a Vite environment variable, it may look like:

``` env
VITE_API_URL=http://localhost:5000/api
```

Use the exact variable name expected by `client/src/api.js`;
`VITE_API_URL` is only an example.

Start the frontend using the script available in `client/package.json`,
commonly:

``` bash
npm run dev
```

Open the local URL printed by the frontend development server.

## How It Works

1.  A visitor opens the demo or another page that loads the tracking
    script.
2.  The tracker records a page-view event and associates it with a
    session ID.
3.  Click interactions are recorded with page information, timestamps,
    and coordinates.
4.  The tracker sends event data to the Express API.
5.  The backend stores the events in MongoDB.
6.  The React dashboard retrieves analytics data through the API.
7.  The Sessions view displays session summaries and event histories;
    the Heatmap view visualizes click positions.

## Main Frontend Files

  --------------------------------------------------------------------------------
  File                                         Responsibility
  -------------------------------------------- -----------------------------------
  `client/public/tracker.js`                   Tracking script served as a public
                                               asset

  `client/src/api.js`                          Frontend API requests

  `client/src/pages/Dashboard.jsx`             Main analytics dashboard

  `client/src/pages/DemoPage.jsx`              Demo page for testing tracking

  `client/src/components/SessionDetails.jsx`   Selected session's event details

  `client/src/components/Heatmap.jsx`          Click heatmap visualization

  `client/src/App.jsx`                         React application composition

  `client/src/main.jsx`                        Frontend entry point

  `client/src/styles.css`                      Global and application styles
  --------------------------------------------------------------------------------

The screenshot also shows `client/dist/tracker.js`. Its role depends on
your build process; the public tracker source is shown separately under
`client/public/tracker.js`.

## Main Backend Files

  -----------------------------------------------------------------------------
  File                                      Responsibility
  ----------------------------------------- -----------------------------------
  `server/src/server.js`                    Starts the server and connects the
                                            application to its runtime
                                            configuration

  `server/src/app.js`                       Configures Express middleware and
                                            mounts routes

  `server/src/routes/analytics.js`          Analytics API route handlers

  `server/src/models/Event.js`              MongoDB event schema/model

  `server/src/middleware/errorHandler.js`   Centralized error handling
  -----------------------------------------------------------------------------

## API Endpoints

The API routes described for the application use `/api` as their base
path when the analytics router is mounted at `/api`.

  -----------------------------------------------------------------------------------
  Method                  Endpoint                            Purpose
  ----------------------- ----------------------------------- -----------------------
  `POST`                  `/api/events`                       Receive and store an
                                                              event

  `GET`                   `/api/sessions`                     Retrieve session
                                                              summaries and event
                                                              counts

  `GET`                   `/api/sessions/:sessionId/events`   Retrieve events for a
                                                              specific session

  `GET`                   `/api/pages`                        Retrieve page
                                                              information used by the
                                                              dashboard

  `GET`                   `/api/heatmap`                      Retrieve click data for
                                                              heatmap visualization

  `GET`                   `/api/health`                       Check API health

  `DELETE`                `/api/events/reset`                 Optional event reset
                                                              route, if implemented
  -----------------------------------------------------------------------------------

Confirm the exact route paths, query parameters, and response formats in
`server/src/routes/analytics.js`. The reset endpoint should only be
listed as available if it exists in your current code.

## Event Data

Each stored event is expected to represent an interaction. Depending on
the exact schema in `server/src/models/Event.js`, event data includes:

-   `session_id` --- identifier used to group a visitor's events.
-   Event type --- for example, `page_view` or `click`.
-   Page URL --- the page where the interaction occurred.
-   Timestamp --- when the interaction occurred.
-   Click coordinates --- the click's horizontal and vertical position,
    for click events.

Keep the property names and coordinate system consistent between
`client/public/tracker.js`, the event model, and the heatmap component.

## Testing Checklist

-   [ ] Start MongoDB.
-   [ ] Start the backend and verify that the health endpoint responds.
-   [ ] Start the frontend.
-   [ ] Open the demo page and verify that a page view is recorded.
-   [ ] Click the demo page and verify that click events and coordinates
    are stored.
-   [ ] Confirm that the session appears in the dashboard.
-   [ ] Select a session and inspect its event history.
-   [ ] Select a page in the heatmap view and verify that click
    positions appear.

## Assumptions and Trade-offs

-   **Session persistence:** If the tracker stores its session ID in
    local storage, that identifier may persist across browser restarts.
    A true time-limited session requires additional expiration logic.
-   **Click coordinates:** Heatmap accuracy depends on how coordinates
    are recorded. Viewport-relative coordinates can shift with
    scrolling, resizing, and different screen dimensions unless the
    tracker and visualization account for those factors.
-   **Scope:** The project focuses on basic page views, clicks, session
    summaries, user journeys, and click visualization rather than a full
    commercial analytics platform.
-   **Validation:** Incoming event payloads should be validated before
    being saved.
-   **Privacy:** Avoid collecting sensitive personal information and
    provide appropriate notice and consent where required.
-   **Reset behavior:** Deleting all event records is destructive. If a
    reset endpoint is enabled, protect it with authorization before
    deployment.
-   **Deployment:** Hosting is optional. For a public deployment,
    configure environment variables, CORS, database permissions, and
    secrets securely.

## Security Recommendations

Before deploying publicly:

-   Never commit `.env` files, credentials, or database secrets.
-   Restrict CORS to trusted frontend origins.
-   Validate event payloads and set sensible request-size limits.
-   Add rate limiting to event ingestion if appropriate.
-   Protect destructive or administrative endpoints.
-   Consider event retention and privacy requirements.

## Future Improvements

-   Add date-range filtering and session search.
-   Add session duration and page-level summaries.
-   Improve heatmap coordinate normalization.
-   Add authentication for dashboard and administrative features.
-   Add automated API and component tests.
-   Deploy the frontend and backend with environment-specific
    configuration.

## License

No license is shown in the provided folder structure. Add a `LICENSE`
file and update this section if you intend to publish the project for
reuse.

------------------------------------------------------------------------

Built with the MERN stack to explore visitor interactions, session
journeys, and click behavior.
