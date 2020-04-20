import React from 'react';
import {connect} from 'react-redux';
import {court as courtActions} from '../actions';
import { Form, Row, Col, InputGroup, } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { ReactMic } from 'react-mic';
import { upload as uploadFileToS3 } from '../s3/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './search.css';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            rating: 0.0,
            start_time: "18",
            end_time: "24",
            searchByLocation: false,
            searchByName: false,
            lat: "",
            long: "",
            day_of_the_week: "-1",

            record: false,
            shouldSetText: false,
            speechText: "",
            loading_speech: false
        }
    }

    async componentDidMount(){
        // AOS.init();
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
        this.setState({
            shouldSetText: false
        })
        const { name,value } = e.target
        if ( name == "start_time" || name === "end_time" ){
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

    startRecording = () => {
        this.setState({
          record: true
        });
      }
    
      stopRecording = () => {
          console.log("stop recorind");
        this.setState({
          record: false,
          loading_speech: true
        });
      }
    
      onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
      }
    
      onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        const file = new File([recordedBlob.blob], this.props.user.username+".weba", { 'type' : 'audio/weba' });
        // // const file = new Blob(recordedBlob, { 'type' : 'audio/wav; codecs=0' });
        // // const file =  recordedBlob;
        // console.log(file);
        // recordedBlob.blob.name = "test.wav";
    
        this.uploadWav(file);
      }

    uploadWav = async (file) => {
        try{
            this.setState({
                uploading: true
            });
            let data = await uploadFileToS3(file, this.props.user.username + (new Date()).getTime() , "user_speech");
            console.log(data);
            console.log(data.location);
            let url = data.location;
            let res = await this.props.callSpeech(url, this.props.user.username);
            let transcript = res.transcript.trim();
            console.log(transcript);
            this.setState({
                shouldSetText: true,
                speechText: transcript,
                loading_speech: false
            })
        }
        catch(err){
            this.setState({
                uploading: false,
                shouldSetText: false,
                loading_speech: false
            })
            alert(err);
            console.error(err);
        }
    }

    render(){

        if ( this.state.searchByLocation ){

            const max_distance = 0.35 // about 4 km

            return <Redirect to={{
                pathname: "/court_res",
                search: "?rating="+this.state.rating+"&lat="+this.state.lat+"&long="+this.state.long+"&dist="+max_distance
                        +"&start_time="+this.state.start_time+"&end_time="+this.state.end_time + 
                        "&day_of_the_week=" + this.state.day_of_the_week
            }} />
        }
        
        if ( this.state.searchByName ){
            // return <Redirect to="/court_res" />
            return <Redirect to={{
                pathname: "/court_res",
                search: "?name="+this.state.name+"&rating="+this.state.rating
                    +"&start_time="+this.state.start_time+"&end_time="+this.state.end_time  + 
                    "&day_of_the_week=" + this.state.day_of_the_week
            }} />
        }

        return (
            <div className="app-content-inner" id="content-holder">
                    <div className="d-none">
                        <ReactMic
                        record={this.state.record}
                        className="sound-wave"
                        onStop={this.onStop}
                        onData={this.onData}
                        strokeColor="#000000"
                        channelCount={1}
                        backgroundColor="#FF4081"/>
                    </div>
                    <div className="search-control">
                        {/* <img className="search-background" src={require("../images/man6.png")} /> */}
                        <div className="text-right search-form">
                            <h1 data-aos="fade-up">Search</h1>
                            <div data-aos="fade-up" className="search-form-input col-md-6">
                                <Form.Group className="row">
                                    <Form.Label className="col-md-4">Name</Form.Label>
                                    <Form.Control className="col-md-6" value={this.state.shouldSetText ? this.state.speechText : this.state.name} type="text" name="name" onChange={this.handleChange} placeholder="enter court name..." />
                                    <FontAwesomeIcon className={"ml-1 speak-icon" + (this.state.loading_speech ? " fa-spin" : "" )}
                                        icon={this.state.loading_speech ? faSpinner : (this.state.record? faStop : faMicrophone )}
                                        onClick={this.state.loading_speech ? null : (this.state.record? this.stopRecording : this.startRecording )} />
                                </Form.Group>
                                <Form.Group className="row">
                                    <Form.Label className="col-md-4">min rating</Form.Label>
                                    <Form.Control className="col-md-6" max="5" min="0" type="number" name="rating" onChange={this.handleChange} placeholder="1.0" defaultValue={this.state.rating}></Form.Control>
                                </Form.Group>
                                <Form.Group className="row">
                                    <Form.Label className="col-md-4">start time</Form.Label>
                                    <Form.Control className="col-md-6" max="24" min="0" type="time" name="start_time" onChange={this.handleChange} defaultValue="09:00"></Form.Control>
                                </Form.Group>
                                <Form.Group className="row">
                                    <Form.Label className="col-md-4">end time</Form.Label>
                                    <Form.Control className="col-md-6" max="24" min="0" type="time" name="end_time" onChange={this.handleChange} defaultValue="12:00"></Form.Control>
                                </Form.Group>
                                <Form.Group className="row">
                                    <Form.Label className="col-md-4">day of the week</Form.Label>
                                    <Form.Control name="day_of_the_week" className="col-md-6" as="select" onChange={this.handleChange}>
                                        <option value="-1" defaultValue>any</option>
                                        <option value="0">monday</option>
                                        <option value="1">tuesday</option>
                                        <option value="2">wednesday</option>
                                        <option value="3">thrusday</option>
                                        <option value="4">friday</option>
                                        <option value="5">saturday</option>
                                        <option value="6">sunday</option>
                                    </Form.Control>
                                </Form.Group>
                                <div className="text-right">
                                    <button className="btn btn-primary" onClick={this.handleSearchByName}>search</button>
                                    <span className="mx-3">or</span>
                                    <button className="btn btn-primary" onClick={this.handleSearchByLocation}>search by my location</button>
                                </div>
                            </div>
                        </div>
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
        callSpeech: (url,username) => {
            return dispatch(courtActions.callSpeech(url,username));
        }
      };
}

  
export default connect(mapStateToProps, mapDispatchToProps)(Search);