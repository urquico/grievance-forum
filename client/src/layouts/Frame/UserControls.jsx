import React, { useState } from "react";
import {
  IconHome2,
  IconBallpen,
  IconCategory,
  IconUser,
  IconTags,
  IconInbox,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Collapse } from "@mantine/core";
import NavLinks from "./NavLinks";

function UserControls({ isUserAdmin, isUserAgreedSLA }) {
  const [isOpened, setIsOpened] = useState(
    localStorage.getItem("userControls") === "true" ? true : false
  );
  const [moreOpened, handlers] = useDisclosure(isOpened);

  return (
    <>
      <NavLinks
        title={"Home"}
        icon={<IconHome2 size={16} />}
        color="red"
        path={"/home"}
        indicator={false}
      />
      <NavLinks
        title={"Post"}
        icon={<IconBallpen size={16} />}
        color="blue"
        path={"/post"}
        indicator={false}
      />
      <NavLinks
        title={"Categories"}
        icon={<IconCategory size={16} />}
        color="violet"
        path={"/category"}
        indicator={false}
      />
      <NavLinks
        title={"Tags"}
        icon={<IconTags size={16} />}
        color="teal"
        path={"/tags"}
        indicator={false}
      />
      <Divider
        my="xs"
        label={
          <Button
            variant="subtle"
            color="dark"
            compact
            style={{ fontSize: "0.700rem" }}
            rightIcon={
              moreOpened ? (
                <IconChevronUp size="14" />
              ) : (
                <IconChevronDown size="14" />
              )
            }
            onClick={() => {
              if (localStorage.getItem("userControls") === "true") {
                setIsOpened(false);
                // handlers.close();
              } else {
                setIsOpened(true);
                // handlers.open();
              }
              handlers.toggle();
              localStorage.setItem("userControls", isOpened);
            }}
          >
            {moreOpened ? "Hide Posts" : "Show Posts"}
          </Button>
        }
        labelPosition="left"
      />
      <Collapse in={moreOpened}>
        <NavLinks
          title={"College Posts"}
          icon={<IconInbox size={16} />}
          color="blue"
          path={"/college"}
          indicator={false}
        />
        <NavLinks
          title={"Program Posts"}
          icon={<IconInbox size={16} />}
          color="pink"
          path={"/program"}
          indicator={false}
        />
        <NavLinks
          title={"Archive Posts"}
          icon={<IconInbox size={16} />}
          color="violet"
          path={"/archive"}
          indicator={false}
        />
      </Collapse>
      <NavLinks
        title={"Account Setup"}
        icon={<IconUser size={16} />}
        color="yellow"
        path={"/setup"}
        isLastElement={isUserAdmin ? false : true}
        indicator={isUserAgreedSLA}
      />
    </>
  );
}

export default UserControls;
