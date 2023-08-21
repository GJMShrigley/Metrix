import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Topbar from "./scenes/global/Topbar";
import CustomSidebar from "./scenes/global/CustomSidebar";
import Dashboard from "./scenes/dashboard";
import ChartPage from "./scenes/chartPage";
import CategoryPage from "./scenes/categoryPage";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LayoutPage from "./scenes/layout";
import ActivityPage from "./scenes/activityPage";
import JournalPage from "./scenes/journalPage";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box className="app">
            <CustomSidebar isSidebar={isSidebar} />
            <Box sx={{width: "100vw", height: "100vh", overflow: "auto"}} >
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<LayoutPage />} >
                  <Route index element={<Dashboard />} />
                  <Route path="/chart/:id" element={<ChartPage />}  loader={({ params }) => { console.log(params.id); }} action={({ params }) => { }} />
                  <Route path="/category/:id" element={<CategoryPage />}  loader={({ params }) => { console.log(params.id); }} action={({ params }) => { }} />
                  <Route path="/activity/:id" element={<ActivityPage />}  loader={({ params }) => { console.log(params.id); }} action={({ params }) => { }} />
                  <Route path="/journal" element={<JournalPage />}  />
                </Route>
              </Routes>
            </Box>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

export default App;