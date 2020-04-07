import React from 'react';
import {Form,Button,Modal} from 'react-bootstrap';
import {connect} from 'react-redux';
import {auth} from '../actions';
import './login.css';

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            phone: "",
            agreement: false,
            formErrors: {
                firstname: "",
                lastname: "",
                username: "",
                password: "",
                confirmPassword: "",
                email: "",
                phone: "",
                agreement: ""
            },
            signUpSuccess: false
        }
    }

    openSignupModal = () => {
        this.setState({
            isOpen: true
        })
    }

    closeSignupModal = () => {
        this.resetState();
    }

    resetState = () => {
        this.setState({
            isOpen: false,
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            phone: "",
            agreement: false,
            formErrors: {
                firstname: "",
                lastname: "",
                username: "",
                password: "",
                confirmPassword: "",
                email: "",
                phone: "",
                agreement: ""
            },
            signUpSuccess: false
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.validateForm();
        console.log('sign up');
        if ( this.isFormValid() ){
            try{
                let res = await this.props.register(this.state.firstname, this.state.lastname, this.state.username, this.state.password, this.state.email, this.state.phone);
                // this.closeSignupModal();
                // await this.props.loadUser(this.state.username);
                console.log('register successful');
                this.setState({
                    signUpSuccess: true
                });
            }
            catch(err){
                console.error(err);
                alert(err.message);
            }
     
        }

       
    }

    isFormValid = () => {
        let valid = true;
        for(let field in this.state.formErrors ){
            if ( this.state.formErrors[field] !== "" ){
                valid = false;
            }
        }

        return valid;
    }

    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
      }

    validateForm = () => {
        let formErrors = this.state.formErrors;

        let firstname = this.state.firstname;
        formErrors.firstname = firstname.length === 0 ? "this field is required" : "";

        let lastname = this.state.lastname;
        formErrors.lastname = lastname.length === 0 ? "this field is required" : "";

        let username = this.state.username;
        formErrors.username = username.length === 0 ? "this field is required" : "";

        let password = this.state.password;
        if ( password.length === 0 ){
            formErrors.password =   "this field is required";
        }
        else {
            formErrors.password = "";
        }

        let confirmPassword = this.state.confirmPassword;
        if ( confirmPassword.length === 0 ){
            formErrors.confirmPassword =   "this field is required";
        }
        else if ( password.length > 0 && password !== confirmPassword ){
            formErrors.confirmPassword = "password does not match";
        }
        else {
            formErrors.confirmPassword = "";
        }

        let email = this.state.email;
        if ( email.length === 0 ){
            formErrors.email = "this field is required";
        }
        else if( !this.validateEmail(email) ){
            formErrors.email = "email is not correct";
        }
        else{
            formErrors.email = "";
        }

        let phone = this.state.phone;
        if ( phone.length === 0 ){
            formErrors.phone =  "this field is required";
        }
        else if ( phone.length !== 10 || isNaN(phone) ){
            formErrors.phone = "phone number should be 10 digits number";
        }
        else {
            formErrors.phone = "";
        }   

        let agreement = this.state.agreement;
        if ( agreement === false ){
            formErrors.agreement = "you must accept the agreement"
        }
        else {
            formErrors.agreement = "";
        }

        this.setState({
            formErrors: formErrors
        })
    }

    handleChange = e => {
        const { name,value } = e.target
        if ( name === "agreement" ){
            this.setState({
                agreement: e.target.checked
            });
        }
        else {
            this.setState({
                [name]: value
            })
        }
        
    }

    render(){
        if ( this.state.signUpSuccess ){
            return (
                <Modal show={this.state.isOpen} onHide={this.closeSignupModal}>
                    <Modal.Header closeButton>
                        <Modal.Title><span className="gradient-text">SIGNUP SUCCESSFUL</span></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>you can now log in.</p>
                    </Modal.Body>
                </Modal>
            );
        }

        return (
            <Modal show={this.state.isOpen} onHide={this.closeSignupModal}>
                <Modal.Header closeButton>
                    <Modal.Title><span className="gradient-text">SIGNUP</span></Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Control type="text" placeholder="FIRSTNAME" name="firstname"  onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.firstname}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="text" placeholder="LASTNAME" name="lastname"  onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.lastname}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="text" placeholder="USERNAME" name="username"  onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.username}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="password" placeholder="PASSWORD" name="password"  onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.password}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="password" placeholder="CONFIRM PASSWORD" name="confirmPassword"  onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.confirmPassword}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="text" placeholder="EMAIL" name="email"  onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.email}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="text" placeholder="PHONE NUMBER" name="phone" onChange={this.handleChange}/>
                            <p className="error-form-field">{this.state.formErrors.phone}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type="checkbox">
                                <Form.Check.Input name="agreement" type="checkbox" onChange={this.handleChange}/>
                                <Form.Check.Label>I agree to the <a href="#">terms and conditions</a>.</Form.Check.Label>
                            </Form.Check>
                            <p className="error-form-field">{this.state.formErrors.agreement}</p>
                        </Form.Group>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="gradient-button">
                            <span className="gradient-text">FINISH</span>
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      register: (firstname, lastname, username, password, email, phone) => dispatch(auth.register(firstname, lastname, username, password, email, phone)),
      loadUser: () => dispatch(auth.loadUser())
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(Signup);