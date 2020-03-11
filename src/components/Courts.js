import React from 'react'
import {court} from '../actions';
import { connect } from 'react-redux';

class Courts extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loadFinish: false,
            courts: null
        }
    }

    async componentDidMount() {
        let queryParams = this.props.location.search;
        let res = await this.props.searchCourts(queryParams);
        console.log(res);
    }

    render(){
        console.log("courts render");
        return (
            <div className="app-content-inner">
                <div className="container">
                    <h1>Courts</h1>
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