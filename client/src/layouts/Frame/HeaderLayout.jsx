import React from "react";
import { Header, MediaQuery, Burger, Text, Image } from "@mantine/core";
import DarkModeButton from "../DarkModeButton";
import Notification from "../Frame/Notification";
import hariBirdLogo from "../../assets/hariBirdTransparent.svg";

function HeaderLayout({ opened, setOpened, dark, theme, toggleColorScheme }) {
  return (
    <Header height={70} p="md" style={{ display: "flex" }}>
      <div
        style={{
          zIndex: "500",
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
        </div>

        <div
          style={{
            fontFamily: "Poor Story",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: 70, marginLeft: "-0.750rem" }}>
            <Image src={hariBirdLogo} alt="Haribon Logo" />
          </div>
          <Text
            style={{
              fontFamily: "Poor Story",
              fontSize: "1.25rem",
              marginTop: "0.200rem",
              marginLeft: "-1rem",
            }}
          >
            Haribon E-Wall
          </Text>
        </div>
      </div>
      <Notification />
      <DarkModeButton />
    </Header>
  );
}

export default HeaderLayout;
