import React from "react";
import { Button, useMantineTheme, Text } from "@mantine/core";
import microsoftLogo from "../assets/ms-logo.svg";
import DarkModeButton from "../layouts/DarkModeButton";
import { signInWithMicrosoft } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Login() {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const login = async () => {
    await signInWithMicrosoft()
      .then((result) => {
        navigate("/home");
      })
      .catch((error) => {
        console.log(error.message);
        navigate("/login");
      });
  };

  return (
    <>
      <DarkModeButton />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "80vh",
        }}
      >
        <Text
          fz="xl"
          fw={500}
          style={{
            margin: "auto",
            marginBottom: "0",
            fontFamily: "Poor Story",
          }}
        >
          Haribon Grievance Forum
        </Text>
        <Button
          variant={theme.colorScheme === "dark" ? "none" : "outline"}
          color={theme.colorScheme === "dark" ? "none" : "gray"}
          style={{
            margin: "auto",
            marginTop: "0",
            fontFamily: "Segoe UI",
            fontSize: "0.938rem",
            height: "2.563rem",
            backgroundColor: theme.colorScheme === "dark" ? "#2f2f2f" : "#fff",
            color: theme.colorScheme === "dark" ? "#fff" : "#5e5e5e",
          }}
          leftIcon={<img src={microsoftLogo} alt={"Microsoft Logo"} />}
          onClick={login}
        >
          Sign in with Microsoft
        </Button>
      </div>
    </>
  );
}

export default Login;
