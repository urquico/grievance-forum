import React from "react";
import {
  IconChartBar,
  IconExplicit,
  IconBrandAmongus,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Collapse } from "@mantine/core";
import NavLinks from "./NavLinks";

function AdminControls() {
  const [adminOpened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Divider
        my="xs"
        label={
          <Button
            variant="subtle"
            color="dark"
            compact
            style={{ fontSize: "0.700rem" }}
            rightIcon={
              adminOpened ? (
                <IconChevronUp size="14" />
              ) : (
                <IconChevronDown size="14" />
              )
            }
            onClick={toggle}
          >
            Admin Controls
          </Button>
        }
        labelPosition="left"
      />
      <Collapse in={adminOpened}>
        <NavLinks
          title={"Profanities"}
          icon={<IconExplicit size={16} />}
          color="green"
          path={"/profanities"}
          indicator={false}
        />
        <NavLinks
          title={"Pending Posts"}
          icon={<IconBrandAmongus size={16} />}
          color="green"
          path={"/pending"}
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
      </Collapse>
    </>
  );
}

export default AdminControls;