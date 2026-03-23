# Lisa Interviewer — Node.js Backend

The core backend service for the Lisa AI Interview platform. Handles authentication, interview management, AI-powered resume analysis, and answer evaluation using Google Gemini.

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **AI:** Google Gemini 2.5 Flash (`@google/generative-ai`)
- **Auth:** JWT + bcrypt
- **Deployment:** Vercel (Serverless Functions)

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Authenticate & get JWT |
| `POST` | `/ai/getSkills` | Extract skills from resume text via Gemini |
| `POST` | `/ai/checkAnswers` | Evaluate interview answers via Gemini |
| `POST` | `/iv/getQuestions` | Get interview questions for a skill set |
| `POST` | `/iv/uploadResponses` | Save candidate responses |
| `GET`  | `/iv/getIV` | Retrieve interview data |
| `GET`  | `/admin/reports` | Admin: get all candidate reports |
| `GET`  | `/admin/stats` | Admin: get platform statistics |

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in: MONGO_URL, GEMINI_API_KEY

# Run locally
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `CORS_ORIGIN` | Allowed frontend origin URL |

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects `vercel.json` config
