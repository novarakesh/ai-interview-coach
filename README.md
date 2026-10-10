# NovaCoach AI — AI Voice Interview Coach

> **Production-Grade MERN Stack Application powered by Google Gemini 2.5 and Murf AI Speech Synthesis.**  
> Built for final-year B.Tech Computer Science capstone presentation and professional portfolio.

---

## 🌟 Executive Summary

**NovaCoach AI** is an intelligent, conversational interview preparation platform designed to simulate realistic technical and behavioral hiring rounds. Combining **Google Gemini 2.5 Flash** for dynamic contextual question generation and multi-dimensional answer scoring with **Murf AI (FALCON streaming)** for ultra-realistic spoken audio questions, candidates experience interactive mock interviews with speech-to-text voice answering or typed responses.

All sessions, evaluations, progress metrics, and customized preferences persist in **MongoDB Atlas** with JWT authentication and secure session isolation.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React + Vite Frontend                   │
│   (Plain CSS Design System, Web Speech API, HTML5 Audio)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / Audio Stream
┌──────────────────────────────▼──────────────────────────────┐
│                    Node.js Express Backend                  │
│       (JWT Auth, Rate Limiting, Helmet, Cookie Parser)       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       ┌───────▼────────┐             ┌───────▼────────┐
       │ Google Gemini  │             │    Murf AI     │
       │ 2.5 Flash API  │             │ FALCON TTS API │
       │ (Question Gen, │             │  (Real-Time    │
       │  Multi-Metric  │             │ Audio Streams) │
       │   Evaluation)  │             └────────────────┘
       └────────────────┘                     ▲
               │                              │
       ┌───────▼──────────────────────────────┴────────┐
       │              MongoDB Atlas Cloud              │
       │   (Users, Sessions, Transcripts, Analytics)   │
       └───────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Realistic AI Voice Synthesis (Murf AI)**:
   - High-fidelity streaming audio questions via Murf's global `FALCON` speech engine.
   - Configurable voice personalities including *Namrita* (Professional Indian English), *Marcus* (US English Male), and *Alicia* (US English Female).
   - Custom audio player with play/pause, replay, seek progress, and live avatar audio visualizer bars.

2. **Google Gemini 2.5 Multi-Metric Answer Scoring**:
   - Evaluates candidate answers across 5 dimensions on a 0–100 scale:
     - **Overall Score**
     - **Relevance** (directness to question prompt)
     - **Correctness** (technical precision and conceptual accuracy)
     - **Clarity** (structure, conciseness, and articulation)
     - **Completeness** (coverage of trade-offs, edge cases, and architectural depth)
   - Generates granular **Key Strengths**, **Missing Concepts**, and **Exemplar Model Answers**.

3. **Dual Input (Speech Recognition & Typed Editor)**:
   - Hands-free voice answering with real-time speech-to-text transcription via the Web Speech API.
   - Immediate editable text fallback for code snippets, bullet points, or unsupported browsers.

4. **Dynamic Context-Aware Interview Lifecycle**:
   - Progressive difficulty and role specialization: *MERN Stack Developer*, *Frontend Developer*, *Java Developer*, *Python Developer*, *Data Analyst*, and *HR Interview*.
   - Question flow adapts dynamically based on previously asked questions and previous candidate answers.

5. **Personalized Analytics & Performance Dashboard**:
   - Computed directly from real MongoDB Atlas session records.
   - Score trends over time, identified top strengths vs. growth focus areas, and automated next drill recommendations.

6. **Comprehensive Final Performance Report**:
   - Overall score circular gauge with animated fill.
   - Question-by-question accordion breakdown comparing candidate responses with AI model answers.
   - Macro strengths, weaknesses, and a personalized study roadmap from a hiring manager perspective.
   - Printable PDF-friendly layout.

---

## 📂 Project Structure

