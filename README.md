
 ## Project tool
 * Nestjs
 * Websocket (for realtime data)
 * Mongodb
 * Cronjob

## Overview
This project implements a Hexagonal Architecture (also known as Ports and Adapters) to create a modular, testable, and maintainable codebase. The architecture decouples business logic from external systems, allowing flexibility in integrating with various technologies
## Approach
Backend: Uses Nestjs for REST API, MongoDB for persistence, and Websocket for real-time updates.The SessionSchedulerService is a NestJS service that manages game session lifecycles by running a cron job every 90 seconds. It checks for active sessions, starts new ones with a 30-second pre-session countdown, manages session duration (default 60 seconds), and ends sessions by selecting a random winning number (1-9). It uses SessionGateway to emit real-time updates (countdowns, session start/end) to clients via WebSockets, interacts with GameRepository for session persistence, and leverages GameService for session creation logic.

Frontend: React with Axios for API calls and Socket.IO for real-time updates. Simple UI with forms for authentication, buttons for game interaction
Scalability: MongoDB ensures efficient storage and querying. Socket.IO handles real-time updates for session status and countdowns.
Security: JWT for authentication, middleware to protect routes, and session checks to prevent multiple logins.


## env file
MONGO_URI=
JWT_SECRET=
SESSION_USER_CAP=
SESSION_DURATION_SECONDS=

## Project setup for backend

```bash
$ npm install
```

## Compile and run the backend project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev




```
## Project for frontend

```bash
$ cd frontend
```

## Compile and run the frontend project

```bash
# development
$ npm run install

# watch mode
$ npm run start
## Run tests


Name: Nelson Iseru
Email: nelsoniseru08@gmail.com
Phone: +2349026915561



