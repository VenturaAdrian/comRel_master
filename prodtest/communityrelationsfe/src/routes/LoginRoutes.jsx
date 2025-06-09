
import { element } from "prop-types";
import { lazy } from "react";


const AuthLogin = lazy(() => import("../pages/authentication/auth-forms/AuthLogin"))
const AuthRegister = lazy(() => import("../pages/authentication/auth-forms/AuthRegister"))


const LoginRoutes = {
    path:'/',
    children:[
    {
        path:'/',
        element: <AuthLogin/>
    },
    {
        path:'/register',
        element: <AuthRegister/>
    }
    ]

  
}

export default LoginRoutes;