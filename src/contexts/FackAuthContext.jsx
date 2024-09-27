import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext()

const initialstate = {
    user: null,
    isAuthenticated: false
}


function reducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state, isAuthenticated: true,
                user: action.payload
            }

        case 'logout':
            return {
                ...state,
                user: null,
                isAuthenticated: false
            }

        default:
            throw new Error("Unknown action");

    }
}


const FAKE_USER = {
    name: "Kartik",
    email: "kartik@example.com",
    password: "kartik",
    avatar: "https://i.pravatar.cc/100?u=zz",
};


function AuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialstate)

    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) 

            dispatch({
                type: 'login',
                payload: FAKE_USER
            })
        
    }

    function logout() { 
        dispatch({ type: "logout" });
    }
     return(
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
     )
}

function useAuth() {
    const contex = useContext(AuthContext)
    if (contex === undefined) {
        throw new Error("Authantication was usedoutside AuthProvider");
    }
    return contex;
}

export { AuthProvider, useAuth }