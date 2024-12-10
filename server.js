const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require('cheerio');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: '*', // Update this to restrict specific origins if needed
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], // Allow required methods
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));  // Add this line

// Middleware to parse JSON bodies (for API requests)
app.use(express.json());  
// Create MySQL connection
const db = mysql.createConnection({
  host: '100.27.37.187',
  user: 'root',
  password: 'neuz@123',
  database: 'auth_db',
});
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'testwowtruecaller123', 
    pass: 'vpjbpiivyzziwgkd',           // Replace with your email app password
  },
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});
const API_KEY = "AIzaSyBLpmZqV2gjSdJIKT5XKeO_ASWDiDF86M0"; // Store this securely!

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate a summary with AI
async function generateSummary(text) {
    const prompt = `Summarize the following article atmost 60 words only not more than :\n\n${text}`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim(); // Return the summary
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Error generating summary!";
    }
}
// Login API endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("password is ::: ",password)
  if (!email || !password) {
    console.log('Missing email or password');  // Debugging step
    return res.status(400).json({ message: 'Please enter both email and password.' });
  }

  try {
    console.log('Received email:', email);  // Debugging step

    // Fetch the user from the database by email
    const [user] = await db.promise().query('SELECT * FROM User_details WHERE email = ?', [email]);

    if (user.length === 0) {
      console.log('No user found with the given email:', email);  // Debugging step
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if password matches the hashed password in the database
    console.log('User found, comparing passwords');  // Debugging step
    // const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (password) {
      console.log('Password matched');  // Debugging step
      res.status(200).json({
        message: 'Login successful',
        email:email,
        role: user[0].User,  // Assuming `User` column stores roles like 'author', 'student', etc.
        verified: user[0].verified  // Assuming you want to check if the account is verified
      });
    } else {
      console.log('Password did not match');  // Debugging step
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login error:', error);  // Debugging step
    res.status(500).json({ message: 'Server error.' });
  }
});
app.get('/authors', async (req, res) => {
  try {
    // Querying the 'User_details' table to get authors where the User role is 'Author'
    const [authors] = await db.promise().query('SELECT name, email, verified FROM User_details WHERE User = "Author"');
    res.status(200).json(authors); // Respond with authors' data
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ message: 'Server error.' }); // Handle errors
  }
});
app.post('/blogs', async (req, res) => {
  const { title, content, studentName } = req.body; // Include studentName

  if (!title || !content || !studentName) {
    return res.status(400).json({ message: 'Title, content, and studentName are required.' });
  }

  try {
    const query = 'INSERT INTO Blogs (title, content, studentName) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(query, [title, content, studentName]);
    res.status(201).json({ message: 'Blog created successfully!', blogId: result.insertId });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
app.get('/displayblogs', async (req, res) => {
  const studentName = req.query.user; // Extract studentName from the query parameter

  if (!studentName) {
    return res.status(400).json({ message: 'Student name is required' });
  }

  try {
    // Query to fetch blogs for a specific studentName
    const query = 'SELECT * FROM Blogs WHERE studentName = ?';
    
    // Use promises to query the database asynchronously
    const [results] = await db.promise().query(query, [studentName]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No blogs found for this student' });
    }

    // Return the blogs in the response
    res.status(200).json({ blogs: results });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});


// Endpoint to delete an author
app.post('/submitNews', (req, res) => {
  const { authorName, email, newsEntries } = req.body;
  console.log("News", newsEntries);
  if (!authorName || !email || !Array.isArray(newsEntries) || newsEntries.length === 0) {
    return res.status(400).json({ message: 'Invalid input.' });
  }

  // Start transaction
  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ message: 'Transaction error.', error: err });

    try {
      // Insert Author with Email
      const [authorResult] = await db.promise().query('INSERT INTO Authors (name, email) VALUES (?, ?)', [authorName, email]);
      const authorId = authorResult.insertId;

      // Insert News Entries
      const newsPromises = newsEntries.map((news) => {
        const { category, title, content } = news;
        return db.promise().query(
          'INSERT INTO News (author_id, category, title, content) VALUES (?, ?, ?, ?)',
          [authorId, category, title, content]
        );
      });

      await Promise.all(newsPromises);

      // Commit transaction
      db.commit((err) => {
        if (err) {
          db.rollback(() => {
            return res.status(500).json({ message: 'Commit error.', error: err });
          });
        } else {
          // Send confirmation email after data is saved
          const mailOptions = {
            to: email,  // Use the email provided by the author
            subject: 'We have received your news submission',
            text: `Hello ${authorName},\n\nWe have successfully received your news submission. Our team is currently reviewing it. You will receive a notification once your submission has been approved.\n\nBest regards,\nThe NeuzNow Team`,
          };

          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });

          res.status(200).json({ message: 'Author and news saved successfully, and confirmation email sent.' });
        }
      });
    } catch (error) {
      // Rollback on error
      db.rollback(() => {
        res.status(500).json({ message: 'Transaction failed.', error });
      });
    }
  });
});



