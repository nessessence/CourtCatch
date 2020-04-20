import React from 'react';
import Logo from '../logo.svg';
import courtImage from '../images/court3.jpg';
import './home.css';
import { Row, Col } from 'react-bootstrap';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon}  from '@fortawesome/react-fontawesome';

class Home extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
                <div className="container top-main">
                    <div className="text-control">
                        <h1 data-aos="fade-right" data-aos-delay="100">Looking</h1>
                        <h1 data-aos="fade-right" data-aos-delay="200">For a</h1>
                        <h1 data-aos="fade-right" data-aos-delay="300">Badminton Court?</h1>
                        <p data-aos="fade-right" data-aos-delay="400">CourtCatch is the easiest way to find badminton courts. Booking a badminton court will only take a few seconds.</p>
                        <button  data-aos="fade-right" data-aos-delay="500" className="book-now"
                            onClick={this.props.showSignup}
                        >
                            FIND COURTS
                            <FontAwesomeIcon className="ml-3" icon={faChevronRight} />
                        </button>
                    </div>
                    <img data-aos="fade-up" src={require("../images/man5.png")}/>
                </div>
        );
    }

}

export default Home;