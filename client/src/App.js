import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage, useFavicon } from "@mantine/hooks";

import Loading from "./layouts/Loading/Loading";
import haribonFavicon from "../src/assets/hariBirdLogo.svg";

const Login = lazy(() => import("./routes/Login"));
const Home = lazy(() => import("./routes/Home"));
const Error = lazy(() => import("./routes/Error"));
const Post = lazy(() => import("./routes/Post"));
const Profile = lazy(() => import("./routes/Profile"));
const Category = lazy(() => import("./routes/Category"));
const CategoryId = lazy(() => import("./routes/CategoryId"));
const Tags = lazy(() => import("./routes/Tags"));
const Tag = lazy(() => import("./routes/Tag"));
const Comment = lazy(() => import("./routes/Comment"));
const AccountSetup = lazy(() => import("./routes/AccountSetup"));

const Archive = lazy(() => import("./routes/Archive"));
const CommentArchive = lazy(() => import("./routes/CommentArchive"));

//! Admin Controls
const Profanities = lazy(() => import("./routes/Profanities"));
const Reviews = lazy(() => import("./routes/Reviews"));
const Pending = lazy(() => import("./routes/Pending"));
const Users = lazy(() => import("./routes/Users"));

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (ColorScheme) =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  useFavicon(haribonFavicon);

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
                <Route path={"/setup"} element={<AccountSetup />} />
                <Route path={"/home"} element={<Home />} />
                <Route path={"/post"} element={<Post />} />
                <Route path={"/posts/archive"} element={<Archive />} />
                <Route path={"/profile"} element={<Profile />} />
                <Route path={"/category"} element={<Category />} />
                <Route path={"/category/:id"} element={<CategoryId />} />
                <Route path={"/tags"} element={<Tags />} />
                <Route path={"/tags/:id"} element={<Tag />} />
                <Route path={"/comment/:id"} element={<Comment />} />
                <Route
                  path={"/comment/archive/:id"}
                  element={<CommentArchive />}
                />
                <Route path={"/edit/:id"} element={<Tag />} />

                <Route path={"/profanities"} element={<Profanities />} />
                <Route path={"/reviews"} element={<Reviews />} />
                <Route path={"/pending"} element={<Pending />} />
                <Route path={"/users"} element={<Users />} />

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
