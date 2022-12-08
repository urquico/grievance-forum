import React, { useState, useRef } from "react";
import {
  useMantineTheme,
  Text,
  Switch,
  Select,
  MultiSelect,
  Button,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";
import { IconHash } from "@tabler/icons";

import User from "./User";

const initialValue = "<p><b>Share</b> your thoughts ...</p>";

function WritePostCard() {
  const [text, setText] = useState(initialValue);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const theme = useMantineTheme();

  const submitPost = () => {};

  return (
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
      <PostAnonymously
        setIsAnonymous={setIsAnonymous}
        isAnonymous={isAnonymous}
      />
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
      />
      <RichTextBox text={text} setText={setText} />
      <AddTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <Button style={{ marginTop: "0.75rem" }} onClick={submitPost}>
        <Text fw={700}>Post</Text>
      </Button>
    </div>
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
          color:
            theme.colorScheme === "dark" ? theme.colors.gray[6] : "#5E5F61",
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

function ChooseCategory({
  isAnonymous,
  selectedCategory,
  setSelectedCategory,
}) {
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
        onChange={setSelectedCategory}
        placeholder="Category"
        data={[
          { value: "Personal", label: "Personal" },
          { value: "Academic", label: "Academic" },
        ]}
      />
    </>
  );
}

function RichTextBox({ text, setText }) {
  return (
    <RichTextEditor
      style={{ marginTop: "1rem", zIndex: "100", height: "13.75rem" }}
      value={text}
      onChange={setText}
      sticky={true}
      stickyOffset={100}
      controls={[
        ["bold", "italic", "underline", "link", "strike", "clean"],
        ["unorderedList", "orderedList", "h1", "h2", "h3", "h4"],
        ["sup", "sub", "blockquote"],
      ]}
    />
  );
}

function AddTags({ selectedTags, setSelectedTags }) {
  const ref = useRef(0);
  const [data, setData] = useState([
    {
      value: "Depression",
      label: "Depression",
      group: "personal",
    },
    {
      value: "How to file LOA",
      label: "How to file LOA",
      group: "academic",
    },
  ]);

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

export default WritePostCard;
