import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../App.css'
import Header from './components/Header/Header.jsx';
import Shop from './components/Shop/Shop.jsx';
import Description from './components/Descriptions/Description.jsx';
import Body from './components/Body/Body.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      { index: true, element: <Body /> },
    ],
  },
  {
    path: "shop/:category",
    element: <Header />,
    children: [
      { index: true, element: <Shop /> },
    ],
  },
  {
    path: "/shop",
    element: <Header />,
    children: [
      { index: true, element: <Shop /> },
    ],
  },
  {
    path: "/description",
    element: <Header />,
    children: [
      { index: true, element: <Description /> },
    ],
  },
  


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
