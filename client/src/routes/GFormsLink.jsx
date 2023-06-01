import React from "react";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";

function GFormsLink() {
  useDocumentTitle("G-Forms");

  return <Frame content={<GFormsLinkLayout />} path={"/g-forms-link"} />;
}

function GFormsLinkLayout() {
  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={"Here are the lists of forms provided by the student councils"} />
    </div>
  );
}

export default GFormsLink;
