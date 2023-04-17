import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import {
  SegmentedControl,
  TextInput,
  SimpleGrid,
  Center,
  Box,
  useMantineTheme,
  Text,
  Accordion,
  Group,
  Progress,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconDiscountCheck,
  IconAlertCircle,
  IconSchool,
  IconUser,
} from "@tabler/icons";
import { IconUserCog } from "@tabler/icons-react";
import TagLoader from "../layouts/Loading/TagLoader";
import {
  getCollegeInfo,
  getProgramInfo,
  getUser,
  getUsers,
} from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import EndPost from "../layouts/EndPost";

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

  useLayoutEffect(() => {
    getUsers().then((result) => {
      setUsers(() => [
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      ]);
      setIsLoading(false);
    });
  }, []);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  const alphabetizeData = () => {
    const sortedUser = users;

    return <AccordionData data={sortedUser} caption="Here are the Users" />;
  };

  const registeredData = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (user.userAgreedSLA) {
        sortedUser.push(user);
      }
    });

    return (
      <AccordionData
        data={sortedUser}
        caption="Here are the Registered Users"
      />
    );
  };

  const unRegisteredData = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (!user.userAgreedSLA) {
        sortedUser.push(user);
      }
    });

    return (
      <AccordionData
        data={sortedUser}
        caption="Here are the Unregistered Users"
      />
    );
  };

  const admins = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (user.isAdmin) {
        sortedUser.push(user);
      }
    });

    return (
      <AccordionData data={sortedUser} caption="Here are the Admin Users" />
    );
  };

  const students = () => {
    const sortedUser = [];
    users.forEach((user) => {
      if (!user.isAdmin) {
        sortedUser.push(user);
      }
    });

    return (
      <AccordionData data={sortedUser} caption="Here are the Students Users" />
    );
  };

  return (
    <>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Heto ung list of users idool"}
      />

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
        <SegmentedControl
          fullWidth
          onChange={setView}
          data={data}
          color="pink"
        />
        <TextInput
          style={{ width: "100%" }}
          icon={<IconSearch size="0.8rem" />}
          placeholder="Enter a name"
        ></TextInput>
      </SimpleGrid>

      <div
        style={{
          height: "auto",
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
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
          <>
            {view === "alpha"
              ? alphabetizeData()
              : view === "reg"
              ? registeredData()
              : view === "unreg"
              ? unRegisteredData()
              : view === "admin"
              ? admins()
              : students()}
          </>
        )}
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
      <Text ta="center" fz="md" c="dimmed">
        {caption}
      </Text>
      <Accordion>
        {data.map((user, index) => {
          return (
            <div key={index}>
              <AccordionUser
                collegeData={user?.college}
                user={user}
                programData={user?.program}
              />
            </div>
          );
        })}
      </Accordion>
    </>
  );
}

function AccordionUser({ collegeData, user, programData }) {
  const theme = useMantineTheme();
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");

  const solvedPost = Math.random() * 100;
  const unSolvedPost = 100 - solvedPost;

  const getCollegeData = () => {
    getCollegeInfo(collegeData).then((result) => {
      setCollege(result.label);
    });
    getProgramData();
  };

  const getProgramData = () => {
    getProgramInfo(collegeData, programData).then((result) => {
      setProgram(result.label);
    });
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
            <Badge color={user.isAdmin ? "blue" : "green"}>
              {user.isAdmin ? "Admin" : "Student"}
            </Badge>
          </div>
          <div>
            <Group position="apart">
              <Text fz="xs" c="teal" weight={700}>
                {solvedPost.toFixed(0)}%
              </Text>
              <Text fz="xs" c="red" weight={700}>
                {unSolvedPost.toFixed(0)}%
              </Text>
            </Group>
            <Progress
              sections={[
                {
                  value: solvedPost,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.teal[9]
                      : theme.colors.teal[6],
                  tooltip: "Solved",
                },
                {
                  value: unSolvedPost,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.red[9]
                      : theme.colors.red[6],
                  tooltip: "Unsolved",
                },
              ]}
            />
          </div>
        </SimpleGrid>
      </Accordion.Control>
      <Accordion.Panel>
        {collegeData === undefined ? "wala" : college}
      </Accordion.Panel>
      <Accordion.Panel>
        {programData === undefined ? "wala" : program}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default Users;
