import React, { useEffect } from "react";
import { Button, useMantineTheme, Text, Image } from "@mantine/core";
import microsoftLogo from "../assets/ms-logo.svg";
import hariBirdLogo from "../assets/hariBirdLogo.svg";
import backDrop from "../assets/backdrop.svg";
import DarkModeButton from "../layouts/DarkModeButton";
import { signInWithMicrosoft } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PORT } from "../Globals";
import { useDocumentTitle } from "@mantine/hooks";

function Login() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  useDocumentTitle("Haribon E-Wall");

  useEffect(() => {
    axios.post(`${PORT}/generateVotePoint`);
  });

  const login = async () => {
    await signInWithMicrosoft()
      .then((result) => {
        localStorage.setItem("name", result.user.displayName);
        localStorage.setItem("email", result.user.email);
        axios.post(`${PORT}/addUser`, {
          email: result.user.email,
          name: result.user.displayName,
        });
        navigate("/home");
      })
      .catch((error) => {
        console.log(error.message);
        navigate("/login");
      });
  };

  return (
    <div
      style={{
        margin: "0",
        backgroundImage: `url(${backDrop})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        backgroundPosition: "bottom center",
      }}
    >
      <DarkModeButton />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "80vh",
        }}
      >
        <div
          style={{
            margin: "auto",
            marginBottom: "0",
            textAlign: "center",
          }}
        >
          <div style={{ width: 100, marginLeft: "auto", marginRight: "auto" }}>
            <Image src={hariBirdLogo} alt="Haribon Logo" />
          </div>
          <Text
            fw={500}
            style={{
              margin: "auto",
              marginBottom: "0",
              fontFamily: "Poor Story",
              fontSize: "3rem",
              padding: "0",
            }}
          >
            Welcome to Haribon E-Wall!
          </Text>
          <Text
            style={{
              marginTop: "-1rem",
              fontSize: "0.750rem",
              fontFamily: "Lexend Deca",
              color: theme.colorScheme === "dark" ? "#fff" : "#5e5e5e",
            }}
          >
            Pamantasan ng Lungsod ng Maynila Computer Science Department
            Grievance Forum
          </Text>
        </div>
        <Button
          variant={theme.colorScheme === "dark" ? "none" : "outline"}
          color={theme.colorScheme === "dark" ? "none" : "gray"}
          style={{
            margin: "auto",
            marginTop: "1.000rem",
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
    </div>
  );
}

export default Login;
