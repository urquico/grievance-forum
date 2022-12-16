import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";

import Loading from "./layouts/Loading/Loading";

const Login = lazy(() => import("./routes/Login"));
const Home = lazy(() => import("./routes/Home"));
const Error = lazy(() => import("./routes/Error"));
const Post = lazy(() => import("./routes/Post"));
const Profile = lazy(() => import("./routes/Profile"));
const Category = lazy(() => import("./routes/Category"));

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
            <NotificationsProvider limit={5} zIndex={2077}>
              <Routes>
                <Route path={"/"} element={<Login />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/home"} element={<Home />} />
                <Route path={"/post"} element={<Post />} />
                <Route path={"/profile"} element={<Profile />} />
                <Route path={"/category"} element={<Category />} />
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
