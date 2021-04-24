import React from 'react';
import './Home.css';
import { withRouter } from 'react-router-dom';
function Home(props) {
    return(
        <div className="home">
            <div>
                <h2>A cloud platform for big geospatial data analysis</h2>
            </div>
        </div>
    )
}

export default withRouter(Home);