import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';
import './index.scss';
import "./styles/theme.scss";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Home from './pages/home';
import Code from './pages/code';
import NotFound from './pages/404/404';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
    {
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/code/:hash",
                element: <Code />
            }
        ]
    }
]);

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: "Inter"
    }
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={darkTheme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);