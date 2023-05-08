import React, { useLayoutEffect } from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { getUser } from "../firebase-config";

function Archive() {
  useDocumentTitle("Archive");

  return <Frame content={<ArchiveLayout />} path={"/archive"} />;
}

function ArchiveLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.userAgreedSLA) {
        navigate("/home");
      }
    });
  });

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to Haribon E-Wall!"}
      />
      <InfiniteScrolling type="archive" isArchive={true} />
    </div>
  );
}

export default Archive;
