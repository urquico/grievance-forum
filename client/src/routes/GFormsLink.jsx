import React, { useLayoutEffect, useState } from "react";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";
import { Anchor, Text, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { getAllContacts } from "../firebase-config";

function GFormsLink() {
  useDocumentTitle("G-Forms");

  return <Frame content={<GFormsLinkLayout />} path={"/g-forms-link"} />;
}

function GFormsLinkLayout() {
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    getAllContacts()
      .then((result) => {
        setData(() => [
          ...result.docs.map((doc) => ({
            ...doc.data(),
            label: doc.id,
          })),
        ]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Here are the list of grievance forms provided by the PLM Supreme Student Council and the College Student Councils."}
      />

      {data?.map((contact, index) => {
        if (contact.label !== "Developers") {
          return (
            <div key={index}>
              <Tooltip label="Click to open Forms">
                <Anchor href={contact.gForms || "/404"} target="_blank">
                  <Text style={{ marginTop: "2rem", marginBottom: "1rem" }} fw="bold" fz="xl" ta="center">
                    {contact.label} <IconExternalLink size="1.125rem" />
                  </Text>
                </Anchor>
              </Tooltip>

              <Text ta="justify" style={{ textIndent: "1rem", marginLeft: "2rem", marginRight: "2rem" }}>
                {contact.description}
              </Text>

              <Anchor style={{ marginLeft: "2rem" }} fz="xs" href={contact.fbLink || "/404"} target="_blank">
                view facebook page
              </Anchor>
            </div>
          );
        }
        return <></>;
      })}
    </div>
  );
}

export default GFormsLink;
