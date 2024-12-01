const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBC8aNcp-ZIWwg0R1OwCKnr-AbCiqAEI2o"; // Store this securely!

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a story about a magic backpack.";

// Wrap this in an async function
async function generateStory() {
    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
        console.error("Error generating story:", error);
    }
}

// Call the async function
generateStory();
