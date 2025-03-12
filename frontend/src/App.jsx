import './App.css'
import background from './images/lovebg7.webp'
import { RouterProvider } from 'react-router-dom';
import router from './router';


function App() {
  return (
    <div className='mt-0' style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%'
    }}>
        <RouterProvider router={router} />
    </div>
  )
}

export default App;
