import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMantineTheme } from "@mantine/core";
import { getUser, getCollegeInfo, getProgramInfo } from "../firebase-config";
import { Loader, Center, Stack, TextInput, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

function AccountInformation() {
  const theme = useMantineTheme();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedAge, setFetchedAge] = useState(0);
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");
  const dateToday = new Date();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      const fetchedBirthday = new Date(result?.birthday);
      setUser(result);
      setFetchedAge((dateToday.getTime() - fetchedBirthday.getTime()) / 1000 / 31536000);
      setIsLoading(false);
    });
  }, []);

  useLayoutEffect(() => {
    getCollegeInfo(user?.college).then((result) => {
      setCollege(result.label);
    });
  }, []);

  useLayoutEffect(() => {
    getProgramInfo(user?.college, user?.program).then((result) => {
      setProgram(result.label);
    });
  }, []);

  const editInfo = () => {
    navigate("/setup");
  };

  return (
    <div
      style={{
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        marginTop: "1rem",
        borderRadius: "13px",
        padding: "2.375rem",
        fontSize: "1.125rem",

        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      {isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <Stack spacing="xs">
          <TextInput value={user.isAdmin ? "Admin" : "Student"} label="Account Type:" radius="xs" disabled />

          <TextInput value={localStorage.getItem("email")} label="Email Address:" radius="xs" disabled />

          {user.userAgreedSLA === true ? (
            <>
              <TextInput value={user.firstName} label="First Name:" radius="xs" disabled />
              <TextInput value={user.lastName} label="Last Name:" radius="xs" disabled />
              <DatePicker
                placeholder={`${new Date(user.birthday).getMonth() + 1} / ${new Date(user.birthday).getDate()} / ${new Date(user.birthday).getFullYear()}`}
                label="Birthday:"
                radius="xs"
                disabled
              />
              <TextInput label="Age:" radius="xs" disabled placeholder={Math.floor(fetchedAge)} />
              <TextInput value={college} label="College:" radius="xs" disabled />
              <TextInput value={program} label="Program:" radius="xs" disabled />
            </>
          ) : (
            <>
              <TextInput value={user.name} label="Account Name:" radius="xs" disabled />
            </>
          )}
          <Button onClick={editInfo}>Edit Information</Button>
        </Stack>
      )}
    </div>
  );
}

export default AccountInformation;
