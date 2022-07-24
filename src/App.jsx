import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

//pages
import { Home } from './pages/home';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
