import React, { useState, useLayoutEffect } from "react";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";

import {
  useMantineTheme,
  Input,
  Button,
  Text,
  List,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { getAllProfanities } from "../firebase-config";
import { PORT } from "../Globals";
import TagLoader from "../layouts/Loading/TagLoader";
import ProfanityList from "../layouts/ProfanityList";

function Profanities() {
  useDocumentTitle("Profanities");
  return <Frame content={<ProfanitiesLayout />} path={"/profanities"} />;
}

function ProfanitiesLayout() {
  const theme = useMantineTheme();
  const [profanity, setProfanity] = useState("");
  const [profanityList, setProfanityList] = useState([]);

  useLayoutEffect(() => {
    getAllProfanities().then((result) => {
      setProfanityList(result.docs);
    });
  }, []);

  const addProfanity = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Bl*cking a Profanity",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    let dataProfanities = [];
    getAllProfanities().then((result) => {
      result.docs.forEach((badWords) => {
        dataProfanities.push(badWords.id);
      });

      if (!dataProfanities.includes(profanity) && profanity !== "") {
        axios
          .post(`${PORT}/addProfanity`, {
            profanity: profanity,
            userId: localStorage.getItem("email"),
          })
          .then((result) => {
            setTimeout(() => {
              updateNotification({
                id: "load-data",
                color: "teal",
                title: "Success!",
                message: "The Profanity has been blocked",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
              });
            }, 3000);
            setProfanityList((currentList) => [
              ...currentList,
              { id: profanity },
            ]);
          })
          .catch((error) => {
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
      } else if (profanity === "") {
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "red",
            title: "Error!!",
            message: "Please enter something",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        }, 3000);
      } else {
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "red",
            title: "Error!!",
            message: "The profanity has already been blocked before",
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        }, 3000);
      }
    });
  };

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`sa mga admin dyan, pwede kayo mag add ng profanity dyan`}
      />
      <div
        style={{
          height: "auto",
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          borderRadius: "13px",
          padding: "2.375rem",
          marginTop: "1rem",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Input.Wrapper label="Block Profanity">
          <Input
            placeholder="Enter a cursed word here"
            value={profanity}
            onChange={(e) => {
              setProfanity(e.target.value);
            }}
          />
        </Input.Wrapper>
        <Button style={{ marginTop: "0.750rem" }} onClick={addProfanity}>
          Block
        </Button>

        <Divider
          my="sm"
          label={
            <>
              <Text style={{ marginTop: "0" }} fz="md" fw="bold">
                Here are the list of blocked words
              </Text>
            </>
          }
        />

        <Text style={{ marginBottom: "1.0rem", marginTop: "-1rem" }} fz="xs">
          It is recommended to block a single word profanity only
        </Text>
        <List>
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              { maxWidth: 980, cols: 3, spacing: "md" },
              { maxWidth: 755, cols: 2, spacing: "sm" },
              { maxWidth: 600, cols: 1, spacing: "sm" },
            ]}
          >
            {profanityList.length === 0 ? (
              <>
                <TagLoader />
                <TagLoader />
                <TagLoader />
              </>
            ) : (
              profanityList?.map((bad) => {
                return <ProfanityList badword={bad.id} />;
              })
            )}
          </SimpleGrid>
        </List>
      </div>
    </div>
  );
}

export default Profanities;
