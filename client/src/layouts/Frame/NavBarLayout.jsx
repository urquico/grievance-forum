import React, { useLayoutEffect, useState } from "react";
import {
  IconHome2,
  IconBallpen,
  IconAddressBook,
  IconCategory,
  IconUser,
  IconTags,
  IconChartBar,
  IconExplicit,
  IconBrandAmongus,
} from "@tabler/icons";
import { Navbar, Button, Divider, Text } from "@mantine/core";
import NavLinks from "./NavLinks";
import { getUser } from "../../firebase-config";

function NavBarLayout({ opened, logOut }) {
  const [isUserAgreedSLA, setIsUserAgreedSLA] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setIsUserAgreedSLA(!result.userAgreedSLA);
      setIsUserAdmin(result.isAdmin);
    });
  });

  return (
    <div style={{ zIndex: "99" }}>
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
          title={"Profile"}
          icon={<IconAddressBook size={16} />}
          color="orange"
          path={"/profile"}
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

        <NavLinks
          title={"Account Setup"}
          icon={<IconUser size={16} />}
          color="yellow"
          path={"/setup"}
          isLastElement={isUserAdmin ? false : true}
          indicator={isUserAgreedSLA}
        />

        {isUserAdmin ? (
          <>
            <Divider my="xs" label="Admin Controls" labelPosition="center" />
            <NavLinks
              title={"Profanities"}
              icon={<IconExplicit size={16} />}
              color="green"
              path={"/profanities"}
              indicator={false}
            />
            <NavLinks
              title={"Direct Admin Post"}
              icon={<IconBrandAmongus size={16} />}
              color="green"
              path={"/direct-to-admin-post"}
              indicator={false}
            />
            <NavLinks
              title={"Reviews"}
              icon={<IconChartBar size={16} />}
              color="green"
              path={"/reviews"}
              isLastElement={true}
              indicator={false}
            />
          </>
        ) : (
          ""
        )}

        <Button color="gray" onClick={logOut} variant="outline">
          Logout
        </Button>
      </Navbar>
    </div>
  );
}

export default NavBarLayout;
