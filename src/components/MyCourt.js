import React from 'react';
import {court as courtAction} from '../actions';
import{connect} from 'react-redux';
import { loadMyCourt } from '../actions/court';
import { Card, Col, Row } from 'react-bootstrap';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import './mycourt.css';
import { Redirect, Link } from 'react-router-dom';

class MyCourt extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            courts: null,
            loadFinish: false
        }
    }

    async componentDidMount(){
        try {
            let courts = await this.props.loadMyCourt();
            console.log(courts);
            this.setState({
                courts: courts,
                loadFinish: true
            });
        }
        catch(e){
            this.setState({
                courts: [],
                loadFinish: true
            })
        }
    }

    pad = (n, width) => {
        let z ='0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }

    mapTime =(timeNum) => {
        timeNum = parseInt(timeNum);
        if ( timeNum % 2 === 0 ){
            return this.pad(timeNum/2,2) + ":00 น.";
        }
        else {
            return this.pad(timeNum/2,2) + ":30 น.";
        }
    }

    render(){
        if ( !this.state.loadFinish ){
            return null;
        }

        let courtComponents = [];
        
        for(let index in this.state.courts ){
            let court = this.state.courts[index];
            courtComponents.push(
                <Link key={"link-"+court.name} to={"/booking/"+court.name+"/"} className="court-item-holder">
                    <Card className="court-item">
                        <Row>
                            <Col sm="5">
                                <Card.Img variant="left" src={court.images[0] == null ? ImagePlaceholder : court.images[0].url} className="court-image"/>
                            </Col>
                            <Col sm="5" className="text-left d-flex flex-column justify-content-between">
                                <div style={{marginTop: "10px"}}>
                                    <h4>{court.name}</h4>
                                    <p className="court-desc text-secondary">{court.desc}</p>
                                </div>
                                <p className=" text-secondary">
                                    <span className="mr-3">{court.price} bath/hr</span>
                                    <span className="mr-3">{"open: " + this.mapTime(court.open)}</span>
                                    <span className="mr-3">{"close: " + this.mapTime(court.close)}</span>
                                </p>
                            </Col>
                            <Col sm="2" className="d-flex flex-column justify-content-between">
                                <span className={court.is_verified ? "text-success" : "text-warning"}>{court.is_verified ? "verified" : "pending"}</span>
                                <span>rating: <span style={{color: "orange"}}>{court.reviews.length > 0 ? court.avg_score.toFixed(1) : "unrated"}</span></span>
                            </Col>
                        </Row>
                    </Card>
                </Link>
            );
        }

        if ( courtComponents.length === 0 ){
            courtComponents = <h1 className="text-danger mt-4">You dont have any court.</h1>
        }

        return (
           <div className="app-content-inner">
               <div className="container">
                    <h1>My Courts</h1>
                    {courtComponents}
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
        loadMyCourt: () => dispatch(courtAction.loadMyCourt())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCourt);