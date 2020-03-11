import React from 'react';
import { connect } from 'react-redux';
import {court} from '../actions';
import { Form, Modal } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import { Redirect } from 'react-router-dom';

import { gmApiKey} from '../private/keys';

class CreateCourt extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            price: "",
            desc: "",
            latitude: 13.7563,
            longtitude: 100.5018,
            courtCount: "",
            marker: null,
            formErrors: {
                name: "",
                price: "",
                latitude: "",
                longtitude: "",
                courtCount: "",
            },
            maps: null,
            isSubmiting: false,
            created: false
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.validateForm();

        if ( this.isFormValid() ){
            try {
                this.setState({
                    isSubmiting: true
                });
                try {
                    let data = await this.props.createCourt(this.state.name, this.state.price, this.state.desc,
                    this.state.latitude, this.state.longtitude, this.state.courtCount);
                }
                catch(err){
                    alert(err.response.data.message);
                    return ;
                }

                this.setState({
                    name: "",
                    price: "",
                    desc: "",
                    isSubmiting: false,
                    created: true
                });
                return (
                    <Modal>
                        <Modal.Title>adsasdasdasd</Modal.Title>
                    </Modal>
                );
            }
            catch(err){
                this.setState({
                    isSubmiting: false
                });
                alert(err);
            }
        }
    }

    isFormValid = () => {
        let valid = true;
        for(let field in this.state.formErrors){
            if ( this.state.formErrors[field] !== "" ){
                valid = false;
            }
        }

        return valid;
    }

    validateForm = () => {
        let formErrors = this.state.formErrors;

        let name = this.state.name;
        if ( name === "" ){
            formErrors.name = "this field is required";
        }
        else {
            formErrors.name = "";
        }

        let price = this.state.price;
        if ( price === "" ){
            formErrors.price = "this field is required";
        }
        else {
            formErrors.price = "";
        }

        let courtCount = this.state.courtCount;
        if ( courtCount === "" ){
            formErrors.courtCount = "this field is required";
        }
        else if ( parseInt(courtCount) < 1 ){
            formErrors.courtCount = "input is invalid";
        }
        else {
            formErrors.courtCount = "";
        }

        this.setState({
            formErrors: formErrors
        })
    }

    handleChange = e => {
        const { name,value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleLocationChange = ({ position }) => {
 
        this.setState({
            latitude: position.lat,
            longtitude: position.lng
        });
    }

    handleApiLoaded = (map, maps) => {
        let marker = new maps.Marker({
            position: {
                lat: this.state.latitude,
                lng: this.state.longtitude
            },
            map,
          });
          this.setState({
              marker: marker,
              maps: maps
          });
          console.log(marker);
    };

   _onClick = (obj) => { 
       console.log(obj.x, obj.y, obj.lat, obj.lng, obj.event);

        let latitude = obj.lat;
        let longtitude = obj.lng;

       let maps = this.state.maps;
       let marker = this.state.marker;

       marker.setPosition(new maps.LatLng(latitude, longtitude));
       this.setState({
           latitude: latitude,
           longtitude: longtitude,
           marker: marker
       });
       
    }

    render(){
        if ( this.state.created ){
            return <Redirect to={"/my_courts/"+this.state.name} />
        }
        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>Add New Court</h1>
                    <Form onSubmit={this.handleSubmit} className="text-left">
                        <Form.Group>
                            <Form.Label>Court Name</Form.Label>
                            <Form.Control name="name" type="text" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.name}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Court Price</Form.Label>
                            <Form.Control name="price" type="number" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.price}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Court Description</Form.Label>
                            <textarea name="desc" className="form-control" row="2" onChange={this.handleChange} placeholder="type something descripes your court"></textarea>
                            <p className="error-form-field">{this.state.formErrors.desc}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Court Count</Form.Label>
                            <Form.Control type="number" name="courtCount" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.courtCount}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Court Position</Form.Label>
                            <p className="text-secondary">latitude: <span>{this.state.latitude}</span></p>
                            <p className="text-secondary">longtitude: <span>{this.state.longtitude}</span></p>
                            <div style={{width: "100%", height: "600px"}}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: gmApiKey }}
                                    defaultZoom={11}
                                    center={{lat: this.state.latitude, lng: this.state.longtitude}}
                                    yesIWantToUseGoogleMapApiInternals
                                    onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                                    onClick={this._onClick}
                                    >
                                       
                                </GoogleMapReact>
                            </div>
                            </Form.Group>
                        <div className="text-right">
                            {/* <button type="submit" className="gradient-button">
                                <span className="gradient-text">SUBMIT</span>
                            </button> */}
                            <button className="btn btn-primary" disabled={this.state.isSubmiting}>Add</button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        createCourt: (name,price,desc,lat,lng,count) => {
          return dispatch(court.createCourt(name,price,desc,lat,lng,count));
        },
      };
}

export default connect(null, mapDispatchToProps)(CreateCourt);