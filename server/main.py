from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_

from datetime import datetime
from datetime import date
from lib2to3.refactor import _identity
import datetime
from werkzeug.utils import secure_filename
import os
import shutil

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
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120),nullable=False)
    
    def __repr__(self):     
        return '<User %r>' % self.username

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80),nullable=False)
    description = db.Column(db.String(120),nullable=True)
    script_id = db.Column(db.Integer, db.ForeignKey('script.id', ondelete='CASCADE'), nullable=True)
    model_id = db.Column(db.Integer, db.ForeignKey('model.id', ondelete='CASCADE'), nullable=True)
    model_loc= db.Column(db.String(120),unique=True,nullable=True)
    data_category=db.Column(db.String(120),nullable=False)
    dataset_loc=db.Column(db.String(120),unique=True,nullable=True)
    created_by = db.Column(db.String(80), db.ForeignKey('user.username'), nullable=False)
    created_on = db.Column(db.Date(), default=date.today(),nullable=False)
    modified_by = db.Column(db.String(80), nullable=False)
    modified_on = db.Column(db.Date(), default=date.today(),nullable=False)
    timestamp = db.Column(db.DateTime(), default=datetime.datetime.utcnow,nullable=False)

    user = db.relationship('User',
        backref=db.backref('project', lazy=True))

    script = db.relationship('Script',
        backref=db.backref('project', lazy=True))

    model = db.relationship('Model',
        backref=db.backref('project', lazy=True))

    def __repr__(self):
        return '<Project %r>' % self.title

class Script(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80),unique=True,nullable=False)
    description = db.Column(db.String(120),nullable=False)
    logo_loc = db.Column(db.String(120),unique=True,nullable=False)

    def __repr__(self):
        return '<Script %r>' % self.name

class Model(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    script_id=db.Column(db.Integer, db.ForeignKey('script.id'), nullable=False)
    name = db.Column(db.String(80),unique=True, nullable=False)
    description = db.Column(db.String(120),nullable=False)
    model_loc = db.Column(db.String(120),unique=True,nullable=False)

    script = db.relationship('Script',
        backref=db.backref('model', lazy=True))

    def __repr__(self):
        return '<Model %r>' % self.name


@app.route("/")
def home():
    return {"home"}

# <-------------------------------------------------------USERS--------------------------------------------------------------------------->

@app.route("/login",methods=["GET", "POST"])
def login():
    # import pdb
    # pdb.set_trace()
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
                    'success':True
                    

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
                print(User.query.filter(User.username==data['username']).first())
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
                'success':True

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
                'users': users,
                'success':True
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
        parser.add_argument('username', help = 'Username cannot be blank', required = True)
        parser.add_argument('title', help = 'Title cannot be blank', required = True)
        parser.add_argument('description', help = 'Description cannot be blank', required = True)
        # parser.add_argument('script_id', help = 'Script Name cannot be blank', required = True)
        # parser.add_argument('model_id', help = 'Model cannot be blank', required = True)
        # parser.add_argument('datasetURL', help = 'Dataset cannot be blank', required = True)

        data = parser.parse_args()   
        try:
            # current_user = User.query.filter(User.username==data['username']).first()           
            if Project.query.filter(and_(Project.title==data['title'] , Project.created_by==data['username'])).first():
                return {'error' : "Project already exists"}

            if data.description=='null':
                description=None
            else:
                description=data.description

            new_project = Project(
                title=data['title'],
                description=description, 
                # script_name=data['script_name'],
                # model=data['modelURL'],
                # dataset=data['datasetURL'],
                created_by=data['username'], 
                modified_by=data['username']
            )
            db.session.add(new_project)
            db.session.commit()
            project={
                    'title':data['title'],
                    'description':description,
                    'created_by':data['username'],
                    'created_on':date.today(),
                    'timestamp':datetime.datetime.utcnow()
                    }
            print('new project--->',project)
            return {
                'project': project,
                'success':True
            }

        except:
            raise Exception()


@app.route("/get_projects", methods=["GET"])
def get_projects():
    # import pdb;
    # pdb.set_trace();

    if request.method == "GET":
        try:
            projects_records = Project.query.all()

            projects=[]



            if len(projects_records)>0:
                for row in projects_records:
                    if row.description==None:
                        description='null'
                    else:
                        description=row.description

                    if row.script_id==None:
                        script='null'
                    else:
                        script=get_script_name(row.script_id)

                    if row.model_id==None:
                        model='null'
                    else:
                        model=get_model_name(row.model_id)

                    if row.model_loc==None:
                        project_code='null'
                    else:
                        project_code=row.model_loc

                    if row.dataset_loc==None:
                        dataset='null'
                    else:
                        dataset=row.dataset_loc

                    projects.append({
                        'project_id':row.id,
                        'title':row.title,
                        'description':description,
                        'script':script,
                        'model':model,
                        'model_loc':project_code,
                        'dataset_loc':dataset,
                        'created_by':row.created_by,
                        'created_on':row.created_on
                        })

            return {
                'projects': projects,
                'success':True

            }

                            
        except:
            raise Exception()

@app.route("/get_projects_by_username", methods=["GET"])
def get_projects_by_username():
    # import pdb;
    # pdb.set_trace();

    if request.method == "GET":
        username=request.args.get('username');   
        try:
            projects_records = Project.query.filter(Project.created_by==username).all()
            projects=[]

            if len(projects_records)>0:
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
                'projects': projects,
                'success':True

            }

                            
        except:
            raise Exception()


