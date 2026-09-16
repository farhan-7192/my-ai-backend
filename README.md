# AI Web Application — Backend

A Node.js backend for a full-stack AI web application that integrates **Google Gemini 2.5 Flash** with a persistent **PostgreSQL** database.

The backend exposes REST API endpoints for sending prompts to Gemini, storing AI interactions, retrieving conversation history, and monitoring service health.

## Overview

This project was built as the backend component of a full-stack AI application.

The application allows users to send prompts through a React frontend. The backend receives the request, sends it to **Gemini 2.5 Flash**, stores the interaction in PostgreSQL through **Prisma**, and returns the generated response to the frontend.

### Request Flow

```text
React Frontend
      │
      │ POST /api/analyze
      ▼
Node.js + Express
      │
      ├──────────────► Gemini 2.5 Flash
      │                       │
      │                       ▼
      │                  AI Response
      │
      ├──────────────► Prisma
      │                       │
      │                       ▼
      │                 PostgreSQL / RDS
      │
      ▼
React Frontend
```

Conversation history can later be retrieved through the backend and displayed by the frontend.

---

## Features

* Gemini 2.5 Flash API integration
* REST API built with Express
* Persistent AI interaction history
* PostgreSQL database integration
* Prisma ORM
* Health-check endpoint
* CORS support for frontend communication
* Environment-based configuration
* Docker containerization
* Support for local and cloud database connections
* Deployed architecture using AWS EC2 and RDS

---

## Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js                 |
| Framework        | Express.js              |
| AI               | Google Gemini 2.5 Flash |
| Database         | PostgreSQL              |
| ORM              | Prisma                  |
| Database Driver  | `pg`                    |
| API              | REST                    |
| Containerization | Docker                  |
| Cloud            | AWS EC2, AWS RDS        |
| Configuration    | dotenv                  |
| Middleware       | CORS                    |

---

## Project Structure

```text
my-ai-backend/
│
├── prisma/
│   └── schema.prisma
│
├── index.js
├── prisma.config.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── .env
```

### Key Files

**`index.js`**

Main application entry point.

Responsible for:

* Starting the Express server
* Configuring middleware
* Initializing the Gemini client
* Connecting Prisma to PostgreSQL
* Handling API requests
* Saving AI interactions
* Retrieving conversation history

**`prisma/schema.prisma`**

Defines the application's database schema used by Prisma.

**`prisma.config.ts`**

Configures the Prisma schema location, migration directory, and database connection.

**`Dockerfile`**

Defines the container image used to run the backend.

**`docker-compose.yml`**

Provides a convenient way to run the backend as a container and inject environment variables.

---

# API Endpoints

## `GET /api/health`

Checks whether the backend is running.

### Example Response

```json
{
  "status": "ok"
}
```

The frontend uses this endpoint to monitor backend connectivity and measure response latency.

---

## `GET /api/history`

Retrieves previously stored AI interactions from PostgreSQL.

Interactions are returned with the newest records first.

### Example

```http
GET /api/history
```

The endpoint is used by the frontend to populate the application's persistent interaction history.

---

## `POST /api/analyze`

Sends a prompt to Gemini 2.5 Flash and stores the resulting interaction.

### Request

```http
POST /api/analyze
Content-Type: application/json
```

```json
{
  "prompt": "Explain how REST APIs work."
}
```

### Processing Flow

```text
Client Request
      ↓
Validate Prompt
      ↓
Gemini 2.5 Flash
      ↓
Generate Response
      ↓
Save Prompt + Response
      ↓
PostgreSQL via Prisma
      ↓
Return Response
```

### Response

```json
{
  "answer": "REST APIs...",
  "savedId": 123
}
```

The returned `savedId` identifies the stored interaction.

---

# Database

The application uses **PostgreSQL** for persistent storage.

Prisma is used as the application's database access layer.

The backend stores AI interactions containing information such as:

* User prompt
* Generated response
* Creation timestamp

This allows the frontend to retrieve previously generated interactions instead of relying only on in-memory application state.

The database connection is provided through the `DATABASE_URL` environment variable.

---

# Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
```

### Variables

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `GEMINI_API_KEY` | API key used to access Google Gemini |
| `DATABASE_URL`   | PostgreSQL connection string         |

**Do not commit your `.env` file or API keys to GitHub.**

---

# Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/farhan-7192/my-ai-backend.git
cd my-ai-backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_connection_string
```

## 4. Generate the Prisma Client

```bash
npx prisma generate
```

## 5. Start the backend

```bash
node index.js
```

The server runs on:

```text
http://localhost:3001
```

You can verify that the backend is running by opening:

```text
http://localhost:3001/api/health
```

---

# Running with Docker

The backend includes a `Dockerfile` and `docker-compose.yml` for containerized execution.

## Build and start

```bash
docker compose up --build
```

The container exposes port:

```text
3001
```

Environment variables can be supplied through the `.env` file.

The Docker image uses **Node.js 20** and generates the Prisma client during the image build.

---

# Cloud Deployment

The backend was also deployed as part of the application's AWS-based architecture.

```text
                 AWS
┌─────────────────────────────────────┐
│                                     │
│       EC2                           │
│  ┌─────────────────────────────┐    │
│  │ Dockerized Node.js Backend  │    │
│  │                             │    │
│  │ Express + Gemini + Prisma   │    │
│  └──────────────┬──────────────┘    │
│                 │                   │
│                 ▼                   │
│       ┌──────────────────┐          │
│       │      RDS         │          │
│       │   PostgreSQL     │          │
│       └──────────────────┘          │
│                                     │
└─────────────────────────────────────┘
```

The deployed backend is accessed by the React frontend through its REST API.

The application also uses **Amazon S3** as part of the overall AWS implementation.

---

# Architecture

The backend follows a relatively simple layered flow:

### 1. Client

The React frontend sends an HTTP request to the backend.

### 2. Express API

Express receives and validates the request before processing it.

### 3. Gemini

The backend sends the user's prompt to Gemini 2.5 Flash through Google's GenAI SDK.

### 4. Persistence

The generated response and original prompt are stored through Prisma in PostgreSQL.

### 5. Response

The backend returns the generated response and saved interaction ID to the frontend.

This keeps AI interaction, persistence, and frontend presentation separated from each other.

---

# Design Decisions

## PostgreSQL for Persistence

A relational database was used to provide persistent storage for AI interactions.

This allows conversation history to survive application restarts and makes the data accessible independently of the frontend.

## Prisma for Database Access

Prisma provides a typed interface between the Node.js application and PostgreSQL while managing the database schema and generated client.

## Environment-Based Configuration

API credentials and database connection details are provided through environment variables rather than being hardcoded into the application.

This makes the same backend code usable across local development and cloud deployment.

## Docker

Docker provides a consistent runtime environment for deploying the backend and its Node.js dependencies.

---

# Frontend Integration

This repository contains the backend only.

The corresponding frontend is a separate React application that communicates with this backend through REST endpoints.

### Related Repository

**Frontend:**
https://github.com/farhan-7192/my-ai-frontend

The frontend provides:

* Chat interface
* Backend connection monitoring
* Health checks
* Latency tracking
* Persistent interaction history
* Responsive UI
* Configurable backend target

---

# What I Learned

This project was built to gain hands-on experience building and deploying a complete AI-powered web application.

Key areas explored through the project include:

* Building REST APIs with Node.js and Express
* Integrating an external LLM API
* Persisting application data with PostgreSQL
* Using Prisma as an ORM
* Managing environment-based configuration
* Containerizing backend applications with Docker
* Deploying backend services on AWS
* Connecting a frontend application to a cloud-hosted backend
* Designing an application where AI processing and persistent storage are handled by the backend

---

# Future Improvements

Potential future improvements include:

* Authentication and user-specific interaction history
* More granular conversation/session management
* Improved error handling and API validation
* Rate limiting
* Request logging and monitoring
* Additional AI endpoints and capabilities
* More comprehensive automated testing
* Production-oriented deployment and observability

---

## Author

**Farhan M Saigil**

Software Engineer focused on full-stack web development, APIs, databases, cloud deployment, and AI-powered applications.

[GitHub](https://github.com/farhan-7192) · [LinkedIn](https://linkedin.com/in/farhan-m-saigil)
