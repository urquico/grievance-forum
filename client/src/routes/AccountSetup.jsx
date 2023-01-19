import React, { useState } from "react";
import { useDocumentTitle, useMediaQuery } from "@mantine/hooks";
import {
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  Text,
  Checkbox,
  Anchor,
  FileInput,
  NumberInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import Frame from "../layouts/Frame/Frame";

function AccountSetup() {
  useDocumentTitle("Account Setup");
  return <Frame content={<AccountSetupLayout />} path={"/setup"} />;
}

function AccountSetupLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [termsAgreement, setTermsAgreement] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [termsAgreementError, setTermsAgreementError] = useState(false);

  const submitData = () => {
    const submissionPermitted = false;
    if (firstName === "") {
      setFirstNameError(true);
    }
    if (lastName === "") {
      setLastNameError(true);
    }
    if (age === 0 || age === undefined) {
      setAgeError(true);
    }
    if (termsAgreement === false) {
      setTermsAgreementError(true);
    }
    console.log(age);
  };

  const exitSetup = () => {
    navigate("/home");
  };

  return (
    <>
      <Modal
        opened={true}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={2}
        onClose={exitSetup}
        closeOnEscape={false}
        closeOnClickOutside={false}
        fullScreen={isMobile}
        title={
          <Text fz="xl" fw={700} style={{ marginBottom: "0.750rem" }}>
            Account Information Setup
          </Text>
        }
      >
        <TextInput
          placeholder={localStorage.getItem("email")}
          label="Email"
          radius="xs"
          disabled
        />

        <FileInput
          value={file}
          onChange={setFile}
          placeholder="Pick Image file"
          label="Profile Picture"
          description="please submit low resolution images only"
          multiple={false}
          accept="image/png,image/jpeg"
          icon={<IconUpload size={14} />}
        />

        <TextInput
          placeholder="Thom"
          label="First name"
          radius="xs"
          withAsterisk
          error={firstNameError ? "field required" : ""}
          value={firstName}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
            setFirstNameError(false);
          }}
        />

        <TextInput
          placeholder="Yorke"
          label="Last name"
          radius="xs"
          withAsterisk
          error={lastNameError ? "field required" : ""}
          value={lastName}
          onChange={(event) => {
            setLastName(event.currentTarget.value);
            setLastNameError(false);
          }}
        />

        <NumberInput
          placeholder="Your age"
          label="Age"
          withAsterisk
          error={ageError ? "field required" : ""}
          value={age}
          onChange={(val) => {
            setAge(val);
            setAgeError(false);
          }}
          stepHoldDelay={500}
          stepHoldInterval={100}
        />

        <Checkbox
          checked={termsAgreement}
          onChange={(event) => {
            setTermsAgreement(event.currentTarget.checked);
            setTermsAgreementError(false);
          }}
          label={
            <>
              I agree to the{" "}
              <Anchor size="sm" href="/terms-of-services" target="_blank">
                terms and conditions
              </Anchor>
            </>
          }
          error={
            termsAgreementError
              ? "please see and agree to the terms and conditions "
              : ""
          }
          style={{ marginTop: "0.750rem" }}
        />

        <Button
          style={{ marginTop: "0.750rem" }}
          fullWidth
          onClick={submitData}
        >
          Submit
        </Button>
      </Modal>
    </>
  );
}

export default AccountSetup;
