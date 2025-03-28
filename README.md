# SentimToot Client

This is the frontend for the SentimToot project, a sentiment analysis platform integrated with Mastodon. The client is built using **React**, **TypeScript**, and **Mantine UI**, and it is deployed on [Netlify](https://www.netlify.com/).

## Deployment

The frontend is live and accessible at:

**Live URL:** [https://sentimtoot.netlify.app/](https://sentimtoot.netlify.app/)

## Technology Stack

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript for type safety.
- **Mantine UI**: Component library for building responsive and accessible UIs.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests to the backend.
- **Netlify**: Hosting platform for deploying the frontend.

## Features

- User authentication (Sign Up, Sign In, Forgot Password).
- Integration with Mastodon for posting and fetching toots.
- Sentiment analysis of Mastodon posts and trends.
- Visualization of sentiment distribution using pie charts.
- User activity history and management.
- Responsive design for seamless usage across devices.

## Pages and Routes

| Route               | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `/`                 | Home page for searching Mastodon posts by keyword and analyzing sentiment. |
| `/signup`           | User registration page.                                                    |
| `/signin`           | User login page.                                                           |
| `/forgot-password`  | Page for resetting user password.                                          |
| `/profile`          | User profile page for managing Mastodon token and account details.         |
| `/post-toot`        | Page for posting new toots to Mastodon.                                    |
| `/trends`           | Analyze Mastodon trends and their sentiment distribution.                 |
| `/history`          | View and manage the user's search history.                                |
| `/postedtoots`      | View, edit, and delete the user's posted toots.                            |
| `/about`            | About page introducing the development team.                              |

## GitHub Repository

The source code for the frontend is available on GitHub:

[https://github.com/IH-HK-2025/SentimToot-client](https://github.com/IH-HK-2025/SentimToot-client)

## Running Locally

To run the frontend locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/IH-HK-2025/SentimToot-client.git
   cd SentimToot-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables in a `.env` file:
   ```env
   VITE_API_URL=https://sentimtoot-server.onrender.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The application will be available at `http://localhost:5173`.

## Notes

- Ensure the backend server is running and accessible at the specified `VITE_API_URL`.
- The application requires a valid Mastodon token for posting and fetching toots.

For any issues or questions, feel free to open an issue on the GitHub repository.
