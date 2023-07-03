import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage, useFavicon } from "@mantine/hooks";

import Loading from "./layouts/Loading/Loading";
import haribonFavicon from "../src/assets/hariBirdLogo.svg";
import Protected from "./layouts/Protected";

const Login = lazy(() => import("./routes/Login"));
const Home = lazy(() => import("./routes/Home"));
const Error = lazy(() => import("./routes/Error"));
const Post = lazy(() => import("./routes/Post"));
const Profile = lazy(() => import("./routes/Profile"));
const Category = lazy(() => import("./routes/Category"));
const CategoryId = lazy(() => import("./routes/CategoryId"));
const Tags = lazy(() => import("./routes/Tags"));
const Tag = lazy(() => import("./routes/Tag"));
const GFormsLink = lazy(() => import("./routes/GFormsLink"));
const Comment = lazy(() => import("./routes/Comment"));
const AccountSetup = lazy(() => import("./routes/AccountSetup"));

const College = lazy(() => import("./routes/College"));
const Severe = lazy(() => import("./routes/Severe"));
const Moderate = lazy(() => import("./routes/Moderate"));
const Mild = lazy(() => import("./routes/Mild"));
const Program = lazy(() => import("./routes/Program"));
const Archive = lazy(() => import("./routes/Archive"));
const CommentArchive = lazy(() => import("./routes/CommentArchive"));

const Features = lazy(() => import("./routes/Features"));
const PrivacyPolicy = lazy(() => import("./routes/PrivacyPolicy"));
const TermsOfServices = lazy(() => import("./routes/TermsOfServices"));

//! Admin Controls
const Profanities = lazy(() => import("./routes/Profanities"));
const Reviews = lazy(() => import("./routes/Reviews"));
const Pending = lazy(() => import("./routes/Pending"));
const Users = lazy(() => import("./routes/Users"));
const UpdateLinks = lazy(() => import("./routes/UpdateLinks"));

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = () => setColorScheme(colorScheme === "dark" ? "light" : "dark");

  useFavicon(haribonFavicon);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider limit={5} zIndex={2077}>
              <Routes>
                <Route path={"/"} element={<Login />} />
                <Route path={"/login"} element={<Login />} />
                <Route
                  path={"/setup"}
                  element={
                    <Protected>
                      <AccountSetup />
                    </Protected>
                  }
                />
                <Route
                  path={"/home"}
                  element={
                    <Protected>
                      <Home />
                    </Protected>
                  }
                />
                <Route
                  path={"/post"}
                  element={
                    <Protected>
                      <Post />
                    </Protected>
                  }
                />
                <Route
                  path={"/archive"}
                  element={
                    <Protected>
                      <Archive />
                    </Protected>
                  }
                />
                <Route
                  path={"/college"}
                  element={
                    <Protected>
                      <College />
                    </Protected>
                  }
                />
                <Route
                  path={"/severe"}
                  element={
                    <Protected>
                      <Severe />
                    </Protected>
                  }
                />
                <Route
                  path={"/moderate"}
                  element={
                    <Protected>
                      <Moderate />
                    </Protected>
                  }
                />
                <Route
                  path={"/mild"}
                  element={
                    <Protected>
                      <Mild />
                    </Protected>
                  }
                />
                <Route
                  path={"/program"}
                  element={
                    <Protected>
                      <Program />
                    </Protected>
                  }
                />
                <Route
                  path={"/profile"}
                  element={
                    <Protected>
                      <Profile />
                    </Protected>
                  }
                />
                <Route
                  path={"/category"}
                  element={
                    <Protected>
                      <Category />
                    </Protected>
                  }
                />
                <Route
                  path={"/category/:id"}
                  element={
                    <Protected>
                      <CategoryId />
                    </Protected>
                  }
                />
                <Route
                  path={"/tags"}
                  element={
                    <Protected>
                      <Tags />
                    </Protected>
                  }
                />
                <Route
                  path={"/tags/:id"}
                  element={
                    <Protected>
                      <Tag />
                    </Protected>
                  }
                />
                <Route
                  path={"/g-forms-link"}
                  element={
                    <Protected>
                      <GFormsLink />
                    </Protected>
                  }
                />
                <Route
                  path={"/comment/:id"}
                  element={
                    <Protected>
                      <Comment />
                    </Protected>
                  }
                />
                <Route
                  path={"/comment/archive/:id"}
                  element={
                    <Protected>
                      <CommentArchive />
                    </Protected>
                  }
                />
                <Route
                  path={"/profanities"}
                  element={
                    <Protected>
                      <Profanities />
                    </Protected>
                  }
                />
                <Route
                  path={"/reports"}
                  element={
                    <Protected>
                      <Reviews />
                    </Protected>
                  }
                />
                <Route
                  path={"/pending"}
                  element={
                    <Protected>
                      <Pending />
                    </Protected>
                  }
                />
                <Route
                  path={"/users"}
                  element={
                    <Protected>
                      <Users />
                    </Protected>
                  }
                />
                <Route
                  path={"/update-links"}
                  element={
                    <Protected>
                      <UpdateLinks />
                    </Protected>
                  }
                />

                <Route
                  path={"/features"}
                  element={
                    <Protected>
                      <Features />
                    </Protected>
                  }
                />
                <Route
                  path={"/privacy-policy"}
                  element={
                    <Protected>
                      <PrivacyPolicy />
                    </Protected>
                  }
                />
                <Route
                  path={"/terms-of-services"}
                  element={
                    <Protected>
                      <TermsOfServices />
                    </Protected>
                  }
                />

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
