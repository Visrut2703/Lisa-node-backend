import express from 'express';
import questionsModel from '../schema/questionsSchema.js';
import responseModel from '../schema/interviewSchema.js';
import { GoogleGenerativeAI } from '@google/generative-ai'
import authMiddleware from '../middleware/auth.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AIRouter = express.Router();


const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run(textData) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `"${textData}"\n\nHere is the extracted data from a resume of a tech guy. I want to know that in which languages he/she proficient from the languages ['HTML', 'JavaScript', 'C++', 'Python']. Just mention the names of the langauages seprated by comma in single line only.`
    console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
}

//   run();

AIRouter.post('/getSkills', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        console.log(text);
        const ret = await run(text);
        console.log(ret);
        res.json({text: ret});
    } catch (e) {
        console.error('Error in /getSkills:', e.message);
        res.status(500).json({error: e.message});
    }
})

async function evaluateBatch(responses) {
    const formattedResponses = responses.map((res, index) => 
        `Response #${index + 1}:\nQuestion: ${res.question}\nAnswer: ${res.answer}`
    ).join('\n\n---\n\n');

    const prompt = `I am an interviewer. Evaluate the candidate's answers based on a score from 0 to 10 for each.
    
    ${formattedResponses}
    
    Return the scores as a JSON array of numbers only, like this: [score1, score2, ...]. 
    Do not provide any other text. Length of the array must be ${responses.length}.`;

    console.log("Batched Prompt:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Safety check for markdown code blocks
    if (text.startsWith('```json')) {
        text = text.substring(7, text.length - 3);
    } else if (text.startsWith('```')) {
        text = text.substring(3, text.length - 3);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        // Fallback for non-JSON responses (e.g., if AI returns "8, 9, 7")
        const scores = text.match(/\d+/g);
        if (scores) return scores.map(Number);
        throw new Error("AI returned unparseable evaluation result");
    }
}

AIRouter.post('/checkAnswers', authMiddleware, async (req, res) => {
    try {
        const { responses } = req.body;
        if (!responses || responses.length === 0) {
            return res.json({ data: [] });
        }
        console.log("Processing batched answers...");
        const scores = await evaluateBatch(responses);
        res.json({ data: scores });
    } catch (e) {
        console.error('Error in /checkAnswers:', e.message);
        res.status(500).json({ error: e.message });
    }
})


export default AIRouter;
