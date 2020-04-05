import React from 'react'
import {court} from '../actions';
import { connect } from 'react-redux';
import './mycourt.css';
import { Card, Col, Row } from 'react-bootstrap';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import { Link } from 'react-router-dom';

class Courts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loadFinish: false,
            courts: null,
            start_time: null,
            end_time: null
        }
    }

    async componentDidMount() {
        let queryParams = this.props.location.search;
        let arr = queryParams.split("&");
        let start_time, end_time;

        for(let i=0; i<arr.length; ++i){
            if ( arr[i].includes("start_time") ){
                start_time = arr[i].split("=")[1];
            }
            else if ( arr[i].includes("end_time") ){
                end_time = arr[i].split("=")[1];
            }
        }

        let res = await this.props.searchCourts(queryParams);
        console.log(res);
        this.setState({
            courts: res,
            start_time,
            end_time
        });
    }

    render(){
        console.log("courts render");

        let courtComponents = [];

        let searchTime = "?start_time=" + this.state.start_time + "&end_time=" + 
                this.state.end_time;
        
        for(let index in this.state.courts ){
            let court = this.state.courts[index];
            courtComponents.push(
                <Link key={"link-"+court.name} to={{ pathname:"/booking/"+court.name, search: searchTime}} className="court-item-holder">
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
                                <span>rating: <span style={{color: "orange"}}>{court.avg_score.toFixed(1)}</span></span>
                            </Col>
                        </Row>
                    </Card>
                </Link>
            );
        }

        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>Search Results</h1>
                    {courtComponents}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        searchCourts: (queryParams) => {
            return dispatch(court.searchCourts(queryParams));
        }
      };
}

export default connect(null, mapDispatchToProps)(Courts);