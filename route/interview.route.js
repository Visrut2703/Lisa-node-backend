// import axios from 'axios';
import express from 'express';
import questionsModel from '../schema/questionsSchema.js';
import responseModel from '../schema/interviewSchema.js';
import authMiddleware from '../middleware/auth.js';

const interviewRouter = express.Router();

const questions = [
    {
        question: "Tell me about yourself",
        videoUrl: "https://res.cloudinary.com/dt16kdo0z/video/upload/v1713675359/videos/gcl5kzpeeaoyurpkmgpd.mp4",
        type: 'basic',
        level: 'Basic'
    },
    {
        question: "What’s the project you have done?",
        videoUrl: "http://res.cloudinary.com/dt16kdo0z/video/upload/v1713673701/videos/fa2cg3xty6hbt9jpchek.mp4",
        type: 'basic',
        level: 'Basic'
    },
    {
        question: "Can you describe your previous projects like what kind of difficulties you have faced in those projects and how did you tackle them what learning did you get from those projects?",
        videoUrl: "https://res.cloudinary.com/dt16kdo0z/video/upload/v1713675359/videos/gcl5kzpeeaoyurpkmgpd.mp4",
        type: 'basic',
        level: 'Basic'
    },
    {
        question: "Do you have any Experience Internship done for the same role?",
        videoUrl: "http://res.cloudinary.com/dt16kdo0z/video/upload/v1713674400/videos/xzvuy6b4v7rvnvliyrrt.mp4",
        type: 'basic',
        level: 'Basic'
    },
    {
        question: "What was your percentage in Last semester?",
        videoUrl: "http://res.cloudinary.com/dt16kdo0z/video/upload/v1713674016/videos/wdkndfsj4cn0xnojj9cp.mp4",
        type: 'basic',
        level: 'Basic'
    },
    {
        question: "Why should we hire you?",
        videoUrl: "https://res.cloudinary.com/dbrtxsu3f/video/upload/v1713673580/mnht9qfthalt4uhfslfx.mp4",
        type: 'basic',
        level: 'Basic'
    },
];

// console.log(questions);


interviewRouter.get('/uploadQuestions', async (req, res) => {
    await questionsModel.insertMany(questions);
    res.send('ok');
});

interviewRouter.get('/getQuestions', authMiddleware, async (req, res) => {
    const data = await questionsModel.find({});
    res.json({ data: data });
});

interviewRouter.post('/uploadResponses', authMiddleware, async (req, res) => {
    const { interviewId, answers } = req.body;
    const data = await responseModel.findOneAndUpdate(
        // Search criteria
        { interviewId },
        // Update to be performed
        { $set: { answers } },
        // Options
        {
            // If set to true, returns the updated document instead of the original one
            new: true,
            // If set to true, creates a new document if no document matches the query
            upsert: true
        }
    );
    console.log(data);
    res.json({ data: data });
});

interviewRouter.post('/saveIV', authMiddleware, async (req, res) => {
    const { interviewId, count, skills } = req.body;
    await responseModel.insertMany([{ interviewId, count, skills, answers: [] }]);
    res.send('ok');
});

interviewRouter.post('/getIV', authMiddleware, async (req, res) => {
    const { interviewId } = req.body;
    const data = await responseModel.find({ interviewId });
    console.log(data);
    res.json({ data: data });
});
export default interviewRouter;