import { useState } from "react";

import { App as CapacitorApp } from '@capacitor/app';
import { Plugins, Capacitor } from "@capacitor/core";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { useStorage } from "./hooks/useStorage";
import store from "./store/store";
import { ColorModeContext, useMode } from "./theme";

import ActivityPage from "./scenes/activityPage";
import CategoryPage from "./scenes/categoryPage";
import CorrelationPage from "./scenes/correlationPage";
import ChartPage from "./scenes/chartPage";
import Dashboard from "./scenes/dashboard";
import FaqPage from "./scenes/FaqPage";
import Topbar from "./scenes/global/Topbar";
import CustomSidebar from "./scenes/global/CustomSidebar";
import JournalPage from "./scenes/journalPage";
import LayoutPage from "./scenes/layout";
import SettingsPage from "./scenes/settingsPage";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  CapacitorApp.addListener('backButton', ({canGoBack}) => {
    if(!canGoBack){
      CapacitorApp.exitApp();
    } else {
      window.history.back();
    }
  });
 
  return (
    <Provider store={store} useStorage={useStorage}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box className="app">
            <CustomSidebar isSidebar={isSidebar} />
            <Box
              sx={{
                height: "100vh",
                overflowX: "hidden",
                overflowY: "auto",
                width: "100vw",
              }}
            >
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<LayoutPage />}>
                  <Route index element={<Dashboard />} />
                  <Route
                    path="/chart/:id"
                    element={<ChartPage />}
                    loader={({ params }) => {
                      console.log(params.id);
                    }}
                    action={({ params }) => {}}
                  />
                  <Route
                    path="/category/:id"
                    element={<CategoryPage />}
                    loader={({ params }) => {
                      console.log(params.id);
                    }}
                    action={({ params }) => {}}
                  />
                  <Route
                    path="/activity/:id"
                    element={<ActivityPage />}
                    loader={({ params }) => {
                      console.log(params.id);
                    }}
                    action={({ params }) => {}}
                  />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/correlation" element={<CorrelationPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
