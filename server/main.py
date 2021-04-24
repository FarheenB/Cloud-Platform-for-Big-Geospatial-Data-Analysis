from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from lib2to3.refactor import _identity

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
    email = db.Column(db.String(120))
    password = db.Column(db.String(80))

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer)
    title = db.Column(db.String(80))
    description = db.Column(db.String(120))
    timestamp = db.Column(db.String(80))

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
                return {"error":"User does not exists. Register as a new user"}

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
                return {'error': 'The email and/or password you specified are not correct.'}
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

        try:
            print(hashlib.md5(data['password'].encode()).hexdigest())
            if User.query.filter(User.username==data['username']).first():
                return {"error" : "User already exists"}

            if User.query.filter(User.email==data['email']).first():
                return {"error" : "Email Address already exists"}

            
            registered_user = User(username=data['username'], email=data['email'], password=hashlib.md5(data['password'].encode()).hexdigest())
            db.session.add(registered_user)
            db.session.commit()

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

    
if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)