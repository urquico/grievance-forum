import React from "react";
import { useParams } from "react-router-dom";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import { useDocumentTitle } from "@mantine/hooks";

function Tag() {
  let { id } = useParams();
  useDocumentTitle(`${id.toUpperCase()} TAG`);
  return <Frame content={<TagLayout />} path={`/tags/${id.toLowerCase()}`} />;
}

function TagLayout() {
  let { id } = useParams();

  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={`Posts under the <<b><i>${id.toUpperCase()}</i></b>> tag`} />
      <InfiniteScrolling type="tag" tag={id.toLowerCase()} isArchive={false} />
    </div>
  );
}

export default Tag;
