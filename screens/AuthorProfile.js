import React, { useState } from "react";

// Author Profile Component
const AuthorProfile = () => {
  const [blogs, setBlogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({
    name: "Jenil Shah",
    tagline: "Graduate Student | Data Enthusiast | Problem Solver",
    bio: "I am a graduate student in MSCS at California State University, Los Angeles. My passion lies in Data Science, Machine Learning, and creating innovative solutions to complex problems. With a focus on predictive modeling and data-driven insights, I aim to empower businesses and communities through technology.",
    skills: ["Python", "Machine Learning", "Data Analysis", "React", "SQL"],
    contact: {
      email: "jenil.shah@example.com",
      linkedin: "https://linkedin.com/in/jenil-shah",
      github: "https://github.com/jenilshah",
      twitter: "https://twitter.com/jenil_shah",
    },
    achievements: [
      "Data Science Scholarship - 2023",
      "Best Data Analyst Award - 2022",
    ],
    upcomingEvents: [
      "Machine Learning Workshop - Dec 2024",
      "Data Science Conference - Feb 2025",
    ],
  });

  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle editing mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Function to handle information change
  const handleInputChange = (e, field) => {
    setAuthorInfo({
      ...authorInfo,
      [field]: e.target.value,
    });
  };

  // Function to add new blog
  const handleAddBlog = () => {
    const newBlog = prompt("Enter Blog Title:");
    if (newBlog) setBlogs([...blogs, newBlog]);
  };

  // Function to add new article
  const handleAddArticle = () => {
    const newArticle = prompt("Enter Article Title:");
    if (newArticle) setArticles([...articles, newArticle]);
  };

  // CSS styling
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "900px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      color: "#333",
      position: "relative", // for positioning the back button inside the container
    },
    card: {
      display: "flex",
      alignItems: "center",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #e0e0e0",
    },
    photoSection: {
      marginRight: "20px",
    },
    authorPhoto: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      border: "3px solid #0077ff",
    },
    infoSection: {
      flex: 1,
    },
    heading: {
      color: "#333",
      fontSize: "2rem",
      marginBottom: "0.5rem",
    },
    tagline: {
      fontStyle: "italic",
      color: "#0077ff",
      marginBottom: "1rem",
    },
    bio: {
      color: "#555",
      marginBottom: "1rem",
      lineHeight: "1.6",
    },
    skills: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      marginBottom: "1rem",
    },
    skill: {
      padding: "0.5rem 1rem",
      backgroundColor: "transparent",
      border: "1px solid #0077ff",
      color: "#0077ff",
      borderRadius: "5px",
    },
    contactLinks: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    button: {
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
      fontSize: "1rem",
    },
    greyButton: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    greenButton: {
      backgroundColor: "#28a745",
      color: "white",
    },
    yellowButton: {
      backgroundColor: "#f39c12",
      color: "white",
    },
    blogArticleButtons: {
      display: "flex",
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },
    editProfileButton: {
      marginTop: "1rem",
    },
    achievementsList: {
      listStyleType: "disc",
      paddingLeft: "1.5rem",
      marginBottom: "2rem",
    },
    eventsList: {
      listStyleType: "circle",
      paddingLeft: "1.5rem",
      marginBottom: "2rem",
    },
    sectionHeader: {
      color: "#333",
      marginBottom: "0.5rem",
      fontSize: "1.5rem",
    },
    recentPosts: {
      marginTop: "1rem",
    },
    inputField: {
      padding: "0.75rem",
      margin: "0.5rem 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "100%",
      fontSize: "1rem",
    },
    backButton: {
      position: "absolute",
      top: "20px",
      left: "20px",
      padding: "0.75rem 1rem",
      backgroundColor: "transparent",
      color: "black", // Black color for the arrow
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button style={styles.backButton}>←</button>

      {/* Profile Card */}
      <div style={styles.card}>
        <div style={styles.photoSection}>
          <img
            src="https://via.placeholder.com/150"
            alt="Author"
            style={styles.authorPhoto}
          />
        </div>
        <div style={styles.infoSection}>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={authorInfo.name}
                onChange={(e) => handleInputChange(e, "name")}
                style={styles.inputField}
              />
              <input
                type="text"
                value={authorInfo.tagline}
                onChange={(e) => handleInputChange(e, "tagline")}
                style={styles.inputField}
              />
              <textarea
                value={authorInfo.bio}
                onChange={(e) => handleInputChange(e, "bio")}
                style={styles.inputField}
              />
            </div>
          ) : (
            <div>
              <h1 style={styles.heading}>{authorInfo.name}</h1>
              <p style={styles.tagline}>{authorInfo.tagline}</p>
              <p style={styles.bio}>{authorInfo.bio}</p>
            </div>
          )}
          {/* Skills Section */}
          <div style={styles.skills}>
            {authorInfo.skills.map((skill, index) => (
              <span key={index} style={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
          {/* Contact Section */}
          <div style={styles.contactLinks}>
            <a
              href={`mailto:${authorInfo.contact.email}`}
              style={{ ...styles.button, ...styles.greyButton }}
            >
              Email
            </a>
            <a
              href={authorInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.button, ...styles.greyButton }}
            >
              LinkedIn
            </a>
            <a
              href={authorInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.button, ...styles.greyButton }}
            >
              GitHub
            </a>
            <a
              href={authorInfo.contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.button, ...styles.greyButton }}
            >
              Twitter
            </a>
          </div>
          {/* Add Blog & Add Article Buttons */}
          <div style={styles.blogArticleButtons}>
            <button
              style={{ ...styles.button, ...styles.greenButton }}
              onClick={handleAddBlog}
            >
              Add Blog
            </button>
            <button
              style={{ ...styles.button, ...styles.greenButton }}
              onClick={handleAddArticle}
            >
              Add Article
            </button>
          </div>
          {/* Edit Profile Button */}
          <button
            style={{ ...styles.button, ...styles.yellowButton, ...styles.editProfileButton }}
            onClick={handleEditClick}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h2 style={styles.sectionHeader}>Achievements</h2>
        <ul style={styles.achievementsList}>
          {authorInfo.achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h2 style={styles.sectionHeader}>Upcoming Events</h2>
        <ul style={styles.eventsList}>
          {authorInfo.upcomingEvents.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>

      {/* Recent Blog & Articles */}
      <div style={styles.recentPosts}>
        <h2 style={styles.sectionHeader}>Recent Posts</h2>
        <div>
          <h3>Blogs</h3>
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <p key={index}>{blog}</p>
            ))
          ) : (
            <p>No blogs yet.</p>
          )}
        </div>
        <div>
          <h3>Articles</h3>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <p key={index}>{article}</p>
            ))
          ) : (
            <p>No articles yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
