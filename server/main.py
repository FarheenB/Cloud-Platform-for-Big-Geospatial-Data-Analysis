from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from datetime import date
from lib2to3.refactor import _identity
import datetime
from werkzeug.utils import secure_filename
import os

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
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80),nullable=False)

class Project_Records(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(80),nullable=False)
    description = db.Column(db.String(120),nullable=False)
    created_by = db.Column(db.String(80),nullable=False)
    created_on = db.Column(db.Date(), default=date.today(),nullable=False)
    timestamp = db.Column(db.DateTime(), default=datetime.datetime.utcnow,nullable=False)

class Script(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80),unique=True,nullable=False)
    description = db.Column(db.String(120),nullable=False)
    logoURL = db.Column(db.String(120),unique=True,nullable=False)

class Model(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    script_id=db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(80),unique=True, nullable=False)
    description = db.Column(db.String(120),nullable=False)
    codePath = db.Column(db.String(120),unique=True,nullable=False)


@app.route("/")
def home():
    return {"home"}

# <-------------------------------------------------------USERS--------------------------------------------------------------------------->

@app.route("/login",methods=["GET", "POST"])
def login():
    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('email', help = 'Email cannot be blank', required = True)
        parser.add_argument('password', help = 'Password cannot be blank', required = True)
        data = parser.parse_args()
        try:
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
                return {                
                    'error': 'Email and/or password incorrect.'
                }

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
            # print(hashlib.md5(data['password'].encode()).hexdigest())
            if User.query.filter(User.username==data['username']).first():
                return {"error" : "User already exists"}

            if User.query.filter(User.email==data['email']).first():
                return {"error" : "Email Address already exists"}

            
            registered_user = User(username=data['username'], email=data['email'], password=hashlib.md5(data['password'].encode()).hexdigest())
            db.session.add(registered_user)
            db.session.commit()
            # print(registered_user);
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


@app.route("/get_users", methods=["GET"])
def get_users():
    if request.method == "GET":  
        try:
            users_records = User.query.all()
            users=[]
            for row in users_records:
                users.append({
                    'user_id':row.id,
                    'username':row.username,
                    'email':row.email
                    })
            return {
                'users': users
            }
                            
        except:
            raise Exception()


@app.route("/delete_user", methods=["DELETE"])
def delete_user():
    if request.method == "DELETE":
        user_id=request.args.get('user_id');
        try:
            User.query.filter(User.id==user_id).delete()
            db.session.commit()            
            return {
                'success': True
            }
                            
        except:
            raise Exception()

# <------------------------------------------------------PROJECTS------------------------------------------------------------------------->

@app.route("/create_project", methods=["GET", "POST"])
def create_project():
    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('title', help = 'Title cannot be blank', required = True)
        parser.add_argument('description', help = 'Description cannot be blank', required = True)
        parser.add_argument('username', help = 'Username cannot be blank', required = True)
        data = parser.parse_args()   
        try:
            current_user = User.query.filter(User.username==data['username']).first()           
            new_project = Project_Records(title=data['title'], description=data['description'], user_id=current_user.id, created_by=data['username'])
            db.session.add(new_project)
            db.session.commit()
            project={
                    'title':data['title'],
                    'description':data['description'],
                    'created_by':data['username'],
                    'created_on':date.today(),
                    'timestamp':datetime.datetime.utcnow()
                    }
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
        try:
            projects_records = Project_Records.query.filter(Project_Records.created_by==username).all()
            projects=[]
            for row in projects_records:
                projects.append({
                    'project_id':row.id,
                    'title':row.title,
                    'description':row.description,
                    'created_by':row.created_by,
                    'created_on':row.created_on,
                    'timestamp':row.timestamp
                    })
            return {
                'projects': projects
            }
                            
        except:
            raise Exception()


@app.route("/delete_project", methods=["DELETE"])
def delete_project():
    if request.method == "DELETE":
        project_id=request.args.get('project_id');
        try:
            Project_Records.query.filter(Project_Records.id==project_id).delete()
            db.session.commit()            
            return {
                'success': True
            }
                            
        except:
            raise Exception()

# <-------------------------------------------------------FILE UPLOAD--------------------------------------------------------------------->

@app.route('/upload', methods=['POST'])
def fileUpload():
    fileType=request.args.get('fileType');
    location=getLocation(fileType)
    target=os.path.join(location)
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    print("file",file);
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    print("destination",destination);

    return {
        'path':destination
    }

def getLocation(fileType):
    switcher={
        "images":'static/images',
        "models":'static/models',
    }
    return switcher.get(fileType,'static/upload')
    
# <------------------------------------------------------SCRIPTS-------------------------------------------------------------------------->

