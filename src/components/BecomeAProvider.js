import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import './become_a_provider.css';
import ImagePlaceholder from "../images/imagePlaceholder.jpg";
import FrontCID from '../images/frontCID.jpg';
import FaceWithCID from '../images/faceWithCID.jpg';
import { court as CourtActions } from '../actions';
import { connect } from 'react-redux';
import {upload as uploadFileToS3} from '../s3';


class BecomeAProvider extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            thaiFirstName: "",
            thaiLastName: "",
            dob: "",
            cid: "",
            cbid: "",
            occupation: "",
            residentialAddress: "",
            resgisteredAddress: "",
            photoHoldingCID: "",
            photoHoldingIC: "",
            photoHoldingCIDPreviewUrl: "",
            photoHoldingICPreviewUrl: "",
            formErrors: {
                thaiFirstName: "",
                thaiLastName: "",
                dob: "",
                cid: "",
                cbid: "",
                occupation: "",
                residentialAddress: "",
                resgisteredAddress: "",
                photoHoldingCID: "",
                photoHoldingIC: ""
            },

            isSubmitting: false
        }
    }

    async componentDidMount(){

    }

    openModal = () => {
        this.setState({
            isOpen: true
        });
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        });
    }

    handleChange = e => {
        const { name,value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.validateForm();

        if ( this.isFormValid() ){
            this.setState({
                isSubmitting: true
            });

            try{

                let cidres = await uploadFileToS3(this.state.photoHoldingCID, this.props.user.username + "_cid_" + (new Date()).getTime(), "bap_docs");
                let holdCIDUrl = cidres.location;
                console.log("uploaded cid photo");
                let icres = await uploadFileToS3(this.state.photoHoldingIC, this.props.user.username + "_ic_" + (new Date()).getTime(), "bap_docs");
                let holdingICUrl = icres.location;
                console.log("uploaded ic photo");

                await this.props.callBecomeAProvider({
                    thai_first_name: this.state.thaiFirstName,
                    thai_last_name: this.state.thaiLastName,
                    date_of_birth: this.state.dob,
                    cid: this.state.cid,
                    cbid: this.state.cbid,
                    current_occupation: this.state.occupation,
                    residential_address: this.state.residentialAddress,
                    registered_address: this.state.resgisteredAddress,
                    holding_cid_url: holdCIDUrl,
                    ic_url: holdingICUrl
                });

                alert("success");
                window.location.reload();
            }
            catch(err){
                alert(err.response.data.message);
                console.error(err)
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

    validateForm = () => {
        let formErrors = this.state.formErrors;

        formErrors.thaiFirstName = this.state.thaiFirstName === "" ? "this field is required" : "";
        formErrors.thaiLastName = this.state.thaiLastName === "" ? "this field is required" : "";
        formErrors.dob = this.state.dob === "" ? "this field is required" : "";
        
        let cid = this.state.cid;
        if ( cid === "" ){
            formErrors.cid = "this field is required";
        }
        else if ( isNaN(cid) || (cid+"").length !== 13 ){
            formErrors.cid = "Citizen ID must be 13 digits number";
        }
        else {
            formErrors.cid = "";
        }

        formErrors.cbid = this.state.cbid === "" ? "this field is required" : "";
        formErrors.occupation = this.state.occupation === "" ? "this field is required" : "";
        formErrors.residentialAddress = this.state.residentialAddress === "" ? "this field is required" : "";
        formErrors.resgisteredAddress = this.state.resgisteredAddress === "" ? "this field is required" : "";
        formErrors.photoHoldingCID = this.state.photoHoldingCID === "" ? "this field is required" : "";
        formErrors.photoHoldingIC = this.state.photoHoldingIC === "" ? "this field is required" : "";

        this.setState({
            formErrors: formErrors
        });

    }

    handleImageChange = (e) => {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
        let name = e.target.name;
    
        reader.onloadend = () => {
          this.setState({
            [name]: file,
            [name + "PreviewUrl"]: reader.result
          });
        }
    
        reader.readAsDataURL(file)
      }

    render(){

        if ( !this.props.user.is_verified && this.props.user.documents.length > 0 ){
            return (
                <div className="app-content-inner">
                    <div className="container">
                        <h1>You have already submitted the form. Your form will soon be checked.</h1>
                    </div>
                </div>
            );
        }

        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>Become A Provider</h1>
                    <br />
                    <Form className="text-right" onSubmit={this.handleSubmit}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">First Name in Thai</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="thaiFirstName" type="text" placeholder="Set First Name in Thai"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.thaiFirstName}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Last Name in Thai</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="thaiLastName" type="text" placeholder="Set Last Name in Thai"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.thaiLastName}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Date Of Birth</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="dob" type="date" placeholder="Set date of birth"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.dob}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Citizen ID</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="cid" type="text" placeholder="EG. 1100145647124"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.cid}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Codes behind ID card(12 digits)</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="cbid" type="text" placeholder="EG. AB0123456789"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.cbid}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Current Occupation</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="occupation" type="text" placeholder="Set Occupation"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.occupation}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Residential Address(Currently residing in)</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="residentialAddress" type="text" placeholder="Set Residential Address"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.residentialAddress}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Registered Address(On your Thai Citizen ID)</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleChange} name="resgisteredAddress" type="text" placeholder="Set Registered Address"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.resgisteredAddress}</p>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Photo of you holding your Citizen ID</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleImageChange} name="photoHoldingCID" type="file"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.photoHoldingCID}</p>
                                <div className="d-flex flex-col justify-content-between">
                                    <img id="facecid-placeholder" className="upload-image" src={this.state.photoHoldingCID === "" ? ImagePlaceholder : this.state.photoHoldingCIDPreviewUrl} />
                                    <img className="upload-image" src={FaceWithCID} />
                                </div>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">Photo of your IC</Form.Label>
                            <Col>
                                <Form.Control onChange={this.handleImageChange} name="photoHoldingIC" type="file"></Form.Control>
                                <p className="error-form-field">{this.state.formErrors.photoHoldingIC}</p>
                                <div className="d-flex flex-col justify-content-between">
                                    <img id="cid-placeholder" className="upload-image" src={this.state.photoHoldingIC === "" ? ImagePlaceholder : this.state.photoHoldingICPreviewUrl} />
                                    <img className="upload-image" src={FrontCID} />
                                </div>
                            </Col>
                        </Form.Group>
                        <div className="text-right" style={{marginTop: "60px"}}>
                            <button type="submit" className="gradient-button">
                                <span className="gradient-text">SUBMIT</span>
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.auth.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        callBecomeAProvider: (data) => {
            return dispatch(CourtActions.callBecomeAProvider(data));
        },
      };
}
  
export default connect(mapStateToProps, mapDispatchToProps)(BecomeAProvider);