import React, { useLayoutEffect, useState } from "react";
import { Navbar, ScrollArea } from "@mantine/core";
import { checkIfContainsNumber, getUser } from "../../firebase-config";
import UserControls from "./UserControls";
import AdminControls from "./AdminControls";
import ProfileControls from "./ProfileControls";

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
      <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }} style={{ zIndex: "1" }}>
        <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
          <UserControls isUserAgreedSLA={isUserAgreedSLA} isUserAdmin={isUserAdmin} />
          {isUserAdmin && checkIfContainsNumber(localStorage.getItem("email")) && !isUserAgreedSLA ? <AdminControls /> : ""}

          <div style={{ marginTop: "1rem" }}>
            <ProfileControls logOut={logOut} />
          </div>
        </Navbar.Section>
      </Navbar>
    </div>
  );
}

export default NavBarLayout;
