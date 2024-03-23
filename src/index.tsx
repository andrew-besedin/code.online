import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);