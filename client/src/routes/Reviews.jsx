import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import PieChartReview from "../layouts/PieChartReview";

function Reviews() {
  useDocumentTitle("Reviews");
  return <Frame content={<ReviewsLayout />} path={"/reviews"} />;
}

function ReviewsLayout() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  return (
    <div>
      <PieChartReview />
    </div>
  );
}

export default Reviews;
