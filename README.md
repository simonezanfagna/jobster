# Jobster

Jobster is a web application designed to help users track their job applications. It provides a user-friendly interface for managing and monitoring the status of job applications throughout the job search process.

## Features

- User authentication (login and registration)
- Dashboard with job application statistics
- Job application listing with search and filter functionality
- Add, edit, and delete job applications
- User profile management

## Tech Stack

### Frontend

- JavaScript
- React
- Redux Toolkit
- Axios
- React Router

### Backend

- Python
- Flask
- JWT (JSON Web Tokens)
- SQLAlchemy

## Getting Started

### Frontend Setup

`npm install`

`npm run start`

### Backend Setup

Navigate to the backend directory

Create and activate a virtual environment:<br />
`python -m venv jobster_env`

Linux/macOS:<br />
`source jobster_env/bin/activate`

On Windows:<br />
In the VSCode terminal<br />
`source jobster_env/Scripts/activate`

to deactivate: `deactivate`

Install the required Python packages:<br/>
`pip install -r requirements.txt`

Create a `.flaskenv` file in the backend directory and add the following:

```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=sqlite:///jobster.db
SECRET_KEY=your_secret_key_here
```

Initialize the database:<br/>
`flask db init`

`flask db migrate -m "Initial migration."`

`flask db upgrade`

Start the Flask server:<br/>
`flask run`

## Usage

1. Landing Page: Users can access the login page from here.
2. Login/Registration: New users can register, while existing users can log in.
3. Dashboard: View statistics on pending, declined, and scheduled interview applications.
4. All Jobs: Browse all job applications with search and filter options. Edit or delete individual applications.
5. Add Job: Submit a new job application by entering relevant details.
6. Profile: View and edit user profile information.
