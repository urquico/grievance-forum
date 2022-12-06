import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";

import Loading from "./layouts/Loading/Loading";

const Login = lazy(() => import("./routes/Login"));
const Home = lazy(() => import("./routes/Home"));
const Error = lazy(() => import("./routes/Error"));

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (ColorScheme) =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider zIndex={2077}>
              <Routes>
                <Route path={"/"} element={<Login />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/home"} element={<Home />} />
                <Route path={"*"} element={<Error />} />
              </Routes>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Suspense>
    </Router>
  );
}

export default App;
