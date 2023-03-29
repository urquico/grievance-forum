import React from "react";
import {
  IconHome2,
  IconBallpen,
  IconAddressBook,
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
  const [moreOpened, { toggle }] = useDisclosure(false);

  return (
    <>
      {" "}
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
                <IconChevronDown size="14" />
              ) : (
                <IconChevronUp size="14" />
              )
            }
            onClick={toggle}
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
          path={"/posts/college"}
          indicator={false}
        />
        <NavLinks
          title={"Program Posts"}
          icon={<IconInbox size={16} />}
          color="pink"
          path={"/posts/program"}
          indicator={false}
        />
        <NavLinks
          title={"Archive Posts"}
          icon={<IconInbox size={16} />}
          color="violet"
          path={"/posts/archive"}
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
