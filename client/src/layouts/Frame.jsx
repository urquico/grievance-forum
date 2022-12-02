import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { auth, logOut } from "../firebase-config";
import { useNavigate } from "react-router-dom";

// includes the navigation, sidebar, responsive UI etc.

function Frame({ content }) {
  const navigate = useNavigate();

  useEffect(() => {
    // redirects to login page when accessing a url that requires authentication
    if (localStorage.getItem("name") === null) {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    logOut();
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      {/* add navigations here */}
      <Button onClick={logout}>Logout</Button>
      {content}
    </div>
  );
}

export default Frame;
