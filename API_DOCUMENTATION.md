# API Documentation - SniperThink Distributed File Processing System

This document outlines the API endpoints available in the SniperThink backend.

## Base URLs
- **Live**: `https://sniper-kwf7.onrender.com/api`
- **Local**: `http://localhost:5000/api`

---

## 🚦 System Health

### 1. Health Check
Quickly verify server and database connectivity.
*   **URL**: `/health`
*   **Method**: `GET`
*   **Success Response**: `200 OK`
*   **Content**: `{"status": "ok", "serverTime": "2026-..."}`

### 2. Connection Ping
Lightweight endpoint for frontend connectivity testing.
*   **URL**: `/ping`
*   **Method**: `GET`
*   **Success Response**: `200 OK`
*   **Content**: `pong`

---

## 📂 File Processing

### 3. File Upload
Upload a file (PDF or TXT) for asynchronous processing.
*   **URL**: `/upload`
*   **Method**: `POST`
*   **Content-Type**: `multipart/form-data`
*   **Body**:
    *   `file`: The file to upload (Max 10MB).
    *   `userId`: The UUID/String of the user uploading the file.
*   **Success Response**: `201 CREATED`
*   **Content**: `{"message": "File uploaded and job queued", "jobId": "..."}`

### 4. Job Status & Results
Retrieve the current status and processed results of a specific job.
*   **URL**: `/job/:id`
*   **Method**: `GET`
*   **Success Response**: `200 OK`
*   **Content (Completed)**:
    ```json
    {
      "id": "...",
      "status": "COMPLETED",
      "result": {
        "wordCount": 1200,
        "paragraphCount": 35,
        "keywords": ["system", "data"]
      }
    }
    ```

---

## 📈 Lead Generation

### 5. Strategy Interest (Part 1)
Record user interest in specific strategy steps.
*   **URL**: `/interest`
*   **Method**: `POST`
*   **Body**: `{"name": "...", "email": "...", "step": "..."}`
*   **Success Response**: `200 OK`
