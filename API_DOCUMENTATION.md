# API Documentation - SniperThink Distributed File Processing System

This document outlines the API endpoints available in the SniperThink backend.

## Base URL
`http://localhost:5000/api`

---

## 1. File Upload
Allows users to upload a file (PDF or TXT) for asynchronous processing.

*   **URL**: `/upload`
*   **Method**: `POST`
*   **Content-Type**: `multipart/form-data`
*   **Body**:
    *   `file`: The file to upload (Max 10MB).
    *   `userId`: The UUID of the user uploading the file.
*   **Success Response**:
    *   **Code**: `201 CREATED`
    *   **Content**:
        ```json
        {
          "message": "File uploaded and job queued",
          "jobId": "a1b2c3d4-..."
        }
        ```
*   **Error Response**:
    *   **Code**: `400 BAD REQUEST` (Missing file, missing userId, or invalid file type).
    *   **Code**: `500 INTERNAL SERVER ERROR`

---

## 2. Job Status & Results
Retrieve the current status and processed results of a specific job.

*   **URL**: `/job/:id`
*   **Method**: `GET`
*   **URL Params**: `id=[string]` (The jobId returned during upload).
*   **Success Response**:
    *   **Code**: `200 OK`
    *   **Content (Processing)**:
        ```json
        {
          "id": "a1b2c3d4-...",
          "status": "PROCESSING",
          "progress": 50,
          "result": null
        }
        ```
    *   **Content (Completed)**:
        ```json
        {
          "id": "a1b2c3d4-...",
          "status": "COMPLETED",
          "progress": 100,
          "result": {
            "wordCount": 1200,
            "paragraphCount": 35,
            "keywords": ["system", "data", "process"]
          }
        }
        ```
*   **Error Response**:
    *   **Code**: `404 NOT FOUND` (Job not found).

---

## 3. Simple Interest (Part 1)
Endpoint to record user interest in a specific strategy step.

*   **URL**: `/interest`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "step": "Identify Audience"
    }
    ```
*   **Success Response**:
    *   **Code**: `200 OK`
    *   **Content**: `{"message": "Interest recorded successfully"}`
