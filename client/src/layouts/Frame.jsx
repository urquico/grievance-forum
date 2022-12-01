import React from "react";
import { Button } from "@mantine/core";
import { auth, logOut } from "../firebase-config";
import { useNavigate } from "react-router-dom";
// includes the navigation, sidebar, responsive UI etc.

function Frame() {
  const navigate = useNavigate();

  console.log(auth.currentUser);
  const logout = () => {
    logOut();
    navigate("/");
  };
  return (
    <div>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

export default Frame;
