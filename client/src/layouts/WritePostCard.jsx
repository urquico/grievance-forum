import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMantineTheme, Text, Switch, Select, MultiSelect, Button, Modal, Anchor, Alert } from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconHash, IconCheck, IconX, IconAt, IconAlertCircle } from "@tabler/icons";
import axios from "axios";

import { PORT } from "../Globals";
import User from "./User";
import PostCard from "./PostCard";
import { getAllContacts, getAllTags, getUser } from "../firebase-config";

const initialValue = "";

function WritePostCard() {
  const [text, setText] = useState(initialValue);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [opened, setOpened] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [containsProfanity, setContainsProfanity] = useState(null);

  const theme = useMantineTheme();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setCollege(result.college);
      setProgram(result.program);
    });
  }, []);

  const submitPost = () => {
    if (selectedCategory === undefined) {
      setCategoryError(true);
    } else {
      profanityCheck(text);
      setOpened(true);
    }
  };

  const profanityCheck = async (data) => {
    const API_TOKEN = "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";
    await axios
      .post("https://api-inference.huggingface.co/models/Dabid/abusive-tagalog-profanity-detection", data, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      })
      .then((result) => {
        result.data[0].sort((a, b) => {
          const labelA = a.label.toLowerCase();
          const labelB = b.label.toLowerCase();
          if (labelA < labelB) {
            return -1;
          }
          if (labelA > labelB) {
            return 1;
          }
          return 0;
        });
        if (result.data[0][0].score > result.data[0][1].score) {
          setContainsProfanity(true);
        } else {
          setContainsProfanity(false);
        }
      })
      .catch((err) => {
        setContainsProfanity(null);
      });
  };

  const writePostQuery = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Submitting your post",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    setOpened(false);
    axios
      .post(`${PORT}/writePost`, {
        category: selectedCategory,
        isAnonymous: isAnonymous,
        message: text,
        userId: localStorage.getItem("email"),
        tags: selectedTags,
        college: college,
        program: program,
        receiver: receiver,
      })
      .then(() => {
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Success!",
          message: "Post has been Submitted",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });

        navigate("/home");
      })
      .catch((error) => {
        console.log(error.message);
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
    <div
      style={{
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: "13px",
        padding: "2.375rem",
        marginTop: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Modal
        style={{ borderRadius: "13px" }}
        size="lg"
        opened={opened}
        centered
        onClose={() => {
          setOpened(false);
          setContainsProfanity(null);
        }}
        title={
          <Text fz="xl" fw={700} style={{ marginLeft: "1rem" }}>
            Here's what your post will look like
          </Text>
        }
      >
        <PostPreview isAnonymous={isAnonymous} tags={selectedTags} category={selectedCategory} message={text} submitQuery={writePostQuery} containsProfanity={containsProfanity} />
      </Modal>

      <Text c="dimmed" ta="center" fs="italic" style={{ marginBottom: "1rem" }}>
        Do you feel like you have a complaint that you just really cannot post publicly? Head over to our student council's <Anchor href="/g-forms-link">grievance forms</Anchor>
      </Text>

      <Text c="dimmed" ta="center" fs="italic" style={{ marginBottom: "1rem" }} fw="bold">
        For urgent personal concerns requiring immediate action, please click{" "}
        <Anchor href="https://findahelpline.com/ph" target="_blank">
          here
        </Anchor>
        .
      </Text>

      <PostAnonymously setIsAnonymous={setIsAnonymous} isAnonymous={isAnonymous} />

      <AddReceivers receiver={receiver} setReceiver={setReceiver} />

      <User
        publisher={localStorage.getItem("name")}
        isAnonymous={isAnonymous}
        email={localStorage.getItem("email")}
        isAdmin={""}
        isCurrentUserAdmin={false}
        hideTrashAndBadge={true}
      />
      <ChooseCategory
        isAnonymous={isAnonymous}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryError={categoryError}
        setCategoryError={setCategoryError}
      />
      <RichTextBox text={text} setText={setText} />
      <AddTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <Button style={{ marginTop: "0.75rem" }} onClick={submitPost}>
        <Text fw={700}>Post</Text>
      </Button>
    </div>
  );
}

function PostPreview({ isAnonymous, tags, category, message, submitQuery, containsProfanity }) {
  return (
    <>
      <PostCard
        isAnonymous={isAnonymous}
        email={localStorage.getItem("email")}
        tags={tags}
        category={category}
        time={0}
        post={message}
        postId={""}
        isSolved={false}
        voteNumber={0}
        previewOnly={true}
        isComment={false}
      />

      {containsProfanity ? (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red" style={{ marginTop: "1rem" }}>
          Your post appears to contain profane and abusive content. As a result, you are unable to submit your post.
        </Alert>
      ) : (
        <>
          {containsProfanity !== null ? (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Congrats!" color="green" style={{ marginTop: "1rem" }}>
              Your post is in compliance with the guidelines and is acceptable for submission.
            </Alert>
          ) : (
            <></>
          )}
        </>
      )}

      {containsProfanity === null ? (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red" style={{ marginTop: "1rem" }}>
          An error occurred while processing the data. Please close and reopen the preview to resolve the issue. If the error persists, please refresh the page or re-type the post.
        </Alert>
      ) : (
        <Button style={{ marginTop: "1rem", width: "100%" }} onClick={submitQuery} disabled={containsProfanity}>
          <Text fw={700}>Submit Post</Text>
        </Button>
      )}
    </>
  );
}

function PostAnonymously({ setIsAnonymous, isAnonymous }) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? "#25262B" : "#f4f4f4",
        borderRadius: "4px",
        border: "1px solid",
        borderColor: theme.colorScheme === "dark" ? "#373A40" : "#CED4DA",
        display: "flex",
        padding: "0.75rem",
        marginBottom: "1rem",
      }}
    >
      <Text
        fz="sm"
        style={{
          marginLeft: "0",
          marginRight: "auto",
          marginTop: "0.3rem",
          color: theme.colorScheme === "dark" ? theme.colors.gray[6] : "#5E5F61",
        }}
      >
        Post Anonymously
      </Text>

      <Switch
        style={{
          marginTop: "-1rem",
        }}
        checked={isAnonymous}
        onChange={(event) => setIsAnonymous(event.currentTarget.checked)}
        labelPosition="left"
        onLabel="ANONYMOUS"
        offLabel={`YOU`}
        size="lg"
      />
    </div>
  );
}

