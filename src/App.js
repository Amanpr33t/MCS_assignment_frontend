import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import TaskForm from './components/TaskForm';
import Loading from './components/Loading';
import ErrorPage from './components/ErrorPage';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [isAppClick, setIsAppClick] = useState(false)

  const resetAppClick = () => {
    setIsAppClick(false)
  }

  return (
    <div onClick={() => setIsAppClick(true)}>
      <Navbar />
      <Routes>
        <Route path='/' element={<Body isAppClick={isAppClick} resetAppClick={resetAppClick} />}></Route>
        <Route path='/task_form' element={<TaskForm />}></Route>
        <Route path='/error' element={<ErrorPage />}></Route>
        <Route path='*' element={<Navigate replace to='/' />}></Route>
      </Routes>
      <Loading />
    </div>
  )
}

export default App;