```text
AI-INTERVIEW-COACH/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.jsx          # Murf speech player & visualizer
│   │   │   ├── Button.jsx               # Reusable styled button variants
│   │   │   ├── ConfirmationModal.jsx    # Modal dialog for exit/delete actions
│   │   │   ├── EmptyState.jsx           # Polished empty view for new accounts
│   │   │   ├── ErrorMessage.jsx         # Alert banner with retry
│   │   │   ├── Input.jsx                # Form input with floating icons
│   │   │   ├── InterviewCard.jsx        # History & dashboard session card
│   │   │   ├── LoadingSpinner.jsx       # Glowing dual-ring spinner
│   │   │   ├── MicrophoneControls.jsx   # Speech recognition recorder
│   │   │   ├── Navbar.jsx               # Sticky navbar with profile dropdown
│   │   │   ├── ProgressIndicator.jsx    # Step progress indicator
│   │   │   ├── ProtectedRoute.jsx       # Route guard wrapper
│   │   │   ├── QuestionPanel.jsx        # Question card with AI avatar
│   │   │   ├── ScoreCard.jsx            # Circular score gauge & sub-scores
│   │   │   ├── Select.jsx               # Dropdown select control
│   │   │   ├── Sidebar.jsx              # App layout navigation sidebar
│   │   │   ├── StatCard.jsx             # Metric card for dashboard
│   │   │   └── ToastNotification.jsx    # Floating toast system
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # User state, JWT persistence, login/logout
│   │   │   └── ToastContext.jsx         # Toast message emitter
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # MongoDB-backed analytics & recent drills
│   │   │   ├── InterviewHistory.jsx     # Filterable list of all past sessions
│   │   │   ├── InterviewResults.jsx     # Full report & exemplar model answers
│   │   │   ├── InterviewRoom.jsx        # Interactive live room (Voice + Gemini)
│   │   │   ├── InterviewSetup.jsx       # 4-step interview configurator
│   │   │   ├── Landing.jsx              # Hero, features, preview & demo
│   │   │   ├── Login.jsx                # User login with quick demo fill
│   │   │   ├── Profile.jsx              # Preferences & default role settings
│   │   │   └── Register.jsx             # User registration
│   │   ├── services/
│   │   │   ├── api.js                   # Fetch API wrapper with JWT headers
│   │   │   ├── authService.js           # Auth endpoint calls
│   │   │   ├── interviewService.js      # Interview session endpoint calls
│   │   │   ├── speechRecognition.js     # Web Speech API wrapper
│   │   │   └── speechService.js         # Murf TTS audio streaming client
│   │   ├── styles/
│   │   │   ├── components.css           # Component layouts & animations
│   │   │   ├── global.css               # Global layout, glassmorphism, fonts
│   │   │   └── variables.css            # Dark palette tokens & accents
│   │   ├── App.jsx                      # App router & layout routes
│   │   └── main.jsx                     # Vite root mounting
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── db.js                        # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js            # Registration, login, profile
│   │   ├── dashboardController.js       # Real stats & score trend computations
│   │   ├── interviewController.js       # Lifecycle (create, answer, next, finish)
│   │   └── speechController.js          # Murf streaming TTS endpoint
│   ├── middleware/
│   │   ├── auth.js                      # JWT verification & session ownership
│   │   ├── errorHandler.js              # Centralized JSON error handler
│   │   └── rateLimiter.js               # Rate limiting for auth, AI, speech
│   ├── models/
│   │   ├── Interview.js                 # Interview, Questions, Answers, Evals schema
│   │   └── User.js                      # User schema with bcrypt & preferences
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── speechRoutes.js
│   ├── services/
│   │   ├── aiService.js                 # Gemini 2.5 question & evaluation engine
│   │   └── murfService.js               # Murf AI FALCON streaming client
│   ├── .env.example
│   ├── package.json
│   └── server.js                        # Express server entry point
├── .gitignore
└── README.md
```

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with Vite 6
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System (no Tailwind / Bootstrap) with dark glassmorphic theme
- **Speech Input**: Web Speech API (`SpeechRecognition`)
- **Audio Output**: HTML5 Audio API with Murf TTS MP3 streaming

### Backend
- **Runtime**: Node.js v22 (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Security**: Helmet, CORS, Express Rate Limit, Cookie Parser

### AI & Speech Providers
- **Google Gemini 2.5 Flash**: Dynamic question formulation, 5-dimension answer grading, missing concept extraction, and final synthesis.
- **Murf AI (FALCON streaming)**: Spoken voice synthesis with sub-second streaming audio.

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai_interview_coach?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
MURF_API_KEY=your_murf_api_key
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash
```

### Frontend (`client/.env.example`)
```dotenv
VITE_APP_TITLE=NovaCoach AI
```

---

## 🏁 Quickstart & Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas cluster connection string
- Google Gemini API key
- Murf AI API key

### 1. Backend Setup
```bash
cd server
npm install
npm run dev # or node server.js
```
*The server will start at `http://localhost:5000` with MongoDB connected.*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*The client will start at `http://localhost:5173`.*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT
- `GET /api/auth/me` — Fetch current user profile
- `PUT /api/auth/profile` — Update name & interview preferences
- `POST /api/auth/logout` — Clear session

### Interviews
- `POST /api/interviews` — Initialize interview & generate Question 1 with Gemini
- `GET /api/interviews` — List authenticated user's interviews (supports `?role=` & `?interviewType=`)
- `GET /api/interviews/:id` — Retrieve interview session & transcripts
- `DELETE /api/interviews/:id` — Delete interview session
- `POST /api/interviews/:id/answer` — Submit answer & receive multi-metric Gemini evaluation
- `POST /api/interviews/:id/next-question` — Dynamically generate next question
- `POST /api/interviews/:id/finish` — Finalize session and synthesize hiring manager report

### Murf Speech Synthesis
- `POST /api/speech/generate` — Streams MP3 audio bytes for question text
- `GET /api/speech/voices` — List supported Murf Falcon voices

### Analytics Dashboard
- `GET /api/dashboard/stats` — Real-time metrics, score trends, and strongest/weakest topics computed from MongoDB

---

## 🧪 Verification & Test Results

The entire MERN stack application has been validated with end-to-end integration tests:

| Test Scenario | Status | Details |
|---|---|---|
| **Health Check (`/api/health`)** | ✅ PASSED | Server healthy, Gemini 2.5 Flash & Murf TTS active |
| **Authentication & Password Hashing** | ✅ PASSED | bcrypt hashing, JWT issuance & route protection verified |
| **User Profile & Preferences** | ✅ PASSED | Real-time persistence of role, voice, and difficulty settings |
| **Dynamic Question Generation** | ✅ PASSED | Contextual questions generated via Gemini 2.5 Flash |
| **Murf AI Audio Streaming** | ✅ PASSED | 98+ KB binary MP3 stream generated (`FALCON` engine) |
| **Answer Scoring & Evaluation** | ✅ PASSED | 5-dimension evaluation (Relevance, Correctness, Clarity, Completeness) |
| **Next Question Flow** | ✅ PASSED | Context-aware follow-up question generation |
| **Final Synthesis Report** | ✅ PASSED | Executive feedback, macro strengths, and study roadmap |
| **MongoDB Aggregations** | ✅ PASSED | Real dashboard metrics & trends computed from database |
| **Frontend Production Bundle** | ✅ PASSED | Vite build passed with 0 errors |

---

## 📄 License

This project was developed for final-year engineering assessment and developer portfolio purposes.
