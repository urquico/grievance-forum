/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { SegmentedControl, SimpleGrid, Center, Box, useMantineTheme, Text, Accordion, Badge, Button } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconDiscountCheck, IconAlertCircle, IconSchool, IconUser, IconCheck, IconX } from "@tabler/icons";
import { IconUserCog } from "@tabler/icons-react";
import TagLoader from "../layouts/Loading/TagLoader";
import { checkIfContainsNumber, getCollegeInfo, getMoreUsers, getProgramInfo, getUser, getUsers } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import EndPost from "../layouts/EndPost";
import axios from "axios";
import { PORT } from "../Globals";

const data = [
  {
    label: (
      <Center>
        <IconUser size="1rem" />
        <Box ml={10}>All Users</Box>
      </Center>
    ),
    value: "alpha",
  },
  {
    label: (
      <Center>
        <IconDiscountCheck size="1rem" />
        <Box ml={10}>Registered</Box>
      </Center>
    ),
    value: "reg",
  },
  {
    label: (
      <Center>
        <IconAlertCircle size="1rem" />
        <Box ml={10}>Unregistered</Box>
      </Center>
    ),
    value: "unreg",
  },
  {
    label: (
      <Center>
        <IconUserCog size="1rem" />
        <Box ml={10}>Admins</Box>
      </Center>
    ),
    value: "admin",
  },
  {
    label: (
      <Center>
        <IconSchool size="1rem" />
        <Box ml={10}>Students</Box>
      </Center>
    ),
    value: "student",
  },
];

function Users() {
  useDocumentTitle("Users");
  return <Frame content={<UsersLayout />} path={"/users"} />;
}

function UsersLayout() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("alpha");

  const [lastDoc, setLastDoc] = useState();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  useLayoutEffect(() => {
    getUsers().then((result) => {
      updateState(result);
      setIsLoading(false);
    });
  }, []);

  const fetchMoreData = () => {
    getMoreUsers(lastDoc).then((result) => {
      updateState(result);
    });
  };

  const updateState = (result) => {
    const isCollectionEmpty = result.size === 0;
    if (!isCollectionEmpty) {
      setUsers((currentUser) => [
        ...currentUser,
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      ]);
      const lastDoc = result.docs[result.docs.length - 1];
      setLastDoc(lastDoc);
    }
  };

  const alphabetizeData = () => {
    let sortedUser = users;

    return <AccordionData data={sortedUser} caption="Here are the Users" />;
  };

  const registeredData = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (user.userAgreedSLA) {
        sortedUser.push(user);
      }
    });

    return <AccordionData data={sortedUser} caption="Here are the Registered Users" />;
  };

  const unRegisteredData = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (!user.userAgreedSLA) {
        sortedUser.push(user);
      }
    });

    return <AccordionData data={sortedUser} caption="Here are the Unregistered Users" />;
  };

  const admins = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (user.isAdmin) {
        sortedUser.push(user);
      }
    });

    return <AccordionData data={sortedUser} caption="Here are the Admin Users" />;
  };

  const students = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (!user.isAdmin) {
        sortedUser.push(user);
      }
    });

    return <AccordionData data={sortedUser} caption="Here are the Students Users" />;
  };

  return (
    <>
      <IntroductionCard name={localStorage.getItem("name")} message={"Here are the users of Haribon E-Wall"} />

      {/* layout */}
      <SimpleGrid
        style={{ marginTop: "0.750rem" }}
        cols={1}
        spacing="xs"
        verticalSpacing="xs"
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 600, cols: 1, spacing: "sm" },
        ]}
      >
        <SegmentedControl onChange={setView} data={data} color="pink" />
      </SimpleGrid>

      <div
        style={{
          height: "auto",
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          borderRadius: "13px",
          padding: "2.375rem",
          fontSize: "1.125rem",
          marginTop: "0.750rem",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        {isLoading ? (
          <>
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
          </>
        ) : (
          <>{view === "alpha" ? alphabetizeData() : view === "reg" ? registeredData() : view === "unreg" ? unRegisteredData() : view === "admin" ? admins() : students()}</>
        )}

        <div style={{ display: "flex" }}>
          <Button
            variant="subtle"
            color="dark"
            onClick={fetchMoreData}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "1rem",
            }}
          >
            Load more users
          </Button>
        </div>
      </div>

      {users.length === 0 ? (
        <EndPost content="No registered users yet" />
      ) : users ? (
        <>
          <EndPost content="You've reached the end" />
        </>
      ) : (
        ""
      )}
    </>
  );
}

