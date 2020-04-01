import React from 'react';
import {auth} from '../actions';
import {connect} from 'react-redux';
import {Navbar} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './secondary_navbar.css';

class SecondaryNavBar extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        if ( this.props.user === null ){
            return null;
        }

        return (
            <div className="secondary-navbar shadow-sm" expand="lg">
                <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/search">Search</NavLink>
                <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/my_courts">My Courts</NavLink>
                {
                    this.props.user.is_verified ? 
                    <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/add_court">Add Court</NavLink>
                    : <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/become_a_provider">Become A Provider</NavLink>
                }
                <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/history">History</NavLink>
                <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/profile">Profile</NavLink>
                <NavLink className="sec-nav-button nav-button" activeClassName="sec-nav-button-active" exact to="/topup">Top Up</NavLink>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
          return dispatch(auth.logout());
        }
      };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryNavBar);