import React from 'react';
import { connect } from 'react-redux';
import './court.css';
import weekdays from '../constants/weekdays';
import {Row, Col, Form, Table} from 'react-bootstrap';
import {court as courtActions, auth as authActions} from '../actions';
import { Redirect, Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

class MyBooking extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            booking: null,
            rackets: null,
            shuttlecocks: null,
            loadFinish: false,
            reservedRackets: null,
            orderedShuttlecocks: null,
            requesting: false,
            shouldRedirect: false,
            shouldRedirectMain: false
        }
    }

    async componentDidMount(){

        let bookingList = await this.props.getUserInfo(this.props.user.username);
        bookingList = bookingList.bookings;
        let bookingID = this.props.match.params.bookingID;
        let booking; 
        for(let i=0; i<bookingList.length; ++i){
            if ( bookingList[i].id+"" === bookingID ){
                booking = bookingList[i];
                break;
            }
        }

        if ( booking == null ){
            this.setState({
                shouldRedirectMain: true
            });
        }
        else {
            let rackets = await this.props.loadRackets(booking.id);
            let shuttlecocks = await this.props.loadShuttlecock(booking.id);

            this.setState({
                loadFinish: true,
                booking: booking,
                rackets: rackets,
                shuttlecocks: shuttlecocks,
                reservedRackets: booking.racket_bookings,
                orderedShuttlecocks: booking.shuttlecock_bookings
            });
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
            return this.pad(timeNum/2,2) + ":00";
        }
        else {
            return this.pad(timeNum/2,2) + ":30";
        }
    }

    handleChange = e => {
        const { name,value } = e.target
        this.setState({
            [name] : value
        })
    }

    handleReserveRacket = async (racketID) => {
        this.setState({
            requesting: true
        })
        try{
            await this.props.reserveRacket(this.state.booking.id, racketID);
            // alert("racket reservation success");
            window.location.reload();
        }
        catch(err){
            alert("something went wrong, please try again later.");
        }
    }

    handleReserveShuttlecock = async () => {
        this.setState({
            requesting: true
        })
        let toBuyShuttlecocks = [];
        for(let i=0; i<this.state.shuttlecocks.length; ++i){
            let shuttlecock = this.state.shuttlecocks[i];
            let id = shuttlecock.id;
            let count = this.state["shuttlecock_" + shuttlecock.name];
            if ( !isNaN(count) ){
                toBuyShuttlecocks.push({id, count});
            }
        }
        if ( toBuyShuttlecocks.length === 0 ){
            alert("enter shuttlecock amount to buy");
            return;
        }

        try{
            for(let i=0; i<toBuyShuttlecocks.length; ++i){
                let shuttlecock = toBuyShuttlecocks[i];
                await this.props.buyShuttlecock(this.state.booking.id, shuttlecock.id, shuttlecock.count);
            }
            // alert("buy shuttlecock success");
            window.location.reload();
        }
        catch(err){
            alert(err.response.data.message);
            console.error(err);
        }
        
    }

    handleCancelRacket = async (racketID) => {
        this.setState({
            requesting: true
        })
        try{
            await this.props.cancelRacket(racketID);
            // alert("cancel racket reservation success.");
            window.location.reload();
        }
        catch(err){
            alert(err.response.data.message);
            console.error(err);
        }
    }

    handleCancelShuttlecock = async (shuttlecockID) => {
        this.setState({
            requesting: true
        });
        try{
            await this.props.cancelShuttlecock(shuttlecockID);
            // alert("cancel shuttlecock order success.");
            window.location.reload();
        }
        catch(err){
            alert(err.response.data.message);
            console.error(err);
        }
    }

    handleCancelCourt = async () => {
        this.setState({
            requesting: true
        });

        try{
            await this.props.cancelCourt(this.state.booking.id);
            alert("cancel court success.");
            window.location.reload();

        }
        catch(err){
            // alert("something went wrong, please try again later.");
            alert(err.response.data.message);
            console.error(err);
        }
    }

    render(){

        if ( this.state.shouldRedirectMain ){
            return <Redirect to="/" />
        }

        if ( this.state.shouldRedirect ){
            return <Redirect to="/search" />
        }

        if ( this.state.booking == null ){
            return (
                <div style={{position: "fixed", left: "50%", top: "50%"}}>
                    <ReactLoading type="spin" color="white" height={'50%'} width={'50%'} />
                </div>
            ); 
        }

          let reserveRacketSection = [];
        if ( this.state.loadFinish ){
            for( let index in this.state.rackets ){
                let racket = this.state.rackets[index];
                reserveRacketSection.push(
                    <tr key={"row"+racket.name}>
                        <td md="4">{racket.name}</td>
                        <td md="4">{racket.price}</td>
                        <td md="4"><button disabled={this.state.requesting} className="btn btn-primary" onClick={() => this.handleReserveRacket(racket.id)}>reserve this racket</button></td>
                    </tr>
                );
            }
        }

        let reserveShuttlecockSection = [];
        if ( this.state.loadFinish ){
            for( let index in this.state.shuttlecocks ){
                let shuttlecock = this.state.shuttlecocks[index];
                reserveShuttlecockSection.push(
                    <tr key={"row"+shuttlecock.name}>
                        <td md="3">{shuttlecock.name}</td>
                        <td md="2">{shuttlecock.price}</td>
                        <td md="2">{shuttlecock.count}</td>
                        <td md="2">{shuttlecock.count_per_unit}</td>
                        <td md="3">
                            <Form.Control onChange={this.handleChange} type="number" name={"shuttlecock_"+shuttlecock.name} min="0" max={shuttlecock.count} />
                        </td>
                    </tr>
                );
            }
        }

        let reservedRackets = [];
        for(let i=0 ;i<this.state.reservedRackets.length; ++i){
            let reservedRacket = this.state.reservedRackets[i];
            reservedRackets.push(
                <Row className="my-1">
                    <Col>{reservedRacket.name}</Col>
                    <Col>{reservedRacket.price + " bath"}</Col>
                    <Col><button disabled={this.state.requesting} className="btn btn-warning" onClick={() => this.handleCancelRacket(reservedRacket.id)}>cancel reservation of this racket</button></Col>
                </Row>
            );
        }
        
        let orderedShuttlecocks = [];
        for(let i=0 ;i<this.state.orderedShuttlecocks.length; ++i){
            let orderedShuttlecock = this.state.orderedShuttlecocks[i];
            orderedShuttlecocks.push(
                <Row className="my-1">
                    <Col>{orderedShuttlecock.name}</Col>
                    <Col>{orderedShuttlecock.price + " bath"}</Col>
                    <Col><button disabled={this.state.requesting} className="btn btn-warning" onClick={() => this.handleCancelShuttlecock(orderedShuttlecock.id)}>cancel order of this shuttlecock</button></Col>
                </Row>
            );
        }

        if ( reservedRackets.length === 0 && orderedShuttlecocks.length === 0 ){
            reservedRackets = <p className="text-secondary">no racket reservation and shuttlecock order.</p>
        }

        return (
            <div className="app-content-inner">
                <div className="container text-left">
                    <Link to={"/booking/"+this.state.booking.court.name} className="court-item-holder">
                        <div className="header-text-group court-item">
                            <h3>{this.state.booking.court.name}</h3>
                            <p>{this.state.booking.court.desc}</p>
                            <div>
                            <span className="mr-3">{weekdays[this.state.booking.day_of_the_week]}</span>
                            <span className="mx-3">{this.mapTime(this.state.booking.start)+"-"+this.mapTime(this.state.booking.end)}</span>
                            <span className="mx-3">{ "court number: " + this.state.booking.court_number}</span>
                            <span className="mx-3">{this.state.booking.price + " bath" }</span>
                        </div>
                        </div>
                    </Link>
{/*                     
                    <div className="section-border">
                        <h5>reservation information</h5>
                        
                    </div> */}
                    {/* <hr /> */}
                    <div className="section-border">
                        <h5>Racket Reservations</h5>
                        {reservedRackets}
                    </div>
                    <div className="section-border" style={{marginTop: "2px"}}>
                        <h5>Shuttlecock Orders</h5>
                        {orderedShuttlecocks}
                    </div>
                    {/* <hr /> */}
                    <div className="header-text-group">
                        <h5>Do you want to reserve rackets or order shuttlecocks?</h5>
                    </div>
                    <div className="section-border">
                        <h5>Reserve Rackets</h5>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>price(bath)</th>
                                    <th>reservation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reserveRacketSection}
                            </tbody>
                        </Table>
                    </div>
                    <div className="section-border">
                        <h5>Order Shuttlecocks</h5>
                        <Table responsive>
                            <thead> 
                                <tr>
                                    <th>name</th>
                                    <th>price(bath)</th>
                                    <th>count</th>
                                    <th>count per unit</th>
                                    <th>reservation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reserveShuttlecockSection}
                            </tbody>
                        </Table>
                        <div className="text-right">
                            <button disabled={this.state.requesting} className="btn btn-primary" onClick={this.handleReserveShuttlecock}>order shuttlecocks</button>
                        </div>
                    </div>
                    <div className="section-border text-right">
                        <button disabled={this.state.requesting } className="btn btn-danger" onClick={this.handleCancelCourt}>Cancel Court Reservation</button>
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
        loadRackets: (id) => {
            return dispatch(courtActions.loadRackets(id));
        },
        loadShuttlecock: (id) => {
            return dispatch(courtActions.loadShuttlecock(id));
        },
        buyShuttlecock: (bookingID,id,count) => {
            return dispatch(courtActions.buyShuttlecock(bookingID,id,count));
        },
        cancelRacket: (racketID) => {
            return dispatch(courtActions.cancelRacket(racketID));
        },
        reserveRacket: (racketID, id) => {
            return dispatch(courtActions.reserveRacket(racketID, id));
        },
        cancelShuttlecock: (shuttlecockID) => {
            return dispatch(courtActions.cancelShuttlecock(shuttlecockID));
        },
        cancelCourt: (bookingID) => {
            return dispatch(courtActions.cancelCourt(bookingID));
        },
        getUserInfo: (username) => {
            return dispatch(authActions.getUserInfo(username))
        }
      };
}
  
export default connect(mapStateToProps, mapDispatchToProps)(MyBooking);