/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useLayoutEffect } from "react";
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
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconUpload, IconCheck, IconX } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import Frame from "../layouts/Frame/Frame";
import {
  getColleges,
  getPrograms,
  getUser,
  getCollegeInfo,
  getProgramInfo,
} from "../firebase-config";
import axios from "axios";
import { PORT } from "../Globals";

function AccountSetup() {
  useDocumentTitle("Account Setup");
  return <Frame content={<AccountSetupLayout />} path={"/setup"} />;
}

function AccountSetupLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [existingUserData, setExistingUserData] = useState();
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState();
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [age, setAge] = useState(0);
  const [college, setCollege] = useState("");
  const [collegePlaceholder, setCollegePlaceholder] = useState("");
  const [program, setProgram] = useState("");
  const [programPlaceholder, setProgramPlaceholder] = useState("");

  const [collegeList, setCollegeList] = useState([]);
  const [programList, setProgramList] = useState([]);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [termsAgreementError, setTermsAgreementError] = useState(false);
  const [collegeError, setCollegeError] = useState(false);
  const [programError, setProgramError] = useState(false);
  const [fetchedAge, setFetchedAge] = useState(0);

  const dateToday = new Date();

  useLayoutEffect(() => {
    getColleges().then((result) => {
      setCollegeList(
        result.map((college) => ({
          value: college.id,
          label: college.data().label,
        }))
      );
    });
  }, []);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setExistingUserData(result);
      const fetchedBirthday = new Date(result?.birthday);
      setFetchedAge(
        (dateToday.getTime() - fetchedBirthday.getTime()) / 1000 / 31536000
      );
    });
  }, []);

  useLayoutEffect(() => {
    getCollegeInfo(existingUserData?.college).then((result) => {
      initializeCollegeData(result.label);
    });
  });

  const initializeCollegeData = (collegeData) => {
    setCollegePlaceholder(collegeData);
  };

  useLayoutEffect(() => {
    getProgramInfo(existingUserData?.college, existingUserData?.program).then(
      (result) => {
        setProgramPlaceholder(result.label);
      }
    );
  });

  const submitData = () => {
    if (firstName === "") {
      setFirstNameError(true);
    }
    if (lastName === "") {
      setLastNameError(true);
    }
    if (
      birthday === undefined ||
      birthday === null ||
      age === "Please Enter your real birthday"
    ) {
      setBirthdayError(true);
    }
    if (termsAgreement === false) {
      setTermsAgreementError(true);
    }
    if (college === "") {
      setCollegeError(true);
    }
    if (program === "") {
      setProgramError(true);
    }

    const submissionPermitted =
      lastName !== "" &&
      firstName !== "" &&
      age > 10 &&
      college !== "" &&
      program !== "" &&
      termsAgreement === true;

    if (submissionPermitted) {
      showNotification({
        id: "load-data",
        loading: true,
        title: "Updating your data",
        message: "Please Wait!",
        autoClose: false,
        disallowClose: true,
      });
      axios
        .post(`${PORT}/updateUserData`, {
          userId: localStorage.getItem("email"),
          firstName: firstName,
          lastName: lastName,
          birthday: birthday,
          college: college,
          program: program,
          userAgreedSLA: termsAgreement,
          picture: file,
        })
        .then((result) => {
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "teal",
              title: "Success!",
              message: "User Data has been Updated",
              icon: <IconCheck size={16} />,
              autoClose: 2000,
            });
            navigate("/home");
          }, 3000);
        })
        .catch((error) => {
          console.log(error.message);
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "red",
              title: "Error!!",
              message: error.message,
              icon: <IconX size={16} />,
              autoClose: 2000,
            });
          }, 3000);
        });
    }
  };

  const collegeSelected = (val) => {
    setCollege(val);
    setCollegeError(false);
    getPrograms(val).then((result) => {
      setProgramList(
        result.map((program) => ({
          value: program.id,
          label: program.data().label,
        }))
      );
    });
    setProgram("");
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
          label="Change Profile Picture"
          description="please submit low resolution image only"
          multiple={false}
          accept="image/jpeg"
          icon={<IconUpload size={14} />}
        />
        <TextInput
          placeholder={
            existingUserData?.firstName === "" ||
            existingUserData?.firstName === undefined
              ? "Thom"
              : existingUserData?.firstName
          }
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
          placeholder={
            existingUserData?.lastName === "" ||
            existingUserData?.lastName === undefined
              ? "Yorke"
              : existingUserData?.lastName
          }
          label="Last name"
          radius="xs"
          withAsterisk
          error={lastNameError ? "Enter valid date" : ""}
          value={lastName}
          onChange={(event) => {
            setLastName(event.currentTarget.value);
            setLastNameError(false);
          }}
        />
        <DatePicker
          placeholder={
            existingUserData?.birthday === "" ||
            existingUserData?.birthday === undefined
              ? "Pick date"
              : `${
                  new Date(existingUserData?.birthday).getMonth() + 1
                } / ${new Date(
                  existingUserData?.birthday
                ).getDate()} / ${new Date(
                  existingUserData?.birthday
                ).getFullYear()}`
          }
          label="Birthday"
          withAsterisk
          error={birthdayError ? "field required" : ""}
          value={birthday}
          onChange={(val) => {
            setBirthday(val);
            setBirthdayError(false);
            const generatedAge =
              (dateToday.getTime() - val.getTime()) / 1000 / 31536000;
            if (generatedAge <= 10) {
              setAge("Please Enter your real birthday");
            } else {
              setAge(Math.floor(generatedAge));
              setFetchedAge(Math.floor(generatedAge));
            }
          }}
        />

        <TextInput
          label="Age"
          radius="xs"
          disabled
          placeholder={
            existingUserData?.birthday === "" ||
            existingUserData?.birthday === undefined
              ? age
              : Math.floor(fetchedAge)
          }
        />

        <Select
          label="College"
          placeholder={
            existingUserData?.college === "" ||
            existingUserData?.college === undefined
              ? "Pick one"
              : collegePlaceholder
          }
          data={collegeList}
          value={college}
          onChange={(val) => {
            collegeSelected(val);
          }}
          error={collegeError}
          required
        />

        <Select
          label="Program"
          placeholder={
            existingUserData?.program === "" ||
            existingUserData?.program === undefined
              ? "Pick one"
              : programPlaceholder
          }
          data={programList}
          value={program}
          onChange={(val) => {
            setProgram(val);
            setProgramError(false);
          }}
          error={programError}
          required
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
