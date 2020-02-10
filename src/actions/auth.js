import axios from 'axios';

export const loadUser = () => {
    return (dispatch, getState) => {
      dispatch({type: "USER_LOADING"});
  
      const token = getState().auth.token;
  
      let headers = {
        "Content-Type": "application/json",
      };
  
      if (token) {
        headers["Authorization"] = `Token ${token}`;

        return fetch("/api/user/prayuthzaa/", {headers, })
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
  
      return fetch("/auth/", {headers, body, method: "POST"})
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
            dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data });
            console.log('login successful');
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
          "Authorization": "Token ead12abc8e793aa3447e2464c79abfccc5225d1c"
         };
      let body = JSON.stringify({first_name, last_name, username, password, email, phone_number});
      console.log(body);
  
      return fetch("/api/user/", {headers, body, method: "POST"})
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

      try{
        let res = await axios.post("http://localhost:8000/api/user/"+username+"/change_password/", JSON.stringify({password}),
            {
              'Content-Type': 'application/json',
              'Authorization': 'Token '+token
            });
        dispatch({type: 'USER_LOADED', user: res.data });
        return res.data;
      }
      catch(err){
        console.log("error");
        throw err;
      }
      
    };
  }