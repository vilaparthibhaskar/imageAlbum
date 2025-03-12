import { createBrowserRouter } from 'react-router-dom';
import {Signup} from './components/Signup';
import { LoginPage } from './components/Login';
import AlbumGrid from './components/AlbumGrid'
import AlbumCarousel from './components/ALbumCarousel';
// import {ProtectedRoute} from './components/protected';



const router = createBrowserRouter([
    {
        path: '/', 
        element: <LoginPage/>,
      },
    {
        path:'/login',
        element: <LoginPage />
    },
    {
        path:'/albums',
        element: <AlbumGrid/>
    },
    {
        path:'/album/:title',
        element: <AlbumCarousel/>
    },
    {
        path:'/signup',
        element: <Signup/>
    },
]);

export default router;
