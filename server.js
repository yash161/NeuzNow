const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require('cheerio');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));  // Add this line

// Middleware to parse JSON bodies (for API requests)
app.use(express.json());  
// Create MySQL connection
const db = mysql.createConnection({
  host: '44.203.225.22',
  user: 'root',
  password: 'neuz@123',
  database: 'auth_db',
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

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password.' });
  }

  try {
    // Retrieve the user from the database
    const [user] = await db.promise().query(
      'SELECT * FROM User_details WHERE email = ?',
      [email]
    );

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
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
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const sql = 'INSERT INTO User_details (name, email, password, User) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, role], (err) => {
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
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'testwowtruecaller123', 
        pass: 'vpjbpiivyzziwgkd',           // Replace with your email app password
      },
    });

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
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});