import React from "react";
import { UnstyledButton, Group, ThemeIcon, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function NavLinks({ title, icon, color, isLastElement, path }) {
  const navigate = useNavigate();

  const linkToPath = () => {
    navigate(path);
  };

  return (
    <UnstyledButton
      onClick={linkToPath}
      style={{ marginBottom: isLastElement ? "auto" : "0px" }}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{title}</Text>
      </Group>
    </UnstyledButton>
  );
}

export default NavLinks;
