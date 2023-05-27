import React, { useLayoutEffect } from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Severe() {
  useDocumentTitle("Severe Topics");

  return <Frame content={<SevereLayout />} path={"/severe"} />;
}

function SevereLayout() {
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
      <IntroductionCard name={localStorage.getItem("name")} message={"Here are the severe cases."} />
      <InfiniteScrolling type="severe" isArchive={false} />
    </div>
  );
}

export default Severe;