@app.route("/get_project_by_projectId", methods=["GET"])
def get_models_by_projectId():
    print("**----------",request)

    if request.method == "GET":
        parser = reqparse.RequestParser()
        parser.add_argument('project_id', help = 'Project ID cannot be blank', required = True)
        data = parser.parse_args()   
        print(data.project_id)
        try:
            # models_records = db.session.query(Model).join(Script,Script.id==Model.script_id).filter(Script.name==data.script).all()
            project_record=Project.query.filter(Project.id==data.project_id).first()
            db.session.commit()
            print(project_record)
            project={
            'project_id':project_record.id,
            'model_loc':project_record.model_loc,
            'dataset_loc':project_record.dataset_loc
            } 
            return {
                'project': project,
                'success':True

            }
                            
        except:
            raise Exception()


@app.route("/delete_project", methods=["DELETE"])
def delete_project():
    if request.method == "DELETE":
        project_id=request.args.get('project_id');
        try:
            user_folderPath="Users"
            project=Project.query.filter(Project.id==project_id).first()

            print(project.model_loc)
            print(project.dataset_loc)

        
            if project.model_loc != None:
                model_folder=os.path.join(user_folderPath,project.model_loc)
                if os.path.exists(model_folder):
                    os.remove(model_folder)     
            
            if project.dataset_loc != None:
                dataset_folder=os.path.join(user_folderPath,project.dataset_loc)
                if os.path.exists(dataset_folder):
                    os.remove(dataset_folder)
            
            user=os.path.join(user_folderPath,project.created_by,project.title)
            if os.path.exists(user):
                print(user)
                os.remove(user)


            Project.query.filter(Project.id==project_id).delete()
            db.session.commit()    

            return {
                'success': True
            }
          
        except:
            raise Exception();                  
        # except OSError as error:
        #     print("Exception", OSError)
        #     return {'success':False}

# <-------------------------------------------------------FILE UPLOAD--------------------------------------------------------------------->

# @app.route('/upload', methods=['POST'])
def fileUpload(destinationPath, file):
    # fileType=request.args.get('fileType');
    # location=getLocation(destinationPath,fileType)
    target=os.path.join(destinationPath)
    if not os.path.isdir(target):
        os.mkdir(target)
    
    print("---file---",file);
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    print("--destination---",destination);

    return {
        'path':destination
    }

def getLocation(destinationPath,fileType):
    switcher={
        "images":'static/images',
        "models":'static/models',
        "dataset":'static/dataset'
    }
    return switcher.get(fileType,'static/upload')
    
# <------------------------------------------------------SCRIPTS-------------------------------------------------------------------------->

@app.route("/add_script", methods=["GET", "POST"])
def add_script():
    if request.method == "POST":
        parser = reqparse.RequestParser()
        parser.add_argument('name', help = 'Name cannot be blank', required = True)
        parser.add_argument('description', help = 'Description cannot be blank', required = True)
        # parser.add_argument('imageURL', help = 'logo cannot be blank', required = True)
        data = parser.parse_args()     
        file = request.files['file']                 
        # print(fileUpload('images',file)['path'])   
        imageURL=fileUpload(destinationPath='static/images',file=file)['path']

        try:           
            new_script = Script(name=data['name'], description=data['description'], logo_loc=imageURL)
            db.session.add(new_script)
            db.session.commit()
            script={
                    'name':data['name'],
                    'description':data['description'],
                    'logo_loc':imageURL
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
                    'logoURL':row.logo_loc
                })  
            return {
                'scripts': scripts,
                'success':True

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
                'scriptsCategories': scripts,
                'success':True

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
                print("***********",row.logo_loc)
                os.remove(row.logo_loc)

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
        # parser.add_argument('codeURL', help = 'Code path cannot be blank', required = True)
        data = parser.parse_args()  
        file = request.files['file']  
        # print(fileUpload('models',file)['path'])   
        codeURL=fileUpload(destinationPath='static/models',file=file)['path']
        print("code----------",codeURL);

        print("Add Model----------",data);

        try:
            new_models = Model(script_id=data['scriptId'], name=data['name'], description=data['description'], model_loc=codeURL)
            db.session.add(new_models)
            db.session.commit()
            print(new_models);
            model={
                    'script_id':data['scriptId'],            
                    'name':data['name'],
                    'description':data['description'],
                    'codePath':codeURL
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
                    'code_path':row.model_loc
                    })
                # print(projects)
            return {
                'models': models,
                'success':True
            }
                            
        except:
            raise Exception()

def get_script_name(script_id):
    script_record=Script.query.filter(Script.id==script_id).first()
    if script_record!=None:
        return script_record.name
    return ""

