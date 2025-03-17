# Email Application Backend

A FastAPI backend for a simple email application with inbox and sent mail functionality.

## Features

- Email data model with sender, recipient, subject, body, etc.
- Inbox functionality to view and read emails
- Send/Reply functionality
- Sent items section

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   uvicorn app.main:app --reload
   ```

4. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /api/emails?folder=inbox|sent` - Get all emails in a folder
- `GET /api/emails/{email_id}` - Get a specific email by ID
- `POST /api/emails` - Send a new email
- `PATCH /api/emails/{email_id}` - Update email (mark as read/unread)
- `DELETE /api/emails/{email_id}` - Delete an email

## Database

The application uses TinyDB, a lightweight document-oriented database that stores data in a JSON file. 