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
                            <Col sm="2">
                                <Card.Img variant="left" src={court.images[0] == null ? ImagePlaceholder : court.images[0].url} className="court-image"/>
                            </Col>
                            <Col sm="8">
                                <Card.Body className="text-left">
                                    <Card.Title>{court.name}</Card.Title>
                                    <Card.Text className="court-desc">{court.desc}</Card.Text>
                                </Card.Body>
                            </Col>
                            <Col sm="2" className="d-flex flex-column justify-content-between">
                                <span className={court.is_verified ? "text-success" : "text-warning"}>{court.is_verified ? "verified" : "pending"}</span>
                                <span>rating: <span style={{color: "orange"}}>{court.avg_score}</span></span>
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