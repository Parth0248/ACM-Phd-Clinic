## PhD Clinic Portal

**Overview**

The PhD Clinic Portal is a web-based matchmaking platform designed for the ACM India PhD Clinic program. It facilitates one-on-one mentorship sessions by pairing PhD students with expert mentors based on research interests. The platform streamlines the entire process, including:

* Profile creation
* Application submission
* Mentor-mentee pairing

Additionally, it sends email notifications with Google Meet links to participants.

**Features**

* **Profile Creation:** Students create profiles with details like personal information, social media handles, and ACM membership status.
* **Mentorship Application:** Users submit applications specifying their research problem, feedback requirements, and preferred mentor.
* **Automated Mentor Matching:** Backend logic matches students and mentors based on their research interests.
* **Email Notifications:** Upon successful application submission, Google Meet links are sent to students, mentors, and program leads.
* **Responsive Design:** Built with React and Material-UI for accessibility and user-friendliness.

**Technologies Used**

* Frontend: React, Material-UI
* Backend: Node.js, Express.js
* Email Integration: Nodemailer
* Hosting:
    * Backend: Render
    * Frontend: GitHub Pages

**Deployment Instructions**

**Backend on Render**

**Prepare Backend:**

1. Add a Procfile with `web: npm start`.
2. Ensure the server listens on `process.env.PORT`.

**Deploy:**

1. Push backend code to a GitHub repository.
2. Connect the repository to a new Render Web Service.
3. Set the Build Command to `npm install` and Start Command to `npm start`.

**Environment Variables:**

* Add necessary environment variables (e.g., email credentials) in Render settings.

**Frontend on GitHub Pages**

**Prepare Frontend:**

1. Add a `homepage` field in `package.json`: `"homepage": "https://<username>.github.io/<repo>"`
2. Install `gh-pages`: `npm install gh-pages --save-dev`

**Deploy:**

1. Build the React app: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`

**Axios Configuration:**

* Update Axios `baseURL` in the frontend to point to the Render backend.

## Contributing

*   Fork the repository.
*   Create a new branch for your feature.
*   Commit your changes.
*   Submit a pull request.

## License

This project is licensed under the MIT License.
