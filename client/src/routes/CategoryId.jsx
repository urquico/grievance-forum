import React from "react";
import { useParams } from "react-router-dom";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import { useDocumentTitle } from "@mantine/hooks";

function CategoryId() {
  let { id } = useParams();
  useDocumentTitle(id.toLocaleUpperCase());

  return <Frame content={<CategoryIdLayout />} path={`/category/${id}`} />;
}

function CategoryIdLayout() {
  let { id } = useParams();

  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={id} />
      <InfiniteScrolling type="category" category={id} isArchive={false} />
    </div>
  );
}

export default CategoryId;
