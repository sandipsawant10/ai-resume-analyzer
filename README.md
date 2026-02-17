# AI Resume Analyzer

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

AI Resume Analyzer is a full stack web app that lets users upload PDF resumes and receive AI-powered analysis, scoring, and improvement suggestions.

## Table of contents

- Overview
- Features
- Tech stack
- Folder structure
- Setup
- Environment variables
- Scripts
- API endpoints
- Deployment
- Screenshots
- License
- Author

## Overview

Upload a resume, extract its text, run AI analysis, and manage your past analyses in a secure dashboard. The app handles authentication with JWT and stores files in Cloudinary while persisting analysis results in MongoDB.

## Features

- Secure user registration and login with JWT
- PDF resume upload with text extraction
- AI-powered analysis with score, skills, and improvements
- Resume history, update, and delete operations

## Tech stack

Frontend:

- React + Vite
- Tailwind CSS
- React Router (state management: none)

Backend:

- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- REST API

Services:

- Cloudinary for file storage
- OpenRouter API for AI analysis

## Folder structure

```
ai-resume-analyzer/
	backend/
		src/
			config/
			controllers/
			db/
			middleware/
			models/
			routes/
			utils/
		app.js
		server.js
	frontend/
		public/
		src/
			assets/
			components/
			pages/
			services/
		index.html
	README.md
```

## Setup

### 1) Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd ai-resume-analyzer
```

### 2) Install dependencies

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

### 3) Configure environment variables

Create a .env file in backend/ and a .env file in frontend/ (examples below).

### 4) Run the app

```bash
cd backend
npm run dev
```

```bash
cd ../frontend
npm run dev
```

The frontend runs on http://localhost:5173 and the API defaults to http://localhost:5000.

## Environment variables

Backend (backend/.env):

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
AI_API_KEY=your_openrouter_api_key
```

Frontend (frontend/.env):

```
VITE_API_URL=http://localhost:5000
```

## Scripts

Backend:

- npm run dev
- npm start
- npm run build

Frontend:

- npm run dev
- npm run build
- npm run preview
- npm run lint

## API endpoints

Base URL: http://localhost:5000

Auth:

- POST /auth/register
- POST /auth/login

Resumes (protected):

- POST /resume/upload
- GET /resume/my
- PUT /resume/my/:id
- DELETE /resume/my/:id

## Deployment

- Frontend: https://ai-resume-analyzer-kohl-one.vercel.app
- Backend: https://ai-resume-analyzer-7dvf.onrender.com/
- Database: Not deployed yet (suggested: MongoDB Atlas)

## Screenshots


![Screenshot 1](![alt text](image.png))
![Screenshot 2](![alt text](image-1.png))
![Screenshot 3](![alt text](image-2.png))



## Author

Sandip Sawant - sandipsawant503@gmail.com
