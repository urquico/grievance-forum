import React, { useLayoutEffect, useState } from "react";
import { Text, useMantineTheme, TypographyStylesProvider } from "@mantine/core";
import { getUser } from "../firebase-config";

function IntroductionCard({ name, message }) {
  const theme = useMantineTheme();
  const [userName, setUserName] = useState("");

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setUserName(result);
    });
  }, []);

  return (
    <div
      style={{
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],

        borderRadius: "13px",
        padding: "2.375rem",
        fontSize: "1.125rem",

        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        HELLO, {userName?.firstName === "" ? name : <>{typeof userName?.firstName === "string" ? userName?.firstName.toUpperCase() : ""}!</>}
      </Text>
      <Text
        style={{
          color: theme.colorScheme === "dark" ? theme.colors.gray[6] : "#3E3E3E",
        }}
      >
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </TypographyStylesProvider>
      </Text>
    </div>
  );
}

export default IntroductionCard;
