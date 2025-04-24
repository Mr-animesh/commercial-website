import { useState } from 'react'
import {Me} from './pages/Me'
import {Signup} from './pages/Signup'
import {Signin} from './pages/Signin'
import {Home} from './pages/Home'
import {Product} from './pages/Product'
import {Cart} from './pages/Cart'
import {Status} from './pages/Status'
import {Order} from './pages/Order'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Me />} />
          <Route path="/signup" element= {<Signup />} />
          <Route path="/signin" element= {<Signin />} />
          <Route path= "/home" element= {<Home />} />
          <Route path= "/product" element= {<Product />} />
          <Route path= "/order" element= {<Order />} />
          <Route path= "/status" element= {<Status />} />
          <Route path= "/cart" element= {<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
