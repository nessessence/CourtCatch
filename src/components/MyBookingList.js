import React from 'react';
import { connect } from 'react-redux';
import weekdays from '../constants/weekdays';
import { Link } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import ImagePlaceholder from '../images/imagePlaceholder.jpg';
import './mycourt.css';

class MyBookingList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bookingList: null
        };
    }

    componentDidMount(){
        this.setState({
            bookingList: this.props.user.bookings
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
            return this.pad(timeNum/2,2) + ":30";
        }
    }

    render(){

        if ( this.state.bookingList == null ){
            return <h1>loading...</h1>
        }

        let bookingList = [];
        for(let i=0; i<this.state.bookingList.length; ++i){
            let booking = this.state.bookingList[i];
            let court = booking.court;
            let card = (
                <Card key={"card-"+i} className="court-item">
                        <Row>
                            <Col sm="2">
                                <Card.Img variant="left" src={court.images[0] == null ? ImagePlaceholder : court.images[0].url} className="court-image"/>
                            </Col>
                            <Col sm="8">
                                <Card.Body className="text-left">
                                    <Card.Title>{court.name}</Card.Title>
                                    <Card.Text className="court-desc">
                                        <span className="mr-3">{weekdays[booking.day_of_the_week]}</span>
                                        <span className="mx-3">{this.mapTime(booking.start)+"-"+this.mapTime(booking.end)}</span>
                                        <span className="mx-3">{ "court number: " + booking.court_number}</span>
                                        <span className="mx-3">{booking.price + " bath"}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Col>
                            <Col sm="2" className="d-flex flex-column justify-content-between">
                                <span className={court.is_verified ? "text-success" : "text-warning"}>{booking.is_active ? "เร็วๆนี้" : "ผ่านไปแล้ว"}</span>
                                <span>rating: <span style={{color: "orange"}}>{court.avg_score.toFixed(1)}</span></span>
                            </Col>
                        </Row>
                    </Card>
            );
            if ( booking.is_active ){
                bookingList.push(
                    <Link key={"link-"+court.name} to={"/my_booking/"+booking.id} className="court-item-holder">
                        {card}
                    </Link>
                );
            }
            else {
                bookingList.push(card);
            }
            
        }

        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>My Booking List</h1>
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

