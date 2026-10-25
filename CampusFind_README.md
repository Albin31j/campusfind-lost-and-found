# CampusFind --- College Lost and Found Portal

A web application for viewing and submitting college lost-and-found
reports.

## Live deployment

-   Frontend: https://campusfind-lost-and-found-xi.vercel.app/
-   Backend health:
    https://campusfind-lost-and-found.onrender.com/api/health
-   Items API: https://campusfind-lost-and-found.onrender.com/api/items

## Technology stack

-   React + Vite (`client`)
-   Node.js + Express (`server`)
-   MongoDB Atlas + Mongoose
-   Vercel frontend hosting; Render backend hosting

## Local setup

1.  Install Node.js and npm.

2.  Configure `server/.env`:

    ``` dotenv
    PORT=5000
    MONGODB_URI=your_mongodb_atlas_connection_string
    CLIENT_ORIGIN=http://localhost:5173
    ```

3.  Configure `client/.env`:

    ``` dotenv
    VITE_API_URL=http://localhost:5000/api
    ```

4.  In separate terminals, install dependencies and run the scripts from
    each package directory:

    ``` powershell
    cd server
    npm.cmd install
    npm.cmd run dev
    ```

    ``` powershell
    cd client
    npm.cmd install
    npm.cmd run dev
    ```

5.  Open the Vite URL printed in the terminal, usually
    `http://localhost:5173`.

## API

  -----------------------------------------------------------------------
  Method                  Endpoint                Purpose
  ----------------------- ----------------------- -----------------------
  GET                     `/api/health`           API health check

  GET                     `/api/items`            Retrieve reports

  POST                    `/api/items`            Create a report; body
                                                  must match current
                                                  route/model validation
  -----------------------------------------------------------------------

Production API base URL:
`https://campusfind-lost-and-found.onrender.com/api`

## Production environment variables

Render: - `MONGODB_URI`: MongoDB Atlas connection string. -
`CLIENT_ORIGIN`: `https://campusfind-lost-and-found-xi.vercel.app` (no
trailing slash). - `NODE_ENV`: `production` if used by the app. -
`PORT`: generally provided by Render.

Vercel: - `VITE_API_URL`:
`https://campusfind-lost-and-found.onrender.com/api`

Redeploy after changing environment variables. Vite variables are read
during the frontend build.

## Troubleshooting

-   **CORS:** `CLIENT_ORIGIN` must exactly match the browser origin and
    have no trailing slash.
-   **Frontend cannot connect:** check `/api/health`, `VITE_API_URL`,
    browser DevTools Console/Network, and Render logs.
-   **Database error:** verify Atlas credentials and network access.
    Never publish secrets.

## Security checklist

-   [ ] `.env` files are excluded from Git.
-   [ ] No credentials are committed to GitHub.
-   [ ] Rotate database credentials if they were exposed.
-   [ ] Validate report data on the server.
-   [ ] Handle contact details carefully.

## Verification note

The production health and items endpoints were tested, and the CORS
issue caused by a trailing slash was fixed. Retest report submission and
persistence in production before marking those tests as passed.

## Possible future improvements

Authentication, admin moderation, search/filtering, image upload, claim
verification, notifications, pagination, and automated tests. These are
future work unless already implemented.
