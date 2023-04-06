import React, { useState } from "react";
import { useDocumentTitle } from "@mantine/hooks";
import { SegmentedControl, Divider } from "@mantine/core";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import AccountInformation from "../layouts/AccountInformation";

function Profile() {
  useDocumentTitle("Profile");

  return <Frame content={<ProfileLayout />} path={"/profile"} />;
}

function ProfileLayout() {
  const [view, setView] = useState("posts");
  console.log(view);

  return (
    <>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to your profile, you can see your activities here"}
      />
      <Divider
        my="xs"
        labelPosition="center"
        label={
          <SegmentedControl
            style={{ marginTop: "0.750rem" }}
            data={[
              { label: "Posts", value: "posts" },
              { label: "Account Information", value: "info" },
            ]}
            value={view}
            onChange={setView}
          />
        }
      />

      {view === "posts" ? (
        <InfiniteScrolling type="profile" isArchive={false} />
      ) : (
        <AccountInformation />
      )}
    </>
  );
}

export default Profile;
