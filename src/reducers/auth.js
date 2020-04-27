const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    errors: {},
  };
  
  
  export default function auth(state=initialState, action) {
  
    switch (action.type) {
  
        case 'USER_LOADING':
            return {...state, isLoading: true};
  
        case 'USER_LOADED':
            console.log(action.user);
            return {...state, isAuthenticated: true, isLoading: false, user: action.user};
  
        case 'LOGIN_SUCCESSFUL':
            localStorage.setItem('username', action.username);
            localStorage.setItem("token", action.data.token);
            console.log(localStorage.getItem('username'));
            console.log(action);
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};
        case 'REGISTRATION_SUCCESSFUL':
                console.log(action);
                localStorage.setItem("token", action.data.token);
                localStorage.setItem('username', action.data.result.username);
                return {...state, ...action.data, isAuthenticated: false, isLoading: false, errors: null};
  
        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'LOGOUT_SUCCESSFUL':
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            return {...state, errors: action.data, token: null, user: null,
            isAuthenticated: false, isLoading: false};
        case "UPDATE_BOOKING":
                return {...state, user: action.user}
        default:
            return state;
    }
  }