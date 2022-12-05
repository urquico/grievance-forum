import React from "react";
import { Header, MediaQuery, Burger, Text, ActionIcon } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";
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
              Haribon Knights E-Wall
            </Text>
          </div>

          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            <ActionIcon
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </div>
        </div>
      </Header>
    </div>
  );
}

export default HeaderLayout;
