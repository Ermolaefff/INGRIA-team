import React from 'react';
import './App.css';
import Toolbar from './components/toolbar/Toolbar';
import CarList from './components/cars/CarList';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import CarPage from './components/cars/CarPage';

function App() {

  return (
  <Router>
    <Toolbar>
      <Link to="/" className="logo">CarDB</Link>
      <a href='https://github.com/katunilya/task-simple-crud/blob/main/README.md'
                target='_blank'
                className='menuEl'
                rel='noreferrer'
            >блядское задание</a>
    </Toolbar>
    <div className='layout'>
      <Routes>
        <Route path="/" element={<CarList></CarList>}></Route>
        <Route path="/car/:id" element={<CarPage></CarPage>}></Route>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
