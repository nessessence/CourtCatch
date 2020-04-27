import React from 'react';
import { connect } from 'react-redux';
import weekdays from '../constants/weekdays';
import { Link } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import './courts.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class MyBookingList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bookingList: null,
            filter: "all"
        };
    }

    componentDidMount(){
        let bookings = this.props.user.bookings;
        let bookingsSoon = [];
        let bookingsPassed = [];
        for( const booking of bookings ){
            if ( booking.is_active ){
                bookingsSoon.push(booking);
            }
            else {
                bookingsPassed.push(booking);
            }
        }
        this.setState({
            bookingList: bookingsSoon.concat(bookingsPassed),
            bookingListSoon: bookingsSoon,
            bookingListPassed: bookingsPassed
        })
    }

    pad = (n, width) => {
        let z ='0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }

    mapTime =(timeNum) => {
        timeNum = parseInt(timeNum);
        if ( timeNum % 2 === 0 ){
            return this.pad(timeNum/2,2) + ":00";
        }
        else {
            return this.pad((timeNum-1)/2,2) + ":30";
        }
    }

    filterBooks = (e) => {
        this.setState({
            filter: e.value
        });
    }

    render(){

        if ( this.state.bookingList == null ){
            return <h1>loading...</h1>
        }

        let bookingList = [];
        let filter = this.state.filter;
        let bookings = filter === "soon" ? this.state.bookingListSoon : 
            ( filter === "passed" ? this.state.bookingListPassed : this.state.bookingList )
        for(let i=0; i<bookings.length; ++i){
            let booking = this.state.bookingList[i];
            let court = booking.court;
            let card = (
                <Card key={"card-"+i} className={"court-item" + (booking.is_active ? " court-active":"")}>
                        <Row>
                            <Col sm="5">
                                <Card.Img variant="left" src={court.images[0] == null ? ImagePlaceholder : court.images[0].url} className="court-image"/>
                            </Col>
                            <Col sm="5">
                                <Card.Body className="text-left">
                                    <Card.Title>{court.name}</Card.Title>
                                    <Card.Text className="court-desc d-flex flex-column">
                                        <span className="text-secondary">{weekdays[booking.day_of_the_week]}</span>
                                        <span className="text-secondary">{this.mapTime(booking.start)+"-"+this.mapTime(booking.end)}</span>
                                        <span className="text-secondary">{ "court number: " + booking.court_number}</span>
                                        <span className="text-secondary">{booking.price + " bath"}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Col>
                            <Col sm="2" className="d-flex flex-column justify-content-between">
                                <span className={booking.is_active ? "text-success" : "text-secondary"}>{booking.is_active ? "soon" : "passed"}</span>
                                <span>rating: <span style={{color: "orange"}}>{court.avg_score.toFixed(1)}</span></span>
                            </Col>
                        </Row>
                    </Card>
            );
            if ( booking.is_active ){
                bookingList.push(
                    <Link key={"link-"+i} to={"/my_booking/"+booking.id} className="court-item-holder">
                        {card}
                    </Link>
                );
            }
            else {
                bookingList.push(card);
            }
            
        }

        const options = [
            'all', 'soon', 'passed', 
          ];
        const defaultOption = options[0];

        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>My Booking List</h1>
                    <div className="d-flex flex-row justify-content-end align-items-center my-4">
                        <span>Booking Status</span>
                        <Dropdown className="filter-dropdown ml-4" options={options} 
                            onChange={this.filterBooks} value={this.state.filter} 
                            placeholder="Select an option" />
                    </div>
                    {bookingList}
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
  
export default connect(mapStateToProps, null)(MyBookingList);

