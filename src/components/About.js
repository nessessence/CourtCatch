import React from 'react';
import CourtImg from '../images/court3.jpg';
import './about.css';

function About(){
    return (
        <div>
            <div className="court-image-control">
                <img src={CourtImg} />
                <h1>Connect People To Good Courts</h1>
            </div>
        </div>
        
    );
}

export default About;