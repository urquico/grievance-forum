import React from "react";
import { Button, Group, Avatar, Text, Collapse } from "@mantine/core";
import { IconChevronRight, IconChevronDown, IconAddressBook, IconLogout } from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import NavLinks from "./NavLinks";

function ProfileControls({ logOut }) {
  const [profileOpened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Button style={{ height: "auto", marginRight: "auto", marginTop: "0" }} onClick={toggle} color="dark" variant="subtle" compact>
        <Group>
          <Avatar size={40} color="red" variant="outline">
            {localStorage.getItem("email")?.toUpperCase()[0] + localStorage.getItem("name")?.toUpperCase()[0]}
          </Avatar>
          <div style={{ marginLeft: "-0.300rem" }}>
            <Text size="sm">{localStorage.getItem("name")}</Text>
            <Text size="xs">{localStorage.getItem("email")}</Text>
          </div>
          {profileOpened ? <IconChevronDown size="15" /> : <IconChevronRight size="15" />}
        </Group>
      </Button>
      <Collapse in={profileOpened} style={{ marginTop: "0.250rem", marginLeft: "3rem" }}>
        <NavLinks title={"Profile"} icon={<IconAddressBook size={16} />} color="yellow" path={"/profile"} indicator={false} />
        <NavLinks title={"Logout"} icon={<IconLogout size={16} />} color="orange" path={"/"} indicator={false} log={true} logOut={logOut} />
      </Collapse>
    </>
  );
}

export default ProfileControls;
