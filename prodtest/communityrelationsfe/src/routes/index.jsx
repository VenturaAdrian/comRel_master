import { createBrowserRouter } from "react-router-dom";


import LoginRoutes from './LoginRoutes';
import AuthLogin from "../pages/authentication/auth-forms/AuthLogin";
import MainRoutes from "./MainRoutes";



const router = createBrowserRouter([LoginRoutes,
                                        {path: '/', 
                                        element: <AuthLogin/>
                                    } ,
                                     MainRoutes],{basename: import.meta.env.VITE_APP_BASE_NAME});




export default router;