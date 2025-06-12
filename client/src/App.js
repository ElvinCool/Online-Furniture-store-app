import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { check } from "./http/userAPI";
import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from ".";

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then(data => {
        user.setUser(true)
        user.setIsAuth(false)
      }).finally(() => setLoading(false))
    }, [])

  if (loading) {
    return <Spinner animation={"grow"}/>
  }
  
  return (
    <BrowserRouter>
    <NavBar />
      <AppRouter/>
    </BrowserRouter>
  );
});

export default App;
