import axios from 'axios';

export const createCourt = (name,price,desc,lat,long,court_count) => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      let username = getState().auth.user.username;

      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token '+token
        }
      }

      try{
        let res = await axios.post("http://localhost:8000/api/court/", {name,price,desc,lat,long,court_count}, config);
        console.log(res.data);
        return res.data;
      }
      catch(err){
        console.log("error");
        throw err;
      }
    }
  }

export const loadCourts = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+token
            }
        }

        try{
            let res = await axios.get("http://localhost:8000/api/court/", config);
            console.log(res.data);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
        
    }
}

export const loadCourt = (courtName) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+token
            }
        }

        try{
            let res = await axios.get("http://localhost:8000/api/court/"+courtName+"/", config);
            console.log(res.data);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
        
    }
}

export const reviewCourt = (courtName, score, review) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        try{
            let res = await axios.post("http://localhost:8000/api/court/"+courtName+"/rate_court/", {score, review}, config);
            console.log(res.data);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
        
    }
}

export const loadMyCourt = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        try{
            let res = await axios.get("http://localhost:8000/api/user/"+getState().auth.user.username+"/courts/", config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}

export const addImageToCourt = (courtName, url) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        try{
            let res = await axios.post("http://localhost:8000/api/court/"+courtName+"/add_image/", {url}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}

export const searchCourts = (queryParams) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/court" + queryParams;
        console.log(url);
        try{
            let res = await axios.get(url, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}

export const bookCourt = (courtName,start,end,day_of_the_week) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;
        start = 12;
        end = 14;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/court/" + courtName +'/book/';
        try{
            let res = await axios.post(url,{start,end,day_of_the_week}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
} 

export const loadRackets = (bookingID) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/booking/"+bookingID+"/get_rackets/";
        try{
            let res = await axios.get(url, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}

export const loadShuttlecock = (bookingID) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/booking/"+bookingID+"/get_shuttlecocks/";
        try{
            let res = await axios.get(url, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}

export const loadBooking = (bookingID) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;

        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/booking/"+bookingID+"/";
        try{
            let res = await axios.get(url, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}


export const addRacket = (courtName, name, price) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/court/" + courtName +'/add_racket/';
        try{
            let res = await axios.post(url,{name,price}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
} 

export const addShuttlecock = (courtName, name, count, count_per_unit, price) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/court/" + courtName +'/add_shuttlecock/';
        try{
            let res = await axios.post(url,{name, count, count_per_unit,price}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
} 

export const reserveRacket = (bookingID, id) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/booking/" + bookingID +'/reserve_racket/';
        try{
            let res = await axios.post(url,{id}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}

export const buyShuttlecock = (bookingID, id, count) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/booking/" + bookingID +'/buy_shuttlecock/';
        try{
            let res = await axios.post(url,{id,count}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
} 

export const cancelRacket = (racketID) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/racket/" + racketID +'/cancel/';
        try{
            let res = await axios.post(url,{}, config);
            return res.data;
        }
        catch(err){
            throw err;
        }
    }
} 

export const cancelShuttlecock = (shuttlecockID) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/shuttlecock/" + shuttlecockID +'/cancel/';
        try{
            let res = await axios.post(url,{}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
} 

export const cancelCourt = (bookingID) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let url = "http://localhost:8000/api/booking/" + bookingID +'/cancel/';
        try{
            let res = await axios.post(url,{}, config);
            return res.data;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}


export const callSpeech = (url,username) => {
    return async(dispatch, getState) => {
        const token = getState().auth.token;


        let config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Token '+token
            }
        }

        let apiUrl = "http://localhost:8000/api/shuttlecock/";
        try{
            let res = await axios.post(apiUrl,{url,username}, config);
            return res.data;
        }
        catch(err){
            console.log("error");
            throw err;
        }
    }
}
