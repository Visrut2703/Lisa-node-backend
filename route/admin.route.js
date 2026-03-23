import express from 'express';
import scheduleModel from '../schema/scheduleSchema.js';
import responseModel from '../schema/interviewSchema.js';
import userModel from '../schema/userSchema.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';
import { v4 as uuidv4 } from 'uuid';

const AdminRouter = express.Router();

// Middleware to ensure all routes here are Admin-only
AdminRouter.use(authMiddleware, adminMiddleware);

// Schedule a new interview
AdminRouter.post('/schedule', async (req, res) => {
    try {
        const { candidateEmail, candidateName } = req.body;
        const token = uuidv4(); // Generate a unique token for the candidate
        
        const newSession = new scheduleModel({
            candidateEmail,
            candidateName,
            token,
            status: 'pending'
        });
        
        await newSession.save();
        res.json({ status: true, message: 'Interview scheduled successfully', token });
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

// Get all reports/results
AdminRouter.get('/reports', async (req, res) => {
    try {
        const reports = await responseModel.find({});
        res.json({ status: true, data: reports });
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

// Get dashboard stats
AdminRouter.get('/stats', async (req, res) => {
    try {
        const totalInterviews = await responseModel.countDocuments();
        const pendingSchedules = await scheduleModel.countDocuments({ status: 'pending' });
        const users = await userModel.countDocuments({ role: 'user' });
        
        res.json({ 
            status: true, 
            data: { 
                totalInterviews, 
                pendingSchedules, 
                totalCandidates: users 
            } 
        });
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

export default AdminRouter;
