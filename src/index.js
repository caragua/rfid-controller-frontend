import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './common.css';

import {
    createBrowserRouter,
    RouterProvider,
    useNavigate,
} from "react-router-dom";


import Login from './login/Login';
import Register from './register/Register';
import Main from './main/Main';

import Registration from './main/registration/Registration';

import Attendees from './main/attendees/Attendees';
import AttendeeDetails from './main/attendees/Details';

import Sites from './main/sites/Sites';
import SiteDetails from './main/sites/Details';

import AccessRules from './main/accessRules/AccessRules';
import AccessRuleDetails from './main/accessRules/Details';

import Readers from './main/readers/Readers';
import ReaderDetails from './main/readers/Details';

import Scans from './main/scans/Scans';
import ScanDetails from './main/scans/Details';

import Points from './main/points/Points';
import PointDetails from './main/points/Details';

import Users from './main/users/Users';
import UserDetails from './main/users/Details';

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "registration/",
                element: <Registration />,
                /* children: [
                    {
                        path: "/registration/:attendeeId",
                        element: <RegistrationDetails />
                    }
                ]*/
            },
            {
                path: "attendees/",
                element: <Attendees />,
                children: [
                    {
                        path: ":attendeeId",
                        element: <AttendeeDetails />
                    }
                ]
            },
            {
                path: "sites/",
                element: <Sites />,
                children: [
                    {
                        path: ":siteId",
                        element: <SiteDetails />
                    }
                ]
            },
            {
                path: "accessRules/",
                element: <AccessRules />,
                children: [
                    {
                        path: ":accessRuleId",
                        element: <AccessRuleDetails />
                    }
                ]
            },
            {
                path: "cardReaders/",
                element: <Readers />,
                children: [
                    {
                        path: ":cardReaderId",
                        element: <ReaderDetails />
                    }
                ]
            },
            {
                path: "scans/",
                element: <Scans />,
                children: [
                    {
                        path: ":scanId",
                        element: <ScanDetails />
                    }
                ]
            },
            {
                path: "points/",
                element: <Points />,
                children: [
                    {
                        path: ":pointId",
                        element: <PointDetails />
                    }
                ]
            },
            {
                path: "users/",
                element: <Users />,
                children: [
                    {
                        path: ":userId",
                        element: <UserDetails />
                    }
                ]
                
            },
        ]
    }
]);

fetch('http://api.dg.lazyprojects.com/sanctum/csrf-cookie', {
    method: "GET",
    credentials: "include",
})
.then((result) => {});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);