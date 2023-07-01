import React, { useLayoutEffect } from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Mild() {
  useDocumentTitle("Mild Topics");

  return <Frame content={<MildLayout />} path={"/mild"} />;
}

function MildLayout() {
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
      <IntroductionCard name={localStorage.getItem("name")} message={"Here are the mild cases."} />
      <InfiniteScrolling type="mild" isArchive={false} />
    </div>
  );
}

export default Mild;
