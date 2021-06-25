import React, { useState, useCallback } from "react";
import './UploadDataset.css';
import { useDropzone } from 'react-dropzone';
import { useHistory } from "react-router-dom";

const UploadBands = ({model, script, category}) => {
    const [state , setState] = useState({
        datasetURL:"",
        datasetType:"",
        form_error:"",
        bands:[]
        
    });

  const maxSize = 1048576;

  const onDrop = useCallback(acceptedFiles => {
    console.log("---",acceptedFiles);
    // setState({ bands: state.bands.concat(acceptedFiles[0]) })
  }, []);

  const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles } = useDropzone({
    onDrop,
    accept: 'image/*',
    minSize: 0,
    maxSize,
  });

  const isFileTooLarge = rejectedFiles?rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize:false;


  const history=useHistory();

  const handleSubmit = (event) => {
    event.preventDefault(event);

    if(category===''){
        setState({form_error:"Select data category"});
    }

    // let model=sessionStorage.getItem("U_model");
    // let script=sessionStorage.getItem("U_script");
    // let dataset=acceptedFiles[0];
    // let datasetType=dataset.type.split('/')[0];

    // sessionStorage.setItem("U_dataset",dataset);
    // console.log("dataset",dataset);
    // history.push('/select_target?script='+script+'&model='+model+'&dataset='+datasetType);
    else{
        let url = "/add_dataset"
        let formData  = new FormData();
        formData.append('file', acceptedFiles[0]);
        formData.append('category', category);
        fetch(url, {
            method: 'POST',
            body: formData
        }).then( res => res.json())
        .then(data=>{
            if(data.success){
                let datasetType=acceptedFiles[0].type.split('/')[0];

                setState({datasetURL:data.datasetURL,datasetType:datasetType});
                sessionStorage.setItem("U_datasetURL",data.datasetURL);

                history.push('/start_model?script='+script+'&model='+model+'&dataset='+datasetType);           

            }


        }).catch(err => console.log(err));
    
        }
    }
    
  
    console.log("category==",category);
    console.log("form error==",state.form_error);
    console.log("form error==",state);




  return (
    
     <div className="upload-dataset">
        <div className="zone">
        <div {...getRootProps()}>
            <input {...getInputProps()} />
                <div id="dropZ">
                    <div><i class="fa fa-cloud-upload"></i></div>
                    <input ref={(ref) => { this.uploadInput = ref; }} {...getInputProps()} />
                    {/* <span>{isDragActive ? "📂" : "📁"}</span> */}
                    {/* {!isDragActive && 'Click here or drop a file to upload!'} */}
                    {/* {isDragActive && !isDragReject && "Drop it like it's hot!"} */}
    

                    {!isDragActive &&
                    <div>
                        <div className="drop-text">
                            <span>
                                Drag your bands images
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
                        File type not accepted, Sorry!
                    </span>
                    
                    </div>
                    }

                    <div class="selectFile">       
                        <label for="file">Select file</label>                   
                            {/* <input type="file" name="files[]" id="file"/> */}
                    </div>
                    <div>
                        <span>
                            File size limit : 10 MB
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
                disabled={acceptedFiles.length<=0} 
            >Upload</button>
        </div>

        {state.form_error.length>0 && 
            <div class="form-error">
            <span className='error'>{state.form_error}</span>
            </div>
        } 
    </div>
 
  );
};
export default UploadBands;