function ChooseCategory({ isAnonymous, selectedCategory, setSelectedCategory, categoryError, setCategoryError }) {
  return (
    <>
      <Select
        style={{
          marginLeft: "2.90rem",
          width: "7.5rem",
          marginTop: isAnonymous ? "-0.75rem" : "0",
          // borderColor: "blue",
        }}
        value={selectedCategory}
        onChange={(val) => {
          setSelectedCategory(val);
          setCategoryError(false);
        }}
        placeholder="Category"
        error={categoryError ? "please choose a category" : ""}
        data={[
          { value: "other-concerns", label: "Others" },
          { value: "academic-concerns", label: "Academic" },
        ]}
      />
    </>
  );
}

function RichTextBox({ text, setText }) {
  return (
    <RichTextEditor
      style={{ marginTop: "1rem", zIndex: "1" }}
      value={text}
      onChange={setText}
      sticky={true}
      stickyOffset={60}
      placeholder={"Share your thoughts"}
      controls={[
        ["bold", "italic", "underline", "link", "strike", "clean"],
        ["unorderedList", "orderedList", "h1", "h2", "h3", "h4"],
        ["sup", "sub", "blockquote", "code"],
      ]}
    />
  );
}

function AddTags({ selectedTags, setSelectedTags }) {
  const ref = useRef(0);
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    getAllTags()
      .then((result) => {
        setData(() => [
          ...result.docs.map((doc) => ({
            ...doc.data(),
            label: doc.id.toUpperCase(),
            value: doc.id,
            group: "Tags Created by Users",
          })),
        ]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <MultiSelect
        style={{ marginTop: "0.75rem" }}
        ref={ref}
        data={data}
        value={selectedTags}
        placeholder="Write your tags here ..."
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setData((current) => [...current, item]);
          return item;
        }}
        maxSelectedValues={5}
        dropdownPosition="top"
        icon={<IconHash size={14} />}
        onChange={setSelectedTags}
        clearable
      />
    </div>
  );
}

function AddReceivers({ receiver, setReceiver }) {
  const ref = useRef(0);
  const [data, setData] = useState([]);

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
  }, []);

  return (
    <div>
      <MultiSelect
        style={{ marginBottom: "0.75rem" }}
        ref={ref}
        data={data}
        value={receiver}
        placeholder="Enter Recipient's PLM email here ..."
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setData((current) => [...current, item]);
          return item;
        }}
        maxSelectedValues={5}
        dropdownPosition="top"
        icon={<IconAt size={14} />}
        onChange={setReceiver}
        clearable
      />
    </div>
  );
}

export default WritePostCard;
