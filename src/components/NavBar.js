import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {NavLink, Redirect} from 'react-router-dom'
import './navbar.css';

import Login from './Login';
import Signup from './Signup';
import Account from './Account';

import {connect} from 'react-redux';
import {auth} from '../actions';

class NavBar extends React.Component {
    constructor(props){
        super(props);
        this.loginRef = React.createRef();  // to be able to call Login's method
        this.signupRef = React.createRef(); // to be able to call Signup's method
        this.state = {
            redirect: false
        }
    }

    handleLogout = () => {
        this.props.logout();
        this.setState({
            redirect: true
        });
    }

    openSignupModal = () => {
        this.signupRef.current.openSignupModal();
    }

    render(){

        let authButtons = [];
        if ( !this.props.isAuthenticated ){
            authButtons.push(<span key="signup-modal" className="nav-button" onClick={()=>this.signupRef.current.openSignupModal()}>Sign Up</span>);
            authButtons.push(<span key="login-modal" className="nav-button" onClick={()=>this.loginRef.current.openLoginModal()}>Log In</span>);
        }
        else {
            authButtons.push(<span key="logout-button" className="nav-button" onClick={()=>this.handleLogout()}>Log Out</span>);
        }

        return (
            <Navbar className="primary-navbar" expand="lg">
                <Navbar.Brand><NavLink className="nav-button" exact to="/"><span style={{color: "white"}}>CourtCatch</span></NavLink></Navbar.Brand>
                {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                <div className="ml-auto">
                    <NavLink className="nav-button" activeClassName="nav-button-active" exact to="/about">About</NavLink>
                    <NavLink className="nav-button" activeClassName="nav-button-active" exact to="/contact">Contact</NavLink>
                    {/* <div className="auth-button-group"> */}
                    {authButtons}
                    <Signup ref={this.signupRef}/>
                    <Login ref={this.loginRef}/>
                    {/* </div> */}
                </div>
                {/* { this.state.redirect ? <Redirect to="/" /> : null} */}
                </Navbar>
        );
    }

}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
          return dispatch(auth.logout());
        }
      };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(NavBar);