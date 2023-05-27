/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDocumentTitle } from "@mantine/hooks";
import { Text, Accordion } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";

function PrivacyPolicy() {
  useDocumentTitle("Features");
  return <Frame content={<PrivacyPolicyLayout />} path={"/privacy-policy"} />;
}

function PrivacyPolicyLayout() {
  return (
    <>
      <Text fw="bold" fz="xl">
        Privacy Policy for Haribon E-Wall
      </Text>
      <Text fw="bold" fz="sm" c="dimmed">
        Effective Date: [5/30/2023]
      </Text>
      <Text style={{ margin: "2rem" }} ta="justify">
        At Haribon E-Wall, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and
        safeguard the information you provide to us through the Grievance Forum. Please read this policy carefully to understand our practices regarding your personal information.
      </Text>

      <Text fw="bold">1. Information Collection and Use</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        1.1 Personal Information
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        We may collect personal information from you when you register your account and submit a grievance through the Forum. This information includes email, name, birthday,
        college, and program. We will use this information solely for the purpose of addressing and resolving your grievance.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        1.2 Log Data
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        When you access the Web Grievance System, our servers may automatically collect certain information known as log data. This data may include your IP address, browser type,
        referring/exit pages, and other information about your interaction with the system. We use this to provide accessibility and functionality of the forum.
      </Text>

      <Text fw="bold">2. Information Sharing and Disclosure</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        2.1 Third-Party Service Providers
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        We may engage trusted third-party service providers (Microsoft) to assist us in operating the Grievance Forum and providing the necessary services. These service providers
        will have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        2.2 Legal Requirements
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        We may disclose your personal information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
      </Text>

      <Text fw="bold">3. Data Security</Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        We take the security of your personal information seriously and employ industry-standard measures to protect it against unauthorized access, disclosure, alteration, or
        destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
      </Text>

      <Text fw="bold">4. Data Retention</Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        We will retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, or as required by law. Afterward, we will
        securely dispose of or anonymize your information to prevent unauthorized access or use.
      </Text>

      <Text fw="bold">5. Your Rights</Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        You have the right to access, update, or delete your personal information held by us. If you wish to exercise any of these rights or have any questions or concerns about
        your personal information, please contact us using the information provided at the end of this policy.
      </Text>

      <Text fw="bold">6. Changes to this Privacy Policy</Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        We reserve the right to modify or update this privacy policy at any time. Any changes will be posted on this page, and the effective date will be revised accordingly. We
        encourage you to review this policy periodically to stay informed about how we collect, use, and protect your personal information.
      </Text>

      <Text fw="bold">7. Frequently Asked Questions</Text>

      <Accordion style={{ margin: "2rem", marginTop: "1rem" }}>
        <Accordion.Item value="q1">
          <Accordion.Control>Q: How will my personal information be used?</Accordion.Control>
          <Accordion.Panel>A: We will use your personal information solely for the purpose of addressing and resolving your grievance submitted through the Forum</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="q2">
          <Accordion.Control>Q: Will my personal information be shared with third parties?</Accordion.Control>
          <Accordion.Panel>
            A: We may engage trusted third-party service providers to assist us in operating the Grievance Forum. These service providers will have access to your personal
            information only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="q3">
          <Accordion.Control>Q: How long will my personal information be retained?</Accordion.Control>
          <Accordion.Panel>
            A: We will retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, or as required by law. Afterward, we will
            securely dispose of or anonymize your information to prevent unauthorized access or use.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="q4">
          <Accordion.Control>Q: How is my personal information protected?</Accordion.Control>
          <Accordion.Panel>
            A: We take the security of your personal information seriously and employ industry-standard measures to protect it against unauthorized access, disclosure, alteration,
            or destruction.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="q5">
          <Accordion.Control>Q: How can I be sure that my identity will remain anonymous throughout the grievance process?</Accordion.Control>
          <Accordion.Panel>
            A: We have implemented robust technical and procedural measures to maintain the anonymity of individuals using the system. Your personal information will be securely
            stored and accessible only to authorized personnel involved in addressing and resolving the grievance.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="q6">
          <Accordion.Control>Q: What measures are in place to protect against the accidental disclosure of my identity?</Accordion.Control>
          <Accordion.Panel>
            A: We have implemented strict access controls and security protocols to prevent accidental disclosure of your identity. Only authorized personnel who are directly
            involved in the grievance resolution process will have access to the information provided, and they are bound by confidentiality agreements.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Text fw="bold">8. Contact Us</Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        If you have any questions or concerns about this Privacy Policy or our practices regarding your personal information, please contact us at{" "}
        <u>haribondevelopers@gmail.com</u>
      </Text>

      <Text c="dimmed">Pamantasan ng Lungsod ng Maynila</Text>
      <Text c="dimmed">BS Computer Science 3-2 (AY. 2022-2023)</Text>
      <Text c="dimmed">Email: haribondevelopers@gmail.com</Text>
    </>
  );
}

export default PrivacyPolicy;
