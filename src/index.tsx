import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import "./styles/theme.scss";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Home from './pages/home';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);