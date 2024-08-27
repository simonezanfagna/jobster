from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
from flask_cors import CORS
from helpers import validate_email

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobster.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your-secret-key"

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

CORS(app)

CORS(app, resources={r"/*": {"origins": "http://localhost"}})


# Modelli
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(255), nullable=False, default="")
    location = db.Column(db.String(255), nullable=False, default="")
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    jobs = db.relationship("Job", backref="user", lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(
            password, method="scrypt", salt_length=16
        )

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "name": self.name,
            "lastName": self.lastName,
            "email": self.email,
            "location": self.location,
        }


class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    job_location = db.Column(db.String(100), nullable=False)
    job_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    VALID_job_types = {"full-time", "part-time", "remote", "internship"}
    VALID_statuses = {"interview", "declined", "pending"}

    @classmethod
    def is_valid_job_type(cls, job_type):
        return job_type in cls.VALID_job_types

    @classmethod
    def is_valid_status(cls, status):
        return status in cls.VALID_statuses


# Routes


@app.route("/@me", methods=["GET"])
@jwt_required()
def getUserFromSession():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    return (
        jsonify(
            {
                "message": "User",
                "user": user.to_dict(),
            }
        ),
        201,
    )


@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not name:
        return (
            jsonify({"msg": "Email, password and name are required"}),
            400,
        )
    if not validate_email(email):
        return jsonify({"msg": "Invalid email format"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user is not None:
        return jsonify({"msg": "Email already registered"}), 409

    if " " in password:
        return jsonify({"msg": "Password must not contain spaces"}), 400

    if len(password) < 8:
        return jsonify({"msg": "Password must be at least 8 characters long"}), 400

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    user = User.query.filter_by(email=email).first()

    access_token = create_access_token(identity=user.id)
    return (
        jsonify(
            {
                "msg": "User registered successfully",
                "user": user.to_dict(),
                "token": access_token,
            }
        ),
        201,
    )


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Ensure email and password were submitted
    if not email or not password:
        return jsonify({"msg": "Email, password are required"}), 400

    # Query database for email
    user = User.query.filter_by(email=email).first()

    # Ensure email exists and password is correct
    if not user or not user.check_password(password):
        return jsonify({"msg": "invalid email and/or password"}), 401

    access_token = create_access_token(identity=user.id)
    return (
        jsonify(
            {
                "msg": "User registered successfully",
                "user": user.to_dict(),
                "token": access_token,
            }
        ),
        200,
    )


@app.route("/auth/updateUser", methods=["PATCH"])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    name = data.get("name")
    lastName = data.get("lastName")
    email = data.get("email")
    new_password = data.get("password")
    location = data.get("location")

    if not email or not lastName or not name or not location:
        return (
            jsonify({"msg": "Email, name, last name and location are required"}),
            400,
        )

    if not validate_email(email):
        return jsonify({"msg": "Invalid email format"}), 400

    # Checking Existing Email
    current_email = user.email

    if current_email != email:
        existing_user = User.query.filter_by(email=email).first()

        if existing_user is not None:
            return jsonify({"msg": "Email already registered"}), 409

    user.name = name
    user.email = email
    user.location = location
    user.lastName = lastName

    # Checking password
    if new_password:
        if " " in new_password:
            return jsonify({"msg": "Password must not contain spaces"}), 400
        if len(new_password) < 8:
            return jsonify({"msg": "Password must be at least 8 characters long"}), 400
        user.set_password(new_password)

    db.session.commit()

    access_token = create_access_token(identity=user.id)

    return (
        jsonify(
            {
                "msg": "User updated successfully",
                "user": user.to_dict(),
                "token": access_token,
            }
        ),
        200,
    )


@app.route("/jobs", methods=["POST"])
@jwt_required()
def create_job():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    position = data.get("position")
    company = data.get("company")
    job_location = data.get("jobLocation")
    job_type = data.get("jobType")
    status = data.get("status")

    if not position or not company or not status or not job_location or not job_type:
        return (
            jsonify({"msg": "Enter all the data"}),
            400,
        )

    if not Job.is_valid_job_type(data["jobType"]):
        return jsonify({"msg": "Invalid job type"}), 400

    if not Job.is_valid_status(data["status"]):
        return jsonify({"msg": "Invalid status"}), 400

    new_job = Job(
        position=position,
        company=company,
        job_location=job_location,
        job_type=job_type,
        status=status,
        user_id=current_user_id,
    )

    db.session.add(new_job)
    db.session.commit()
    return jsonify({"msg": "Job created successfully"}), 201


@app.route("/jobs", methods=["GET"])
@jwt_required()
def get_jobs():
    current_user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    search = request.args.get("search", "")
    search_status = request.args.get("status", "all")
    search_type = request.args.get("jobType", "all")
    sort = request.args.get("sort", "latest")

    valid_statuses = {"all", "interview", "declined", "pending"}
    valid_types = {"all", "full-time", "part-time", "remote", "internship"}
    valid_sorts = {"latest", "oldest", "a-z", "z-a"}

    if search_status not in valid_statuses:
        return jsonify({"msg": "Invalid status"}), 400

    if search_type not in valid_types:
        return jsonify({"msg": "Invalid job type"}), 400

    if sort not in valid_sorts:
        return jsonify({"msg": "Invalid sort option"}), 400

    # Start with a base query
    query = Job.query.filter_by(user_id=current_user_id)

    # Apply search filters
    if search:
        query = query.filter(Job.position.ilike(f"%{search}%"))

    if search_status != "all":
        query = query.filter(Job.status == search_status)

    if search_type != "all":
        query = query.filter(Job.job_type == search_type)

    # Apply sorting
    if sort == "latest":
        query = query.order_by(desc(Job.created_at))
    elif sort == "oldest":
        query = query.order_by(Job.created_at)
    elif sort == "a-z":
        query = query.order_by(Job.position)
    elif sort == "z-a":
        query = query.order_by(desc(Job.position))

    # Number of jobs per page
    per_page = 10

    # Paginate the results
    jobs = query.paginate(page=page, per_page=per_page)

    return (
        jsonify(
            {
                "jobs": [
                    {
                        "id": job.id,
                        "position": job.position,
                        "company": job.company,
                        "jobLocation": job.job_location,
                        "jobType": job.job_type,
                        "status": job.status,
                        "createdAt": job.created_at,
                    }
                    for job in jobs.items
                ],
                "totalJobs": jobs.total,
                "numOfPages": jobs.pages,
            }
        ),
        200,
    )


@app.route("/jobs/<int:job_id>", methods=["DELETE"])
@jwt_required()
def delete_job(job_id):
    current_user_id = get_jwt_identity()
    job = Job.query.filter_by(id=job_id, user_id=current_user_id).first()
    if job:
        db.session.delete(job)
        db.session.commit()
        return jsonify({"msg": "Job deleted successfully"}), 200
    return jsonify({"msg": "Job not found"}), 404


@app.route("/jobs/<int:job_id>", methods=["PATCH"])
@jwt_required()
def edit_job(job_id):
    current_user_id = get_jwt_identity()
    job = Job.query.filter_by(id=job_id, user_id=current_user_id).first()
    if job:
        data = request.get_json()

        if not Job.is_valid_job_type(data["jobType"]):
            return jsonify({"msg": "Invalid job type"}), 400

        if not Job.is_valid_status(data["status"]):
            return jsonify({"msg": "Invalid status"}), 400

        job.position = data.get("position", job.position)
        job.company = data.get("company", job.company)
        job.job_location = data.get("jobLocation", job.job_location)
        job.job_type = data.get("jobType", job.job_type)
        job.status = data.get("status", job.status)
        db.session.commit()
        return jsonify({"msg": "Job updated successfully"}), 200

    return jsonify({"msg": "Job not found"}), 404


@app.route("/jobs/stats", methods=["GET"])
@jwt_required()
def get_stats():
    current_user_id = get_jwt_identity()
    jobs = Job.query.filter_by(user_id=current_user_id).all()

    # Calculation of statistics
    total_jobs = len(jobs)
    status_counts = {
        "pending": sum(1 for job in jobs if job.status == "pending"),
        "interview": sum(1 for job in jobs if job.status == "interview"),
        "declined": sum(1 for job in jobs if job.status == "declined"),
    }

    # Calculation of monthly applications
    monthly_applications = {}
    for job in jobs:
        month_key = job.created_at.strftime("%B %Y")
        if month_key in monthly_applications:
            monthly_applications[month_key] += 1
        else:
            monthly_applications[month_key] = 1

    return (
        jsonify(
            {
                "defaultStats": status_counts,
                "monthlyApplications": [
                    {"date": k, "count": v} for k, v in monthly_applications.items()
                ],
            }
        ),
        200,
    )


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
