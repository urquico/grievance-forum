import React, { useLayoutEffect, useState } from "react";
import { Navbar } from "@mantine/core";
import { getUser } from "../../firebase-config";
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
      <Navbar
        p="md"
        hiddenBreakpoint="sm"
        hidden={!opened}
        width={{ sm: 200, lg: 300 }}
        style={{ zIndex: "1" }}
      >
        <UserControls
          isUserAgreedSLA={isUserAgreedSLA}
          isUserAdmin={isUserAdmin}
        />

        {isUserAdmin ? <AdminControls /> : ""}

        {/* <Button color="gray" onClick={logOut} variant="outline">
          Logout
        </Button> */}
        <ProfileControls logOut={logOut} />
      </Navbar>
    </div>
  );
}

export default NavBarLayout;
