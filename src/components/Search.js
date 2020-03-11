import React from 'react';
import {connect} from 'react-redux';
import {court as courtActions} from '../actions';
import { Form, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            rating: 0.0,
            start_time: "06.00",
            end_time: "23.59",
            searchByLocation: false,
            searchByName: false,
            lat: "",
            long: ""
        }
    }

    async componentDidMount(){
        // try{
        //     let courts = await this.props.loadCourts();
        //     this.setState({
        //         courts: courts
        //     })
        // }
        // catch(err){
        //     alert(err)
        // }
        
    }

    handleSearchByLocation =  () => {
        console.log('handle search by location');
            const location = window.navigator && window.navigator.geolocation
            
            if (location) {
              location.getCurrentPosition((position) => {
                  let lat = position.coords.latitude;
                  let long = position.coords.longitude;
                  this.setState({
                      searchByLocation:true,
                      lat: lat,
                      long: long
                  })
              }, (error) => {
                  alert("cannot get your geolocation");
                  this.setState({
                      searchByLocation: false
                  })
              })
            }
        
          
    }

    handleSearchByName =  () => {
        console.log('handle search');   
        this.setState({
            searchByName: true
        })
    }

    handleChange = e => {
        const { name,value } = e.target
        this.setState({
            [name]: ( name === "start_time" || name === "end_time" ) ? value.replace(":",".") : value 
        })
    }

    render(){

        if ( this.state.searchByLocation ){

            const max_distance = 0.24 // about 4 km

            return <Redirect to={{
                pathname: "/court_res",
                search: "?rating="+this.state.rating+"&lat="+this.state.lat+"&long="+this.state.long+"&dist="+max_distance
                        +"&start_time="+this.state.start_time+"&end_time="+this.state.end_time
            }} />
        }
        
        if ( this.state.searchByName ){
            // return <Redirect to="/court_res" />
            return <Redirect to={{
                pathname: "/court_res",
                search: "?name="+this.state.name+"&rating="+this.state.rating
                    +"&start_time="+this.state.start_time+"&end_time="+this.state.end_time  
            }} />
        }

        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>Search</h1><br /><br /><br />
                    <div className="d-inline-block text-left" style={{width: "500px"}}>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">Name</Form.Label>
                            <Form.Control className="col-md-9" type="text" name="name" onChange={this.handleChange} placeholder="enter court name..."></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3 ">min rating</Form.Label>
                            <Form.Control className="col-md-9" max="5" min="0" type="number" name="rating" onChange={this.handleChange} placeholder="1.0" defaultValue={this.state.rating}></Form.Control>
                        </Form.Group>
                        {/* <Form.Group className="row">
                            <Form.Label className="col-md-3">start time</Form.Label>
                            <Form.Control className="col-md-9" max="24" min="0" type="time" name="start_time" onChange={this.handleChange} defaultValue="06:00"></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-md-3">end time</Form.Label>
                            <Form.Control className="col-md-9" max="24" min="0" type="time" name="end_time" onChange={this.handleChange} defaultValue="23:59"></Form.Control>
                        </Form.Group> */}
                        <div className="text-right">
                            <button className="btn btn-primary" onClick={this.handleSearchByName}>search</button>
                            <span className="mx-3">or</span>
                            <button className="btn btn-primary" onClick={this.handleSearchByLocation}>search by my location</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        );

    }
}

export default  Search;