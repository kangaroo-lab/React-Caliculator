import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';

export function App(){
    return(
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Top/>}/>
          </Routes>
        </BrowserRouter>
    )
}
