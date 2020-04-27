import React from 'react';
import {connect} from 'react-redux';
import {auth} from '../actions';
import { Form, Button, Row, Col } from 'react-bootstrap';


class TopUp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            amountToAdd: 0,
            amountToWithdraw: 0,
            loading: false,
            credit: null
        }
    }

    async componentDidMount(){
        let res = await this.props.getUserInfo(this.props.user.username);
        console.log(res);
        this.setState({
            credit: res.credit
        });
    }

    handleChange = e => {
        const { name,value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleAddCredit = async (e) => {
        e.preventDefault();
        if ( this.state.amountToAdd === "" ){
            alert("please enter amount.");
            return;
        }
        else if ( isNaN(this.state.amountToAdd) || parseFloat(this.state.amountToAdd) <= 0 ){
            alert("amount should be number greater than zero.");
            return;
        }
        this.setState({
            loading: true
        });
        try {
            await this.props.addCredit(this.state.amountToAdd);
            // alert('credit added');
            // this.setState({
            //     amountToAdd: 0,
            //     loading: false
            // })
            window.location.reload();
        }
        catch(err){
            alert(err);
            this.setState({
                loading: false
            })
        }

    }

    handleWithdraw = async(e) => {
        e.preventDefault();
        if ( this.state.amountToWithdraw === "" ){
            alert("please enter amount.");
            return;
        }
        else if ( isNaN(this.state.amountToWithdraw) || parseFloat(this.state.amountToWithdraw) <= 0 ){
            alert("amount should be number greater than zero.");
            return;
        }
        this.setState({
            loading: true
        });
    }

    render(){
        return (
            <div className="app-content-inner">
                <div className="container">
                    <p>Your Credit</p>
                    <h3>{this.state.credit + " Bath"}</h3>
                    <br />
                    <div className="my-4">
                        <p>Wanna top up any money to your pocket?</p>
                        <Form onSubmit={this.handleAddCredit}>
                            <Form.Group>
                                <Form.Control onChange={this.handleChange} name="amountToAdd" className="mr-2" type="number" style={{width: "10em", display: "inline-block"}} value={this.state.amountToAdd}></Form.Control>
                                <Button type="submit" className="btn btn-primary" disabled={this.state.loading}>Add Credit</Button>
                            </Form.Group>
                        </Form>
                    </div>
                    {/* <p>or</p>
                    <div className="my-4">
                        <p>Withdraw your credit.</p>
                        <Form onSubmit={this.handleWithdraw}>
                            <Form.Group>
                                <Form.Control onChange={this.handleChange} name="amountToWithdraw" className="mr-2" type="number" style={{width: "10em", display: "inline-block"}} value={this.state.amountToWithdraw}></Form.Control>
                                <Button type="submit" className="btn btn-primary" disabled={this.state.loading}>Withdraw</Button>
                            </Form.Group>
                        </Form>
                    </div> */}
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
        addCredit: (amount) => {
          return dispatch(auth.addCredit(amount));
        },
        getUserInfo: (username) => {
            return dispatch(auth.getUserInfo(username));
        },
      };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUp);