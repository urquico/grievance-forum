import React from "react";
import { Header, MediaQuery, Burger, Text } from "@mantine/core";
import DarkModeButton from "../DarkModeButton";

function HeaderLayout({ opened, setOpened, dark, theme, toggleColorScheme }) {
  return (
    <div>
      <Header height={70} p="md">
        <div
          style={{
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

          <div style={{ fontFamily: "Poor Story" }}>
            <Text style={{ fontFamily: "Poor Story", fontSize: "1.25rem" }}>
              Haribon E-Wall
            </Text>
          </div>

          <DarkModeButton />
        </div>
      </Header>
    </div>
  );
}

export default HeaderLayout;
