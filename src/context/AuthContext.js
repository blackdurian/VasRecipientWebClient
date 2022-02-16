//TODO refactor to react 17

import React from "react";


//TODO: useDispatch , required react 17
export const AuthContext = React.createContext(
    {
        authState: false,
        currentUser:null,
        redirectToLogin: () => {},
        handleLogout: () => {},
        loadCurrentUser: () => {},
    }
);
