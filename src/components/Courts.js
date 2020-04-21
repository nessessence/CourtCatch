import React from 'react'
import {court} from '../actions';
import { connect } from 'react-redux';
import './courts.css';
import { Card, Col, Row } from 'react-bootstrap';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class Courts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loadFinish: false,
            courts: null,
            start_time: null,
            end_time: null,
            day_of_the_week: null,
            filter: "rating",
            filterMode: "descending"
        }
    }

    async componentDidMount() {
        let queryParams = this.props.location.search;
        let arr = queryParams.split("&");
        let start_time, end_time, day_of_the_week;

        for(let i=0; i<arr.length; ++i){
            if ( arr[i].includes("start_time") ){
                start_time = arr[i].split("=")[1];
            }
            else if ( arr[i].includes("end_time") ){
                end_time = arr[i].split("=")[1];
            }
            else if ( arr[i].includes("day_of_the_week") ){
                day_of_the_week = arr[i].split("=")[1];
            }
        }

        let res = await this.props.searchCourts(queryParams);
        console.log(res);
        this.setState({
            courts: res,
            start_time,
            end_time,
            day_of_the_week
        });
    }

    changeFilter = (e) => {
        console.log("change filter");
        this.sortCourts(e.value, this.state.filterMode);
    }

    changeFilterMode = e => {
        console.log("change filter mode")
        this.sortCourts(this.state.filter, e.value);
    }

    sortCourts = (filter,filterMode) => {
        let courts = this.state.courts;
        console.log(courts);
        courts.sort((back,front) => {

            let logic;
            if ( filter === "name" ){
                console.log("filter name")
                logic = back.name > front.name;
            }
            else if ( filter === "rating" ){
                console.log("filter rating")
                logic = back.avg_score > front.avg_score;
            }
            else {
                console.log("filter price")
                logic = back.price > front.price;
            }
    
            if ( filterMode === "descending" ){
                console.log("filter mode descending")
                logic = !logic;
            }
            else {
                console.log("filter mode ascending")
            }
            if ( logic ) return 1;
            return -1;
        });

        console.log(courts)
        
        this.setState({
            courts,
            filter,
            filterMode
        });
    }

    render(){
        console.log("courts render");

        let courtComponents = [];

        let searchTime = "?start_time=" + this.state.start_time + "&end_time=" + 
                this.state.end_time + "&day_of_the_week=" + this.state.day_of_the_week;
        
        for(let index in this.state.courts ){
            let court = this.state.courts[index];
            courtComponents.push(
                <Link key={"link-"+court.name} to={{ pathname:"/booking/"+court.name, search: searchTime}} className="court-item-holder">
                    <Card className="court-item">
                        <Row style={{height: "100%"}}>
                            <Col sm="5">
                                <Card.Img variant="left" src={court.images[0] == null ? ImagePlaceholder : court.images[0].url} className="court-image"/>
                            </Col>
                            <Col sm="5" className="text-left d-flex flex-column justify-content-between">
                                <div style={{marginTop: "10px"}}>
                                    <h4>{court.name}</h4>
                                    <p className="court-desc text-secondary">{court.desc}</p>
                                </div>
                                <p className=" text-secondary">{court.price} bath/hr</p>
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
            courtComponents = <h1>No search results found.</h1>
        }

        
        const filterOptions = [
            'name', 'rating', 'price', 
        ];

        const filterModeOptions = [
            'ascending', 'descending', 
        ];


        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>Search Results</h1>
                    <div className="d-flex flex-row justify-content-end align-items-center my-4">
                        <span>Sort By</span>
                        <Dropdown className="filter-dropdown ml-4" options={filterOptions} 
                            onChange={this.changeFilter} value={this.state.filter} 
                            placeholder="Select an option" />
                        <Dropdown className="filter-dropdown ml-4" options={filterModeOptions} 
                        onChange={this.changeFilterMode} value={this.state.filterMode} 
                        placeholder="Select an option" />
                    </div>
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