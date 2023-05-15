import React, { useLayoutEffect } from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Moderate() {
  useDocumentTitle("Severe Topics");

  return <Frame content={<ModerateLayout />} path={"/moderate"} />;
}

function ModerateLayout() {
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
        message={"Here are the moderate cases."}
      />
      <InfiniteScrolling type="moderate" isArchive={false} />
    </div>
  );
}

export default Moderate;
