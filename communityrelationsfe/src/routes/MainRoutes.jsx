import { element } from 'prop-types';import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import DashboardLayout from 'layout/Dashboard';



const DashboardDeafult = lazy(() => import('../pages/dashboard/index'));
const AddForm = lazy(() => import('../pages/form/index'));
const History = lazy(() => import('../pages/history/index'));
const EditForm = lazy(() => import('../pages/form/editForm'));
const ViewForm = lazy(() => import('../pages/form/view'));
const Review = lazy(() => import('../pages/form/review'));
const Viewallreviewed = lazy(()=> import('../pages/form/viewallreviewed'));
const TEST = lazy(() => import('../pages/testpafe'));


const RoleAccess = () => {
    if(localStorage.getItem("user") === null){
        return <Navigate to="/"replace/>;
    }else{
        return <DashboardLayout/>
    }
}



const MainRoutes = {
    path:'/',
    element: <RoleAccess/>,
    children: [
        {
            path:'/',
            element:<DashboardDeafult/>
        },
        {
            path: 'dashboard', 
            element: <DashboardDeafult />
        },
        {
            path: 'addform',
            element: <AddForm/>
        },
        {
            path: 'history',
            element: <History/>
        },
        {
            path: 'editform',
            element: <EditForm/>
        },
        {
            path: 'viewform',
            element: <ViewForm/>
        },
        {
            path: 'review',
            element: <Review/>
        },
        {
            path: 'allreviewed',
            element: <Viewallreviewed/>
        }
    ]
}
export default MainRoutes;