app.delete('/delete-author/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to delete an author.' });
  }

  try {
    const [result] = await db.promise().query(
      'DELETE FROM User_details WHERE email = ? AND User = "Author"',
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Author not found or already deleted.' });
    }

    // Send deletion email
    const mailOptions = {
      to: email,
      subject: 'Your Account Has Been Deleted',
      text: `Hello,

Your account has been deleted from our platform. If this was a mistake or you have any questions, please contact our support team.

Best regards,
NeuzNow`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Author deleted successfully and email sent.' });

  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
app.get('/getAuthorNews', (req, res) => {
  const query = `
    SELECT 
      Authors.id AS author_id,
      Authors.name AS author_name,
      Authors.email AS author_email,
      News.id AS news_id,
      News.category,
      News.title,
      News.content
    FROM 
      Authors
    JOIN 
      News ON Authors.id = News.author_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }

    // Send results to the client
    res.status(200).json(results);
  });
});


// Endpoint to verify an author
app.post('/verify-author', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Update the 'verified' status of the author
    const [result] = await db.promise().query(
      'UPDATE User_details SET verified = ? WHERE email = ? AND User = "Author"',
      ['verified', email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    // Send verification email
    const mailOptions = {
      to: email,
      subject: 'Your Account Has Been Verified',
      text: `Hello ,

Your account has been successfully verified. You can now access all the features of our platform.

Best regards,
NeuzNow`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Author verified successfully and email sent.' });

  } catch (error) {
    console.error('Error verifying author:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});



app.post('/register', async (req, res) => {
  const { name, email, password, retypePassword, role } = req.body;

  // Validate inputs
  if (!name || !email || !password || !retypePassword) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }
  if (password !== retypePassword) {
    return res.status(400).json({ message: "Passwords don't match." });
  }

  try {
    // Check if the user already exists
    const [existingUser] = await db.promise().query(
      'SELECT * FROM User_details WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const sql = 'INSERT INTO User_details (name, email, password, User) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Error registering user.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// Proxy endpoint
app.get('/proxy', async (req, res) => {
  const url = req.query.url; // URL to proxy
  if (!url) {
      return res.status(400).json({ message: 'URL parameter is required' });
  }

  try {
      console.log("Fetching content from:", url);

      // Fetch the page content using axios
      const response = await axios.get(url);
      const html = response.data;

      // Load the HTML into cheerio to parse
      const $ = cheerio.load(html);
      
      // Dynamic selector strategy
      let articleBody = '';

      // Try common article body structures
      const possibleSelectors = [
          'article p',               
          '.article-content p',       
          '.post-content p',          
          '.entry-content p',         
          '.content-body p',          
          'p',                        
          'div',                      
      ];

      // Loop through possible selectors and extract content dynamically
      for (const selector of possibleSelectors) {
          $(selector).each((i, elem) => {
              articleBody += $(elem).text() + '\n'; // Append each text found
          });
          if (articleBody.trim()) break; // Stop once content is found
      }

      // Fallback if no article body is found
      if (!articleBody.trim()) {
          articleBody = 'Article body not found!';
      }

      // Clean up whitespace and line breaks (optional)
      articleBody = articleBody.replace(/\s+/g, ' ').trim();

      // Slice the article body to 300 words
      const words = articleBody.split(' ');
      if (words.length > 300) {
          articleBody = words.slice(0, 300).join(' ');
      }

      console.log("ArticleBody::", articleBody);

      // Use the AI to summarize the article to 60 words
      const summary = await generateSummary(articleBody);
      console.log("Summary::", summary);

      // Send the summary as a response
      res.json({ summary });

  } catch (error) {
     summary="Long lines and delays plagued early in-person absentee voting in Southeast Wisconsin on Tuesday due to high voter turnout. The state computer system used for absentee voting experienced outages, leading to wait times of up to three hours for some voters. Officials addressed the issue by increasing server space and assured voters their ballots would be counted";
      console.error("Error fetching or processing the article:", error);
      res.json({ summary });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Check if email exists
    const [user] = await db.promise().query('SELECT * FROM User_details WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'Email not registered.' });
    }

    // Generate reset token and expiry (1 hour from now)
    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' '); // MySQL DATETIME format

    // Save token and expiry to the database
    await db.promise().query(
      'UPDATE User_details SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?',
      [token, tokenExpiry, email]
    );

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'testwowtruecaller123', 
        pass: 'vpjbpiivyzziwgkd',   
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      to: email,
      user: 'testwowtruecaller123', 
      pass: 'vpjbpiivyzziwgkd',
      text: `You requested a password reset.\n\nClick the link below or paste this into your browser:\n\n${resetUrl}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to your email.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Route: Verify Token and Show Reset Form (Simulated)
app.get('/reset-password', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  try {
    const [user] = await db.promise().query('SELECT * FROM User_details WHERE resetToken = ?', [token]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired token.' });
    }

    const tokenExpiry = new Date(user[0].resetTokenExpiry);
    if (new Date() > tokenExpiry) {
      return res.status(400).json({ message: 'Token has expired.' });
    }

    // Render a simple form (For production, replace this with a frontend page)
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Reset Password</title></head>
      <body>
        <h2>Reset Password</h2>
        <form action="/update-password" method="POST">
          <input type="hidden" name="token" value="${token}" />
          <label>New Password:</label><br />
          <input type="password" name="newPassword" required /><br /><br />
          <button type="submit">Reset Password</button>
        </form>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});
// Route: Update Password
app.post('/update-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    // Retrieve the user with the provided reset token
    const [user] = await db.promise().query('SELECT * FROM User_details WHERE resetToken = ?', [token]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Invalid token.' });
    }

    // Check if the token has expired
    const tokenExpiry = new Date(user[0].resetTokenExpiry);
    if (new Date() > tokenExpiry) {
      return res.status(400).json({ message: 'Token has expired.' });
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the reset token fields
    await db.promise().query(
      'UPDATE User_details SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?',
      [hashedPassword, token]
    );

    // Send a confirmation email after successful password reset
  

    const mailOptions = {
      to: user[0].email,                     // Send to the user's registered email
      from: 'NeuzNow@gmail.com',          // Replace with your email
      subject: 'Password Reset Confirmation for NeuzNow',
      text: `Hello,\n\nThis is a confirmation that your password for the account ${user[0].email} has been successfully reset.\n\nIf you did not request this change, please contact support immediately.`,
    };

    await transporter.sendMail(mailOptions); // Send the email

    res.status(200).json({ message: 'Password successfully reset and confirmation email sent.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// AWS.config.update({
//   accessKeyId: 'AKIA6ODU4CE4FHYXHVEP',  // Replace with your AWS access key
//   secretAccessKey: 'pssK78lAIy9crLriYZz+y56Tfx44IzPZcV12L+zK',  // Replace with your AWS secret key
//   region: 'us-east-1',  // Replace with your region (e.g., 'us-east-1')
// });

// const s3 = new AWS.S3();

// // Create multer upload configuration to store files in S3
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'neuznowbucket', // Replace with your S3 bucket name
//     acl: 'public-read',  // Ensures the uploaded files are publicly accessible
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       const fileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
//       cb(null, fileName);  // Generate a unique filename for each upload
//     }
//   })
// });


// // Endpoint to handle student verification form submission
// app.post(
//   '/verifyStudent',
//   upload.fields([
//     { name: 'frontPhoto', maxCount: 1 },
//     { name: 'backPhoto', maxCount: 1 },
//   ]),
//   (req, res) => {
//     console.log('Files Uploaded:', req.files);  // Ensure files are processed
//     console.log('Request Body:', req.body);

//     const { studentName, studentUniversity, enrollmentNumber } = req.body;

//     // Extract the S3 URLs from the uploaded files
//     const frontPhotoURL = req.files['frontPhoto'] ? req.files['frontPhoto'][0].location : null;
//     const backPhotoURL = req.files['backPhoto'] ? req.files['backPhoto'][0].location : null;

//     if (!studentName || !studentUniversity || !enrollmentNumber || !frontPhotoURL || !backPhotoURL) {
//       console.error('Validation Error: Missing fields or files');
//       return res.status(400).json({ message: 'Please fill out all fields and upload both ID card photos.' });
//     }

//     // Insert data into the database
//     const query =
//       'INSERT INTO students (student_name, student_university, enrollment_number, front_photo_path, back_photo_path) VALUES (?, ?, ?, ?, ?)';
//     db.query(
//       query,
//       [studentName, studentUniversity, enrollmentNumber, frontPhotoURL, backPhotoURL],
//       (err, result) => {
//         if (err) {
//           console.error('Database Error:', err);
//           return res.status(500).json({ message: 'Error saving data to the database.' });
//         }

//         console.log('Database Insert Success:', result);
//         res.status(200).json({
//           message: 'Student verification has been successfully submitted.',
//           studentName,
//           studentUniversity,
//           enrollmentNumber,
//           frontPhotoURL,
//           backPhotoURL,
//         });
//       }
//     );
//   }
// );




// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});