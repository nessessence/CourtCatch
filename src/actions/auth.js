import axios from 'axios';

export const getUserInfo = (username) => {
  return async (dispatch, getState) => {

    const token = getState().auth.token;
    console.log(token);

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+token
      }
    }

    try{
      let res = await axios.get("http://localhost:8000/api/user/"+username+"/", config);
      console.log(res);
      return res.data;
    }
    catch(err){
      throw err;
    }
    
  };
}

export const loadUser = (username) => {
    return (dispatch, getState) => {
      dispatch({type: "USER_LOADING"});
  
      const token = getState().auth.token;
      if ( token == null || username == null){
        dispatch({type: "LOGIN_FAILED"});
        return ;
      }
      console.log("load user "+ username + " " + token);
  
      let headers = {
        "Content-Type": "application/json",
      };
  
      if (token) {
        headers["Authorization"] = `Token ${token}`;

        return fetch("http://localhost:8000/api/user/"+(username)+"/", {headers, })  
        .then(res => {
          if (res.status < 500) {
            return res.json().then(data => {
              return {status: res.status, data};
            })
          } else {
            console.log("Server Error!");
            throw res;
          }
        })
        .then(res => {
          if (res.status === 200) {
            console.log(res);
            dispatch({type: 'USER_LOADED', user: res.data });
            return res.data;
          } else if (res.status >= 400 && res.status < 500) {
            dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
            throw res.data;
          }
        });
      }

    }
  }

  export const login = (username, password) => {
    return (dispatch, getState) => {
      let headers = {"Content-Type": "application/json"};
      let body = JSON.stringify({username, password});
  
      return fetch("http://localhost:8000/auth/", {headers, body, method: "POST"})
        .then(res => {
          if (res.status < 500) {
            return res.json().then(data => {
              return {status: res.status, data};
            })
          } else {
            console.log("Server Error!");   
            throw res;
          }
        })
        .then(res => {
          if (res.status === 200) {
            dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data , username: username});
            console.log('login successful');
            console.log({...res.data, user: {username: username}});
            return res.data;
          } else if (res.status === 403 || res.status === 401) {
            dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
            throw res.status;
          } else {
            dispatch({type: "LOGIN_FAILED", data: res.data});
            throw res.status;
          }
        })
    }
  }

  export const register = (first_name, last_name, username, password, email, phone_number) => {
    return (dispatch, getState) => {
      let headers = {
          "Content-Type": "application/json",
          "Authorization": "Token 9ea82d11991654e4b9221ff8559a53b2d9f758be"
         };
      let body = JSON.stringify({first_name, last_name, username, password, email, phone_number});
      console.log(body);
  
      return fetch("http://localhost:8000/api/user/", {headers, body, method: "POST"})
        .then(res => {
          if (res.status < 500) {
            return res.json().then(data => {
              return {status: res.status, data};
            })
          } else {
            console.log("Server Error!");
            throw res;
          }
        })
        .then(res => {
          if (res.status === 200) {
            dispatch({type: 'REGISTRATION_SUCCESSFUL', data: res.data });
            return res.data;
          } else if (res.status === 403 || res.status === 401) {
            dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
            throw res.data;
          } else {
            dispatch({type: "REGISTRATION_FAILED", data: res.data});
            throw res.data;
          }
        })
    }
  }

  export const logout = () => {
    return (dispatch, getState) => {
    //   let headers = {"Content-Type": "application/json"};
  
    //   return fetch("/api/auth/logout/", {headers, body: "", method: "POST"})
    //     .then(res => {
    //       if (res.status === 204) {
    //         return {status: res.status, data: {}};
    //       } else if (res.status < 500) {
    //         return res.json().then(data => {
    //           return {status: res.status, data};
    //         })
    //       } else {
    //         console.log("Server Error!");
    //         throw res;
    //       }
    //     })
    //     .then(res => {
    //       if (res.status === 204) {
    //         dispatch({type: 'LOGOUT_SUCCESSFUL'});
    //         return res.data;
    //       } else if (res.status === 403 || res.status === 401) {
    //         dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
    //         throw res.data;
    //       }
    //     })
        dispatch({type: 'LOGOUT_SUCCESSFUL'});
    }
  }

  export const changePassword = (username, password) => {
    
    return async (dispatch, getState) => {

      const token = getState().auth.token;
      console.log(token);

      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token '+token
        }
      }

      try{
        let res = await axios.post("http://localhost:8000/api/user/"+username+"/change_password/", {password: password}, config);
        console.log(res);
        dispatch({type: 'USER_LOADED', user: res.data });
        return res.data;
      }
      catch(err){
        throw err;
      }
      
    };
  }

  export const addCredit = (amount) => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      let username = getState().auth.user.username;
      console.log(token);

      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token '+token
        }
      }

      try{
        let res = await axios.post("http://localhost:8000/api/user/"+username+"/add_credit/", {amount: amount}, config);
        console.log(res.data.result);
        dispatch({type: 'USER_LOADED', user: res.data.result });
        return res.data.result;
      }
      catch(err){
        console.log("error");
        throw err;
      }
    };
  }

  export const loadHistory = () => {
    return async (dispatch, getState) => {
      const token = getState().auth.token;
      let username = getState().auth.user.username;
      console.log(token);

      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token '+token
        }
      }

      try{
        let res = await axios.get("http://localhost:8000/api/log/"+username+"/", config);
        console.log(res.data);
        return res.data;
      }
      catch(err){
        console.log("error");
        throw err;
      }
    };
  }

  