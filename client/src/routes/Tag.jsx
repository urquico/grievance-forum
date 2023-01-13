import React from "react";
import { useParams } from "react-router-dom";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import InfiniteScrolling from "../layouts/InfiniteScrolling";

function Tag() {
  let { id } = useParams();
  return <Frame content={<TagLayout />} path={`/tags/${id}`} />;
}

function TagLayout() {
  let { id } = useParams();

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`Posts under the <<b><i>${id.toUpperCase()}</i></b>> tag`}
      />
      <InfiniteScrolling type="tag" tag={id} />
    </div>
  );
}

export default Tag;
