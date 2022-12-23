import React from "react";
import {
  IconHome2,
  IconBallpen,
  IconAddressBook,
  IconCategory,
  IconTags,
} from "@tabler/icons";
import { Navbar, Button } from "@mantine/core";
import NavLinks from "./NavLinks";
function NavBarLayout({ opened, logOut }) {
  return (
    <div>
      <Navbar
        p="md"
        hiddenBreakpoint="sm"
        hidden={!opened}
        width={{ sm: 200, lg: 300 }}
        style={{ zIndex: "1" }}
      >
        <NavLinks
          title={"Home"}
          icon={<IconHome2 size={16} />}
          color="red"
          path={"/home"}
        />
        <NavLinks
          title={"Post"}
          icon={<IconBallpen size={16} />}
          color="blue"
          path={"/post"}
        />
        <NavLinks
          title={"Profile"}
          icon={<IconAddressBook size={16} />}
          color="orange"
          path={"/profile"}
        />
        <NavLinks
          title={"Categories"}
          icon={<IconCategory size={16} />}
          color="violet"
          path={"/category"}
        />
        <NavLinks
          title={"Tags"}
          icon={<IconTags size={16} />}
          color="teal"
          path={"/tags"}
          isLastElement={true}
        />

        <Button color="gray" onClick={logOut} variant="outline">
          Logout
        </Button>
      </Navbar>
    </div>
  );
}

export default NavBarLayout;
