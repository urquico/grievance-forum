import React from "react";
import { UnstyledButton, Group, ThemeIcon, Text, Indicator } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function NavLinks({ title, icon, color, isLastElement, path, indicator, log, logOut, disabled }) {
  const navigate = useNavigate();

  const linkToPath = () => {
    if (log) {
      logOut();
      navigate("/");
    } else {
      disabled ? navigate("/setup") : navigate(path);
    }
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
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={disabled ? "gray" : color} variant="light">
          {icon}
        </ThemeIcon>

        <Indicator
          disabled={!indicator}
          color={"red"}
          withBorder
          label="!"
          size={20}
          dot
          offset={1}
        >
          <Text size="sm" c={disabled ? "dimmed" : ""}>
            {title}
          </Text>
        </Indicator>
      </Group>
    </UnstyledButton>
  );
}

export default NavLinks;
