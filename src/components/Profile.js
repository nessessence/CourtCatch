import React from 'react';
import { connect } from 'react-redux';
import {auth} from '../actions';
import './profile.css';
import ProfileImg from './profile.png';
import { Form, Button, Row, Col, Jumbotron } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import ChangePassword from './ChagePassword';

class Profile extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="app-content-inner">
                <h1>Personal Info</h1>
                <Jumbotron fluid >
                    <div className="container">
                        <Row>
                            <Col sm="4">
                                <div className="profile-image-container">
                                    <img className="profile-large" src={ProfileImg} />
                                </div>
                            </Col>
                            <Col className="text-left">
                                <br />
                                <h3>{this.props.user.username}</h3>
                                <br />
                                <p>first name:&emsp;{this.props.user.first_name}</p>
                                <p>last name:&emsp;{this.props.user.last_name}</p>
                                <p>email:&emsp;{this.props.user.email}</p>
                                <p>phone number:&emsp;{this.props.user.phone_number}</p>
                                <br />
                                <br />
                                <NavLink className="btn btn-primary" exact to="/profile/change_password">Change Password</NavLink>
                            </Col>
                        </Row>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    };
}
  
export default connect(mapStateToProps, null)(Profile);