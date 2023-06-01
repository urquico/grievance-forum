import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";

import { TextInput, Text, Anchor, Modal, Button, CopyButton, Tooltip } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

import { getAllContacts, getUser } from "../firebase-config";
import axios from "axios";
import { PORT } from "../Globals";
import EndPost from "../layouts/EndPost";

function UpdateLinks() {
  useDocumentTitle("Update Links");
  return <Frame content={<UpdateLinksLayout />} path={"/update-links"} />;
}

function UpdateLinksLayout() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [updateWhat, setUpdateWhat] = useState("");
  const [type, setType] = useState("");
  const [contactId, setContactId] = useState("");

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  useLayoutEffect(() => {
    getAllContacts()
      .then((result) => {
        setData(() => [
          ...result.docs.map((doc) => ({
            ...doc.data(),
            label: doc.id,
          })),
        ]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [opened]);

  const updateQuery = (type, contactId) => {
    setOpened(true);
    setUpdateWhat(`You are now updating the ${type}`);
    setType(type);
    setContactId(contactId);
  };

  const submitButton = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Updating...",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    axios
      .post(`${PORT}/updateContacts`, { contactId: contactId, value: newValue, type: type })
      .then(() => {
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Success!",
          message: `The ${type} has been updated`,
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
        setOpened(false);
      })
      .catch((error) => {
        updateNotification({
          id: "load-data",
          color: "red",
          title: "Error!!",
          message: error.message,
          icon: <IconX size={16} />,
          autoClose: 2000,
        });
      });
  };

  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={`You can update admin links here`} />
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setNewValue("");
        }}
        radius="md"
        centered
        size={260}
      >
        <Text>{updateWhat}</Text>
        <TextInput placeholder="Enter new value" onChange={(event) => setNewValue(event.currentTarget.value)} />
        <Button style={{ marginTop: "0.500rem" }} fullWidth onClick={submitButton}>
          Submit
        </Button>
      </Modal>
      {data?.map((contact, index) => {
        if (contact.label !== "Developers") {
          return (
            <div key={index}>
              <Text fw="bold" fz="xl" style={{ marginTop: "1rem" }}>
                {contact.label}
              </Text>
              <TextInput placeholder={contact?.fbLink} label={<Text c="dimmed">FB Link: </Text>} disabled />
              <Text fz="xs">
                <Anchor onClick={() => updateQuery("FB Link", contact.label)}>click to update FB Link</Anchor>
              </Text>

              <TextInput placeholder={contact?.gForms} label={<Text c="dimmed">Forms: </Text>} disabled />
              <Text fz="xs">
                <Anchor onClick={() => updateQuery("Forms Link", contact.label)}>click to update Forms Link</Anchor>
              </Text>

              <TextInput placeholder={contact?.value} label={<Text c="dimmed">Email: </Text>} disabled />
              <Text fz="xs" style={{ marginBottom: "1rem" }}>
                <Anchor onClick={() => updateQuery("Email", contact.label)}>click to update Email</Anchor>
              </Text>
            </div>
          );
        }
        return <></>;
      })}
      <EndPost
        content={
          <>
            {
              <CopyButton value="haribondevelopers@gmail.com" timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                    <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                      <Button>Contact the Developer if your organization is not included</Button>
                    </Tooltip>
                  </Tooltip>
                )}
              </CopyButton>
            }{" "}
          </>
        }
      />
    </div>
  );
}

export default UpdateLinks;