function AccordionData({ data, caption }) {
  return (
    <>
      <Text ta="center" fz="md" c="dimmed" style={{ marginBottom: "1rem" }}>
        {caption}
      </Text>
      <Accordion>
        {data.map((user, index) => {
          return (
            <div key={index}>
              <AccordionUser collegeData={user?.college} user={user} programData={user?.program} />
            </div>
          );
        })}
      </Accordion>
    </>
  );
}

function AccordionUser({ collegeData, user, programData }) {
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");
  const [isAdmin, setIsAdmin] = useState();

  const getCollegeData = () => {
    if (user.userAgreedSLA) {
      getCollegeInfo(collegeData).then((result) => {
        setCollege(result.label);
      });
      getProgramData();
      setIsAdmin(user.isAdmin);
    }
  };

  const getProgramData = () => {
    getProgramInfo(collegeData, programData).then((result) => {
      setProgram(result.label);
    });
  };

  const toggleAdmin = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Processing",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    if (isAdmin) {
      console.log(user.id);
      axios
        .post(`${PORT}/toggleAdmin`, { isAdmin: false, userId: user.id })
        .then(() => {
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "teal",
              title: "Success!",
              message: `${user.lastName} has been removed as admin`,
              icon: <IconCheck size={16} />,
              autoClose: 2000,
            });
          }, 3000);

          setIsAdmin(false);
        })
        .catch((error) => {
          console.log(error.message);
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "red",
              title: "Error!!",
              message: error.message,
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }, 3000);
        });
    } else {
      axios
        .post(`${PORT}/toggleAdmin`, { isAdmin: true, userId: user.id })
        .then(() => {
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "teal",
              title: "Success!",
              message: `${user.lastName} is now an admin`,
              icon: <IconCheck size={16} />,
              autoClose: 2000,
            });
          }, 3000);

          setIsAdmin(true);
        })
        .catch((error) => {
          console.log(error.message);
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "red",
              title: "Error!!",
              message: error.message,
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }, 3000);
        });
    }
  };

  return (
    <Accordion.Item value={user.id} onClick={getCollegeData}>
      <Accordion.Control>
        <SimpleGrid
          cols={2}
          spacing="xs"
          verticalSpacing="xs"
          breakpoints={[
            { maxWidth: "62rem", cols: 3, spacing: "md" },
            { maxWidth: "48rem", cols: 2, spacing: "sm" },
            { maxWidth: "36rem", cols: 1, spacing: "sm" },
          ]}
        >
          <div>
            <Text fw="bold">{user.name}</Text>
            <Badge color={user.isAdmin ? "blue" : "green"}>{user.isAdmin ? <>{checkIfContainsNumber(user.id) ? "Admin" : "Faculty"}</> : "Student"}</Badge>
          </div>
        </SimpleGrid>
      </Accordion.Control>
      {user.userAgreedSLA === undefined ? (
        <Accordion.Panel>
          <Text ta="center" fw="bold">
            Not Registered Yet!
          </Text>
        </Accordion.Panel>
      ) : (
        <>
          <Accordion.Panel>
            <Text fw="bold" fz="sm">
              COLLEGE:
              <Badge color="pink" variant="outline" style={{ marginLeft: "1.300rem" }}>
                {college}
              </Badge>
            </Text>
            <Text fw="bold" fz="sm" style={{ marginTop: "0.500rem" }}>
              PROGRAM:
              <Badge color="orange" variant="outline" style={{ marginLeft: "0.500rem" }}>
                {program}
              </Badge>
            </Text>

            <Button
              variant="gradient"
              onClick={toggleAdmin}
              gradient={isAdmin ? { from: "red", to: "orange" } : { from: "teal", to: "lime" }}
              fullWidth
              style={{ marginTop: "0.750rem" }}
            >
              {isAdmin ? "Remove as Admin" : "Add as Admin"}
            </Button>
          </Accordion.Panel>
        </>
      )}
    </Accordion.Item>
  );
}

export default Users;
