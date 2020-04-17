import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import thunk from 'redux-thunk';
import {auth} from './actions';
import myApp from './reducers';
import ReactLoading from 'react-loading';

import Home from './components/Home';
import NavBar from './components/NavBar';
import About from './components/About';
import ChangePassword from './components/ChagePassword';
import Profile from './components/Profile';
import Log from './components/Log';
import CreateCourt from './components/CreateCourt';
import Search from './components/Search';
import Court from './components/Court';
import SecondaryNavBar from './components/SecondaryNavBar';
import MyCourt from './components/MyCourt';
import BecomeAProvider from './components/BecomeAProvider';
import Courts from './components/Courts';
import TopUp from './components/TopUp';
import MyBookingList from './components/MyBookingList';
import MyBooking from './components/MyBooking';
import AOS from 'aos';
import 'aos/dist/aos.css';

let store = createStore(myApp, applyMiddleware(thunk));

class RootContainerComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tempUsername: null
    }
  
  }

  componentDidMount(){
    AOS.init();
  }
  
  async componentWillMount(){
    let username = localStorage.getItem('username');
    await this.props.loadUser(localStorage.getItem('username'));
    this.setState({
      tempUsername: username
    })
  }

  PrivateRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => {
      if (!this.props.auth.isAuthenticated) {
        console.log('app.js not authenticate');
        return <Redirect to="/search" />;
      } else {
        return <ChildComponent {...props} />
      }
    }} />
  }

  render() {
    if ( this.props.auth.isLoading ){
      return (
        <div style={{position: "fixed", left: "50%", top: "50%"}}>
            <ReactLoading type="spin" color="grey" height={'50%'} width={'50%'} />
        </div>
    );
    }
    console.log('start rendering');
    let {PrivateRoute} = this;
    return (
        <BrowserRouter>
          <div className="App">
          <div>
            <NavBar />
            {this.props.auth.isAuthenticated ? <SecondaryNavBar /> : null}
          </div>
          <div className="app-content">
            <Switch>
              <PrivateRoute exact path="/profile/change_password" component={ChangePassword}/>
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/history" component={Log} />
              <PrivateRoute exact path="/add_court" component={CreateCourt} />
              <PrivateRoute exact path="/my_courts" component={MyCourt} />
              <PrivateRoute exact path="/become_a_provider" component={BecomeAProvider} />
              <Route exact path="/search" component={Search} />
              <PrivateRoute exact path="/booking/:courtName" component={Court} />
              <PrivateRoute exact path="/court_res" component={Courts} />
              <PrivateRoute exact path="/topup" component={TopUp} />
              <PrivateRoute exact path="/my_booking" component={MyBookingList} />
              <PrivateRoute exact path="/my_booking/:bookingID" component={MyBooking} />
              <Route exact path='/' render={()=> <Home />} />
              <Route exact path="/about" render={()=> <About />} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: (username) => {
      return dispatch(auth.loadUser(username));
    }
  }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent); 

class App extends React.Component {
  render(){
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
      
    );
  }
}
export default App;
