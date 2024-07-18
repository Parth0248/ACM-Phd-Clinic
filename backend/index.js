const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 5000; ;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to fetch mentors
app.get("/api/mentors", (req, res) => {
  fs.readFile("./data/mentors.json", (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error fetching mentors" });
    } else {
      res.send(JSON.parse(data));
    }
  });
});

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "parthmaradia02@gmail.com", // Replace with your email
    pass: "ygra zccp vsxt nwya", // Replace with your email password or an app-specific password
  },
});

// Endpoint to submit mentorship application
// app.post("/api/mentorship", async (req, res) => {
//   const application = req.body;
//   try {
//     const applications = await readData("./data/applications.json");
//     applications.push(application);
//     await writeData("./data/applications.json", applications);

//     // Match the student with a mentor based on preferences
//     const selectedMentor = application.selectedMentor;
//     const selectedMentorInstitute = application.selectedMentorInstitute;
//     const studentEmail = application.userData.email; // Extract email from userData
//     const studentName = application.userData.name; // Extract name from userData
//     // Prepare email details
//     const mailOptions = {
//       from: "parthmaradia02@gmail.com",
//       to: studentEmail, // POC email recipient
//       subject: "Mentorship Application Submitted",
//       text: `Dear ${studentName},

// You have successfully submitted your mentorship application. You have been paired with ${selectedMentor} from ${selectedMentorInstitute}.

// Here is your Google Meet link: https://meet.google.com/xyz-abc-def

// Best regards,
// PhD Clinic Team
// `,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log("Error sending email:", error);
//         res
//           .status(500)
//           .send({ message: "Application submitted, but error sending email" });
//       } else {
//         console.log("Email sent:", info.response);
//         res.send({
//           message: "Application submitted successfully",
//           mentor: selectedMentor,
//         });
//       }
//     });
//   } catch (err) {
//     res.status(500).send({ message: "Error submitting application" });
//   }
// });

// Endpoint to submit mentorship application
app.post("/api/mentorship", async (req, res) => {
  const application = req.body;
  try {
    const applications = await readData("./data/applications.json");
    applications.push(application);
    await writeData("./data/applications.json", applications);

    // Match the student with a mentor based on preferences
    const selectedMentor = application.selectedMentor;
    const selectedMentorInstitute = application.selectedMentorInstitute;
    const studentEmail = application.userData.email; // Extract email from userData
    const studentName = application.userData.name; // Extract name from userData
    // Prepare email details
    const mailOptions = {
      from: "parthmaradia02@gmail.com",
      to: studentEmail, // POC email recipient
      subject: "Mentorship Application Submitted",
      text: `Dear ${studentName},

You have successfully submitted your mentorship application. You have been paired with ${selectedMentor} from ${selectedMentorInstitute}.

Here is your Google Meet link: https://meet.google.com/xyz-abc-def

Best regards,
PhD Clinic Team
`,
    };

    // Send the email using async/await
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      res.send({
        message: "Application submitted successfully",
        mentor: selectedMentor,
      });
    } catch (error) {
      console.log("Error sending email:", error);
      res.status(500).send({ message: "Application submitted, but error sending email" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error submitting application" });
  }
});

const readData = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const writeData = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Endpoint to get all student profiles
app.get("/api/students", async (req, res) => {
  try {
    const students = await readData("./data/students.json");
    res.send(students);
  } catch (err) {
    res.status(500).send("Error reading student data");
  }
});

// Endpoint to create a new student profile
app.post("/api/students", async (req, res) => {
  const newStudent = req.body;
  try {
    const students = await readData("./data/students.json");
    students.push(newStudent);
    await writeData("./data/students.json", students);
    res.status(201).send("Student profile created");
  } catch (err) {
    res.status(500).send("Error saving student data");
  }
});

// Endpoint to get all mentors
app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = await readData("./data/mentors.json");
    res.send(mentors);
  } catch (err) {
    res.status(500).send("Error reading mentor data");
  }
});

// Endpoint to create a new mentorship application
app.post("/api/mentorship", async (req, res) => {
  const newApplication = req.body;
  try {
    const applications = await readData("./data/applications.json");
    applications.push(newApplication);
    await writeData("./data/applications.json", applications);

    // Match the student with a mentor based on preferences
    const matchedMentor = await matchMentor(newApplication);
    res
      .status(201)
      .send({ message: "Application submitted", mentor: matchedMentor });
  } catch (err) {
    res.status(500).send("Error saving application data");
  }
});

// Endpoint to handle login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const students = await readData("./data/students.json");
    const student = students.find(
      (s) => s.email === email && s.password === password
    );
    if (student) {
      res.send(student);
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    res.status(500).send("Error reading student data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
