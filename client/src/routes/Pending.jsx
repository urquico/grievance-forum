import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import PendingPosts from "../layouts/PendingPosts";
import IntroductionCard from "../layouts/IntroductionCard";

function Reviews() {
  useDocumentTitle("Pending");
  return <Frame content={<PendingLayout />} path={"/pending"} />;
}

function PendingLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  return (
    <>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Admin ka so pwede ka mag approve or decline ng posts"}
      />

      <PendingPosts
        post="<p>Everything in its Right Place</p>"
        email={"kjeurquico2020@plm.edu.ph"}
        publisher="Kurt Jacob E. Urquico"
        time={10}
      />
    </>
  );
}

export default Reviews;
