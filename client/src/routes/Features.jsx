/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDocumentTitle } from "@mantine/hooks";
import { Text } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";

function Features() {
  useDocumentTitle("Features");
  return <Frame content={<FeaturesLayout />} path={"/features"} />;
}

function FeaturesLayout() {
  const features = [
    {
      title: "Dark Mode",
      description:
        "To enable users to explore and interact with the system for longer periods without discomfort or fatigue, developers have managed to create more comfortable environments through a visually soothing dark color scheme that will ultimately lead to an enjoyable and productive user experience.",
    },
    {
      title: "Profanity Management",
      description:
        "The developers implement a robust profanity management system, recognizing the importance of fostering a professional and respectful environment within the system. By integrating this feature, they establish and maintain a sense of formality and decorum throughout the system.",
    },
    {
      title: "Rich Text Editor",
      description:
        "The developers introduced the rich text editor feature. This feature empowers users to customize their posts with many formatting options, enabling them to add emphasis, structure, and visual appeal to their content. With the rich text editor, users can choose from various text styles, such as bold, italics, underline, and various font sizes and colors, creating visually captivating and engaging posts that reflect their unique personality and style. This implementation enhances the overall user experience and encourages creativity and individuality within the platform.",
    },
    {
      title: "Anonymity",
      description:
        "The developers have introduced an anonymity feature to consider the importance of privacy and user autonomy. This innovative feature enables users to safeguard personal information and preserve privacy while interacting with the platform. Anonymous usage allows users to express their views and ideas and discuss without fear that their identity will be exposed, promoting a safe and inclusive environment for all interested parties.",
    },
    {
      title: "Post Filtering",
      description:
        "The developers introduced a post-filter feature to enhance user experience and streamline content discovery. This valuable addition enables users to locate posts that align with their interests and preferences effortlessly. Users can refine their search and focus on relevant content by providing intuitive filtering options, saving time and ensuring a more tailored and engaging experience within the system.",
    },
    {
      title: "Admin Access",
      description:
        "The developers wisely implemented an admin access feature to ensure smooth operation and effective system management. This crucial addition grants allowed personnel the privileges and control of overseeing and maintaining the system's functionality, security, and overall performance. Administrators can efficiently handle user management, content moderation, system configuration, and other critical administrative functions with admin access, contributing to a well-organized and secure system environment.",
    },
  ];

  return (
    <>
      <Text fw="bold" fz="xl">
        Features
      </Text>

      {features.map((feature) => {
        return (
          <>
            <Text style={{ marginTop: "2rem", marginLeft: "2rem" }} fw="bold">
              {feature.title}
            </Text>

            <Text
              style={{
                marginLeft: "4rem",
                marginRight: "3rem",
                textAlign: "justify",
              }}
              fz="m"
            >
              {feature.description}
            </Text>
          </>
        );
      })}
    </>
  );
}

export default Features;