@app.route("/add_script", methods=["GET", "POST"])
def add_script():
    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('name', help = 'Name cannot be blank', required = True)
        parser.add_argument('description', help = 'Description cannot be blank', required = True)
        parser.add_argument('imageURL', help = 'logo cannot be blank', required = True)
        data = parser.parse_args()     
        try:           
            new_script = Script(name=data['name'], description=data['description'], logoURL=data['imageURL'])
            db.session.add(new_script)
            db.session.commit()
            script={
                    'name':data['name'],
                    'description':data['description'],
                    'logoURL':data['imageURL']
                }   
            return {
                'success':True
            }

        except:
            raise Exception()


@app.route("/get_scripts", methods=["GET"])
def get_scripts():
    if request.method == "GET":
        try:
            scripts_records = Script.query.all()
            scripts=[]
            for row in scripts_records:
                scripts.append({
                    'script_id':row.id,
                    'name':row.name,
                    'description':row.description,
                    'logoURL':row.logoURL
                })  
            return {
                'scripts': scripts
            }
                            
        except:
            raise Exception()


@app.route("/get_scripts_type", methods=["GET"])
def get_scripts_type():
    if request.method == "GET":
        try:
            scripts_records = Script.query.all()
            scripts=[]
            for row in scripts_records:
                scripts.append({
                    'script_id':row.id,
                    'name':row.name
                })  
            return {
                'scriptsCategories': scripts
            }
                            
        except:
            raise Exception()


@app.route("/delete_script", methods=["DELETE"])
def delete_script():
    if request.method == "DELETE":
        script_id=request.args.get('script_id'); 
        try:
            script_record = Script.query.filter(Script.id==script_id).all()
            for row in script_record:
                print("***********",row.logoURL)
                os.remove(row.logoURL)

            Script.query.filter(Script.id==script_id).delete()
            db.session.commit()
            return {
                'success': True
            }
                            
        except:
            raise Exception()

# <------------------------------------------------------MODELS--------------------------------------------------------------------------->

@app.route("/add_model", methods=["GET", "POST"])
def add_model():
    print("Add Model----------",request);

    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('scriptId', help = 'Script Id cannot be blank', required = True)
        parser.add_argument('name', help = 'Name cannot be blank', required = True)
        parser.add_argument('description', help = 'Description cannot be blank', required = True)
        parser.add_argument('codeURL', help = 'Code path cannot be blank', required = True)
        data = parser.parse_args()      

        print("Add Model----------",data);

        try:
            new_models = Model(script_id=data['scriptId'], name=data['name'], description=data['description'], codePath=data['codeURL'])
            db.session.add(new_models)
            db.session.commit()
            print(new_models);
            model={
                    'script_id':data['scriptId'],            
                    'name':data['name'],
                    'description':data['description'],
                    'codePath':data['codeURL']
                }
            print("-------",model)
            return {
                'success':True
            }
        except:
            raise Exception()


@app.route("/get_models", methods=["GET"])
def get_models():
    if request.method == "GET":
        try:
            models_records = db.session.query(Model).join(Script,Script.id==Model.script_id)
            print("**----------",models_records)

            models=[]

            for row in models_records:
                print(row.id)
                script_name=get_script_name(row.script_id)
                models.append({
                    'model_id':row.id,
                    'script_name':script_name,
                    'name':row.name,
                    'description':row.description,
                    'code_path':row.codePath
                    })
                # print(projects)
            return {
                'models': models
            }
                            
        except:
            raise Exception()

def get_script_name(script_id):
    script_record=Script.query.filter(Script.id==script_id).first()
    if script_record!=None:
        return script_record.name
    return ""


@app.route("/get_models_by_scriptName", methods=["GET"])
def get_models_by_scriptName():
    print("**----------",request)

    if request.method == "GET":
        parser = reqparse.RequestParser()
        parser.add_argument('script', help = 'Script Id cannot be blank', required = True)
        data = parser.parse_args()   
        try:
            models_records = db.session.query(Model).join(Script,Script.id==Model.script_id).filter(Script.name==data.script).all()
            models=[]

            for row in models_records:
                print(row.id)
                models.append({
                    'model_id':row.id,
                    'name':row.name,
                    'description':row.description,
                    'code_path':row.codePath
                    }) 
            return {
                'models': models
            }
                            
        except:
            raise Exception()

@app.route("/delete_model", methods=["DELETE"])
def delete_model():
    if request.method == "DELETE":
        model_id=request.args.get('model_id'); 
        try:
            model_record = Model.query.filter(Model.id==model_id).all()
            for row in model_record:
                print("***********",row.codePath)
                os.remove(row.codePath)

            Model.query.filter(Model.id==model_id).delete()
            db.session.commit()
            return {
                'success': True
            }
                            
        except:
            raise Exception()

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)