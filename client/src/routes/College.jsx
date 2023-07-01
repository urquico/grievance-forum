import React, { useLayoutEffect } from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function College() {
  useDocumentTitle("College");

  return <Frame content={<CollegeLayout />} path={"/college"} />;
}

function CollegeLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.userAgreedSLA) {
        navigate("/home");
      }
    });
  }, [navigate]);

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to Haribon E-Wall!"}
      />
      <InfiniteScrolling type="college" isArchive={false} />
    </div>
  );
}

export default College;
