import { useState } from 'react'

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
          <Rotue path= "/product" element= {<Product />} />
          <Route path= "/order" element= {<Order />} />
          <Route path= "/status" element= {<Status />} />
          <Route path= "/cart" element= {<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