def get_model_name(model_id):
    model_record=Model.query.filter(Model.id==model_id).first()
    if model_record!=None:
        return model_record.name
    return ""

@app.route("/get_models_by_scriptId", methods=["GET"])
def get_models_by_scriptId():
    print("**----------",request)

    if request.method == "GET":
        parser = reqparse.RequestParser()
        parser.add_argument('script_id', help = 'Script ID cannot be blank', required = True)
        data = parser.parse_args()   
        print(data.script_id)
        try:
            # models_records = db.session.query(Model).join(Script,Script.id==Model.script_id).filter(Script.name==data.script).all()
            models_records=Model.query.filter(Model.script_id==data.script_id).all()
            db.session.commit()
             
            models=[]

            for row in models_records:
                print(row.id)
                models.append({
                    'model_id':row.id,
                    'name':row.name,
                    'description':row.description,
                    'model_loc':row.model_loc
                    }) 
            return {
                'models': models,
                'success':True

            }
                            
        except:
            raise Exception()

@app.route("/delete_model", methods=["DELETE"])
def delete_model():
    if request.method == "DELETE":
        model_id=request.args.get('model_id'); 
        try:
            model_record = Model.query.filter(Model.id==model_id).first()
            # for row in model_record:
            print("***********",model_record.model_loc)
            os.remove(model_record.model_loc)

            Model.query.filter(Model.id==model_id).delete()
            db.session.commit()
            return {
                'success': True
            }
                            
        except:
            raise Exception()

# <------------------------------------------------------DATASET-------------------------------------------------------------------------->

@app.route("/add_dataset", methods=["GET", "POST"])
def add_dataset():
    if request.method == "POST":
        file = request.files['file'] 
        datasetURL=fileUpload('static/dataset',file)['path']
        return {
            'datasetURL':datasetURL,
            'success':True
        }
    return{
        'error':"Invalid"
    }


# <--------------------------------------------------CREATE_PROJECT_MODEL----------------------------------------------------------->

@app.route("/set_project_model", methods=["GET", "POST"])
def set_project_model():
    print("******",request)
    if request.method == "POST":
        parser = reqparse.RequestParser()   
        parser.add_argument('project_id', help = 'Project ID cannot be blank', required = True)
        parser.add_argument('model_id', help = 'Model Id cannot be blank', required = True)
        parser.add_argument('script_id', help = 'Model Id cannot be blank', required = True)
        parser.add_argument('datasetURL', help = 'Dataset URL cannot be blank', required = True)
        parser.add_argument('username', help = 'Username URL cannot be blank', required = True)
        data = parser.parse_args()  

        print("data---",data)
        #get project
        project=db.session.query(Project).filter(Project.id==data.project_id).first()
        print("Project",project)


        # create dirs
        user_folderPath="Users"
        proj_loc=os.path.join(data.username, project.title)
        try:
            os.makedirs(os.path.join(user_folderPath,proj_loc), exist_ok = True)
        except OSError as error:
            print("Directory '%s' can not be created" % model_folderPath)

        #for models   
        filename=project.title+'.ipynb'

        #if skipped steps

        if data.script_id=='null':
            script_id=None
        else:
            script_id=data.script_id

        if data.model_id=='null':

            model_id=None

            # Creating a file at specified location
            dest_folderPath=os.path.join(user_folderPath,proj_loc)
            with open(os.path.join(dest_folderPath, filename), 'w') as fp:
                pass
            print("File created!")
            model_folderPath=os.path.join(proj_loc, filename)

        else:
            model_id=data.model_id
            #get model
            model = db.session.query(Model).filter(Model.id==data.model_id).first()
            print("Model",model)

            model_loc= model.model_loc
            print("Model Loc",model_loc)

            #copy model
            model_folderPath = os.path.join(proj_loc, filename)
            dest_folderPath=os.path.join(user_folderPath,model_folderPath)
            shutil.copyfile(model_loc, dest_folderPath)
            print("copy model-----", dest_folderPath, model_folderPath)


        if data.datasetURL=='null':
            dataset_folderPath=None
        else:
            #copy dataset
            dataset_folderPath = os.path.join(proj_loc, os.path.basename(data.datasetURL))
            dest_folderPath=os.path.join(user_folderPath,dataset_folderPath)
            shutil.copyfile(data.datasetURL, dest_folderPath)
            print("copy dataset-----")
            print("copy model-----", dest_folderPath, dataset_folderPath)


        # update project details
        project.script_id=script_id
        project.model_id=model_id

        # after removing users folder from the path
        project.model_loc=model_folderPath
        project.dataset_loc=dataset_folderPath

        project.modified_by=data.username
        project.modified_on=date.today()
        db.session.commit()


        print("***project", project.script_id, project.model_id)
        updated_project={
            'project_id':project.id,
            'model_loc':project.model_loc,
            'dataset_loc':project.dataset_loc
            }
        print("Updated project---",updated_project)

        return {
            'project':updated_project,
            'success':True
        }
    return{
        'error':"Invalid"
    }


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)