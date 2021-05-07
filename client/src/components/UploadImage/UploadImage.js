import React from 'react'

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageURL: "",
        };
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    handleUploadImage(ev) {
        ev.preventDefault();
    
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        let url='/upload'
        fetch(url, {
            method: 'POST',
            body: data
        }).then( res => res.json())
        .then(data=>{
            this.setState({ imageURL: `http://localhost:5000/${data['path']}`});
            console.log(`http://localhost:5000/${data['path']}`);
          });

      }

    render() {
        return (
            <div className="login hv-center">
            <div className="card col-12 col-lg-3 hv-center">


          <form onSubmit={this.handleUploadImage} autoComplete="off">
          <div className="create-project-title">
                            <h4>CREATE NEW SCRIPT</h4>
                    </div>
            <div>
              <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
            </div>

              <button>Upload</button>

            <img src={this.state.imageURL} alt="img" />


            <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Script Title"
                        // onChange={handleChange}

                    />
                    </div>
                    <div className="form-group">
                    <textarea
                        className="form-control"
                        id="description"
                        cols="10" rows="5"
                        placeholder="Script Description"
                        // onChange={handleChange}

                    />
                    </div>
                    <div className="form-group create-project-button">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        // onClick={handleSubmit}
                    >Submit</button>
                    
                    </div>
                    {/* {state.errors.form.length > 0 && 
                                <div class="form-error">
                                <span className='error'>{state.errors.form}</span>
                                </div>
                    }  */}
                </form>
         </div>
         </div>

        );
      }
}

export default UploadImage;