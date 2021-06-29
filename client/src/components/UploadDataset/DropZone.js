import React, { useState, useCallback } from "react";
import './UploadDataset.css';
import { useDropzone } from 'react-dropzone';
import { useHistory } from "react-router-dom";

// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

import CircularProgress from '@material-ui/core/CircularProgress'

const DropZone = ({model, script, category}) => {
    const [state , setState] = useState({
        datasetURL:"",
        datasetType:"",
        uploading:false,
        form_error:""      
    });

  const maxSize = 104857600;

  const onDrop = useCallback(acceptedFiles => {
    console.log("--->",acceptedFiles);
  }, []);

  const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
    onDrop,
    accept:"image/jpeg, image/jpg, image/tiff, image/tif, image/png",
    multiple:true,
    minSize: 0,
    maxSize,
  });

  const isFileTooLarge = rejectedFiles?rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize:false;


  const history=useHistory();

  const handleSubmit = (event) => {
    event.preventDefault(event);
    
    if(category===''){
        setState({uploading:false, form_error:"Select data category"});

    }
    // let model=sessionStorage.getItem("U_model");
    // let script=sessionStorage.getItem("U_script");
    // let dataset=acceptedFiles[0];
    // let datasetType=dataset.type.split('/')[0];

    // sessionStorage.setItem("U_dataset",dataset);
    // console.log("dataset",dataset);
    // history.push('/select_target?script='+script+'&model='+model+'&dataset='+datasetType);
    else{
        setState({uploading:true, form_error:''});
        console.log("---state---",state)
        let url = "/add_dataset"
        let formData  = new FormData();
        let i;
        for(i=0;i<acceptedFiles.length;i++){
            formData.append('file'+i, acceptedFiles[i]);
        }
        // formData.append('file', acceptedFiles[0]);
        // // formData.append('file1', acceptedFiles[1]);
        // // formData.append('file2', acceptedFiles[2]);


        formData.append('category', category);
        formData.append('project_id', sessionStorage.getItem('U_project_id'));
        console.log(acceptedFiles);
        console.log(formData);


        fetch(url, {
            method: 'POST',
            body: formData
        }).then( res => res.json())
        .then(data=>{
            if(data.success){
                // let datasetType=acceptedFiles[0].type.split('/')[0];

                // setState({datasetURL:data.datasetURL,datasetType:datasetType});
                // sessionStorage.setItem("U_datasetURL",data.datasetURL);

                history.push('/stacking?script='+script+'&model='+model);           

            }


        }).catch(err => console.log(err));
    }
        
    }
    
  
    console.log("-----state",state);
    console.log("-----category",category);



  return (
    
     <div className="upload-dataset">
        <div className="zone">
        <div {...getRootProps()}>
            <input {...getInputProps()} />
                <div id="dropZ">
                    <div><i class="fa fa-cloud-upload"></i></div>
                    <input ref={(ref) => { this.uploadInput = ref; }} {...getInputProps()}/>
                    {/* <span>{isDragActive ? "📂" : "📁"}</span> */}
                    {/* {!isDragActive && 'Click here or drop a file to upload!'} */}
                    {/* {isDragActive && !isDragReject && "Drop it like it's hot!"} */}
    

                    {!isDragActive &&
                    <div>
                        <div className="drop-text">
                            <span>
                                Drag and drop your files here
                            </span>
                        </div>                    
                        <div>
                            <span>
                                OR
                            </span>
                        </div>  
                    </div>
                    }
                    {isDragActive && !isDragReject &&
                        <div>
                        <span>
                        Drop it like it's hot!
                        </span>
                        </div>
                    }
                    {isDragReject && 
                    <div>
                    <span>
                        File type or size not accepted, Sorry!
                    </span>
                    
                    </div>
                    }

                    <div class="selectFile">       
                        <label for="file">Select files</label>                   
                            {/* <input type="file" name="files[]" id="file"/> */}
                    </div>
                    <div>
                        <span>
                            File size limit : 100 MB
                        </span>
                    </div>

                    {isFileTooLarge && (
                    <div className="text-danger mt-2">
                    File is too large.
                    </div>
                )}
                </div>
                </div>
            

        </div>
        <ul className="list-group mt-2 uploaded-files">
        {acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
            <li className="list-group-item list-group-item-success">
            {acceptedFile.name}
            </li>
        ))}
        </ul>
        <div className="form-group ">
            <button 
                type="submit" 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={acceptedFiles.length===0 || state.uploading} 
            >{state.uploading?"Uploading...":"Upload"}</button>
        </div>

        {
            state.form_error.length>0 && 
            <div class="form-error">
                <span className='error'>{state.form_error}</span>
            </div>
        } 
        { 
            state.uploading &&
            <div className="progressbar">
                <CircularProgress color="inherit"/>

            </div>
        }
    </div>
 
  );
};
export default DropZone;