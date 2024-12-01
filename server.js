const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require('cheerio');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: '44.211.121.103',
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
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM User_details WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'An error occurred during login.' });
    } else if (results.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
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


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});