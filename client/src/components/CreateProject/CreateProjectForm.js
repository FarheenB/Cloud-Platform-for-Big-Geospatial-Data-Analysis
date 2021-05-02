import React from 'react';

export const Form = ({ handleChange, onSubmit, errors, closeModal }) => {
  return (
            
        <form onSubmit={onSubmit}>
        <div className="create-project-title">
                  <h4>CREATE NEW PROJECT</h4>
              </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Project Title"
            onChange={handleChange}

          />
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
        {errors.length > 0 && 
                    <div class="form-error">
                    <span className='error'>{errors}</span>
                    </div>
        } 
    </form>


  );
};
export default Form;
