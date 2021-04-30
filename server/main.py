from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from datetime import date
from lib2to3.refactor import _identity
import datetime

from flask_restful import Resource, reqparse
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token)
import hashlib
from email_validator import validate_email, EmailNotValidError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

app.config['JWT_SECRET_KEY'] = 'boost-is-the-secret-of-our-app'
jwt=JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    email = db.Column(db.String(80))
    password = db.Column(db.String(80))

class Project_Records(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer)
    title = db.Column(db.String(80))
    description = db.Column(db.String(120))
    created_by = db.Column(db.String(80))
    created_on = db.Column(db.Date(), default=date.today())
    timestamp = db.Column(db.DateTime(), default=datetime.datetime.utcnow)

@app.route("/")
def home():
    return {"home"}
    # return render_template("home.html")

@app.route("/login",methods=["GET", "POST"])
def login():

    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('email', help = 'Email cannot be blank', required = True)
        parser.add_argument('password', help = 'Password cannot be blank', required = True)
        data = parser.parse_args()

        print("--------data",data)

        try:
            print(User.query.all());
            current_user = User.query.filter(User.email==data['email']).first()

            if not current_user:
                return {"error":"User does not exists."}

            password = hashlib.md5(data['password'].encode()).hexdigest()
            if current_user.password == password :
                access_token = create_access_token(identity=current_user.username)
                refresh_token = create_refresh_token(identity=current_user.username)
                return {
                    'username': current_user.username,
                    'email': current_user.email,
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'success_message': 'Successful'

                }
            else:
                return {'error': 'Email and/or password incorrect.'}
        except:
            raise Exception("Cannot login user")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('username', help = 'Username cannot be blank', required = True)
        parser.add_argument('email', help = 'Email address cannot be blank', required = True)
        parser.add_argument('password', help = 'Password cannot be blank', required = True)
        parser.add_argument('confirmPassword', help = 'Confirm password cannot be blank', required = True)
        data = parser.parse_args()      
        print("----------",data);

        try:
            print(hashlib.md5(data['password'].encode()).hexdigest())
            if User.query.filter(User.username==data['username']).first():
                return {"error" : "User already exists"}

            if User.query.filter(User.email==data['email']).first():
                return {"error" : "Email Address already exists"}

            
            registered_user = User(username=data['username'], email=data['email'], password=hashlib.md5(data['password'].encode()).hexdigest())
            db.session.add(registered_user)
            db.session.commit()
            print(registered_user);
            access_token = create_access_token(identity=registered_user.username)
            refresh_token = create_refresh_token(identity=registered_user.username)
            return {
                'username': registered_user.username,
                'email': registered_user.email,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'success_message': 'Successful'
            }
        except:
            raise Exception()

@app.route("/create_project", methods=["GET", "POST"])
def create_project():
    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('title', help = 'Title cannot be blank', required = True)
        parser.add_argument('description', help = 'Description cannot be blank', required = True)
        parser.add_argument('username', help = 'Username cannot be blank', required = True)

        data = parser.parse_args()      
        print("----------",data);

        try:
            current_user = User.query.filter(User.username==data['username']).first()
           
            new_project = Project_Records(title=data['title'], description=data['description'], user_id=current_user.id, created_by=data['username'])
            db.session.add(new_project)
            db.session.commit()
            print(new_project);
            project={
                    'title':data['title'],
                    'description':data['description'],
                    'created_by':data['username'],
                    'created_on':date.today(),
                    'timestamp':datetime.datetime.utcnow()
                    }
            print("-------",project)
            return {
                'new_project': project,
                'success':True
            }
        except:
            raise Exception()

@app.route("/get_projects", methods=["GET"])
def get_projects():
    if request.method == "GET":
        username=request.args.get('username');      
        print("----------",username);

        try:
            projects_records = Project_Records.query.filter(Project_Records.created_by==username).all()
            print("**----------",projects_records);
            projects=[]

            for row in projects_records:
                print(row)
                projects.append({
                    'project_id':row.id,
                    'title':row.title,
                    'description':row.description,
                    'created_by':row.created_by,
                    'created_on':row.created_on,
                    'timestamp':row.timestamp,



                    })
                print(projects)
            return {
                'projects': projects
            }
                            
        except:
            raise Exception()

# @app.route("/delete_project", methods=["DELETE"])
# def delete_project():
    # if request.method == "GET":
    #     project_id=request.args.get('project_id');      
    #     print("----------",project_id);

    #     try:
    #         Project_Records.query.filter(Project_Records.id==project_id).delete()
    #         return {
    #             'success': true
    #         }
                            
    #     except:
    #         raise Exception()
    # print("Deleted");


    
if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)