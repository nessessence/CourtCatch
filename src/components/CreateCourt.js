import React from 'react';
import { connect } from 'react-redux';
import {court} from '../actions';
import { Form, Modal, Spinner } from 'react-bootstrap';
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
            open: "",
            close: "",
            formErrors: {
                name: "",
                price: "",
                latitude: "",
                longtitude: "",
                courtCount: "",
                open: "",
                close: ""
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
                    this.state.latitude, this.state.longtitude, this.state.courtCount,
                    this.state.open, this.state.close);
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
            finally {
                this.setState({
                    isSubmiting: false
                })
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

        if ( !valid ){
            window.scrollTo(0,0);
        }

        return valid;
    }

    validateForm = () => {
        let formErrors = this.state.formErrors;

        let name = this.state.name;
        if ( name === "" ){
            formErrors.name = "this field is required";
        }
        else if ( name.length > 30 ){
            formErrors.name = "name should be equal to or less than 30 characters";
        }
        else {
            formErrors.name = "";
        }

        let price = this.state.price;
        if ( price === "" ){
            formErrors.price = "this field is required";
        }
        else if ( parseFloat(price) < 0 ){
            formErrors.price = "price must be larger than 0";
        }
        else {
            formErrors.price = "";
        }

        let desc = this.state.desc;
        if ( desc.length > 200 ){
            formErrors.desc = "description length musts be equal to or less than 200 characters";
        }
        else {
            formErrors.desc = "";
        }

        let courtCount = this.state.courtCount;
        if ( courtCount === "" ){
            formErrors.courtCount = "this field is required";
        }
        else if ( parseInt(courtCount) < 1 ){
            formErrors.courtCount = "court count must be larger than 0";
        }
        else {
            formErrors.courtCount = "";
        }

        let open = this.state.open;
        let close  = this.state.close;

        if ( open === "" ){
            formErrors.open = "this field is required";
        }
        else {
            formErrors.open = "";
        }

        if ( close === "" ){
            formErrors.close = "this field is required";
        }
        else {
            formErrors.close = "";
        }

        if ( parseInt(open) >= parseInt(close) ){
            formErrors.close = "open and close time are invalid.";
        }

        this.setState({
            formErrors: formErrors
        })
    }

    handleChange = e => {
        this.setState({
            shouldSetText: false
        })
        const { name,value } = e.target
        if ( name == "open" || name === "close" ){
            let res = value.split(":");
            let time = parseInt(res[0]) * 2 + (parseInt(res[1]) >= 30 ? 1 : 0 );
            this.setState({
                [name]: time.toString()
            });
        }
        else {
            this.setState({
                [name]: value
            });
        }
       
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
                            <div className="text-right">
                                <span className="text-secondary">{this.state.desc.length + "/200"}</span>
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Court Count</Form.Label>
                            <Form.Control type="number" name="courtCount" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.courtCount}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>open time</Form.Label>
                            <Form.Control type="time" name="open" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.open}</p>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>close time</Form.Label>
                            <Form.Control type="time" name="close" onChange={this.handleChange}></Form.Control>
                            <p className="error-form-field">{this.state.formErrors.close}</p>
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
                            {this.state.isSubmiting ? (<Spinner className="mx-3" animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>) : null}
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
        createCourt: (name,price,desc,lat,lng,count,open,close) => {
          return dispatch(court.createCourt(name,price,desc,lat,lng,count,open,close));
        },
      };
}

export default connect(null, mapDispatchToProps)(CreateCourt);