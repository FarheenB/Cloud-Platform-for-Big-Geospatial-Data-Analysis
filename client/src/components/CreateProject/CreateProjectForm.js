import React from 'react';

export const Form = ({ handleChange, onSubmit, errors }) => {
  console.log("Form--"+errors)
  return (  
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="form-group validation">
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Project Title"
                onChange={handleChange}
              />
            </div>
            <div className='error-control'>
              {errors.length > 0 &&               
                <span className='error'>{errors}</span>
              } 
            </div>

            <div className="form-group">
              <textarea
                className="form-control"
                id="description"
                cols="10" rows="5"
                placeholder="Project Description"
                onChange={handleChange}

              />
            </div>
            <div className="form-group create-project-button">
              <button className="form-control btn btn-primary" type="submit" >
                Submit
              </button>
            </div>
        </form>
   
  );
};
export default Form;
