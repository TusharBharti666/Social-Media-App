import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";



function App() {

  // we are grabbing the mode we have from our state
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token)); // if the token exist, we are authorised

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
        
          <Routes>
            <Route path="/" element={<LoginPage />} /> 
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to ="/" />} /> 
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to ="/" />} />
          </Routes>

        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}


export default App;

// when someone go through / route , they will land on login page, whereas
// /home route will lead to homepage whereas
// /profile/userid will lead to the specific person's profile whome id we have typed

//cssbaseline is for resetting the css to basic

// if u are not authorised then u cannot access the homepage and profile of someone