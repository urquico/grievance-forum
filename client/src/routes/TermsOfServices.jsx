/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDocumentTitle } from "@mantine/hooks";
import { Text } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";

function TermsOfServices() {
  useDocumentTitle("Features");
  return <Frame content={<TermsOfServicesLayout />} path={"/terms-of-services"} />;
}

function TermsOfServicesLayout() {
  return (
    <>
      <Text fw="bold" fz="xl">
        Terms and Conditions for Haribon E-Wall
      </Text>
      <Text fw="bold" fz="sm" c="dimmed">
        Effective Date: [5/30/2023]
      </Text>
      <Text style={{ margin: "2rem" }} ta="justify">
        Please read these terms and conditions carefully before using the Grievance Forum operated by Pamantasan ng Lungsod ng Maynila (PLM). Your use of the system signifies your
        agreement to comply with and be bound by these terms. If you do not agree with any part of these terms, please do not use the system.
      </Text>
      <Text fw="bold">1. Use of the Web Grievance System</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        1.1 Eligibility
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The use of the Grievance Forum is limited to members of the university community, including students, faculty, staff, and other authorized individuals. By using the system,
        you represent that you are authorized to submit grievances and engage in the grievance resolution process.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        1.2 Acceptable Use
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        You agree to use the Web Grievance System only for lawful purposes and in a manner consistent with the university's policies and guidelines. You shall not submit false,
        misleading, defamatory, or abusive content, or engage in any activity that may disrupt or interfere with the proper functioning of the system.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        1.3 Anonymity
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        While the system is designed to maintain anonymity, you acknowledge that the university cannot guarantee absolute anonymity due to unforeseen technical issues or legal
        requirements. The university will take reasonable measures to protect your identity but cannot be held liable for any breach of anonymity beyond its control.
      </Text>
      <Text fw="bold">2. Grievance Submission and Resolution</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        2.1 Submission of Grievances
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        By submitting a grievance through the Forum, you affirm that the information provided is accurate and complete to the best of your knowledge. You understand that the
        university will rely on this information for the purpose of addressing and resolving the grievance.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        2.2 Confidentiality and Privacy
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The university will treat all information submitted through the Grievance Forum with confidentiality and in accordance with applicable privacy laws. However, you
        acknowledge that there may be circumstances where disclosure of your personal information is required by law or to facilitate the grievance resolution process.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        2.3 Resolution Process
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The university will make reasonable efforts to address and resolve grievances submitted through the system in a timely and fair manner. However, the university does not
        guarantee the outcome or resolution of any grievance and reserves the right to take appropriate actions based on its internal policies and procedures.
      </Text>

      <Text fw="bold">3. Intellectual Property</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        3.1 Ownership
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The university retains all rights, title, and interest in any intellectual property associated with the Grievance Forum, including but not limited to trademarks, logos,
        designs, and software. You agree not to use, reproduce, or distribute any intellectual property without prior written permission from the university.
      </Text>

      <Text fw="bold">4. Limitation of Liability</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        4.1 Disclaimer
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The Grievance Forum is provided on an "as is" basis. The university disclaims all warranties, express or implied, regarding the system's functionality, accuracy, or
        availability. You agree that the use of the system is at your own risk, and the university shall not be liable for any direct, indirect, incidental, or consequential
        damages arising from your use or inability to use the system.
      </Text>

      <Text fw="bold">5. Modification and Termination</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        5.1 Modification
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The university reserves the right to modify or update these terms and conditions at any time. Any changes will be effective upon posting the revised terms on the Grievance
        Forum. It is your responsibility to review these terms periodically to stay informed of any updates.
      </Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        5.2 Termination
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        The university may terminate or suspend your access to the Grievance Forum at any time and for any reason without prior notice. Upon termination, you shall no longer have
        access to the system and must cease its use.
      </Text>

      {/* <Text fw="bold">6. Governing Law</Text>
      <Text style={{ marginLeft: "2rem" }} fw="bold">
        6.1 Jurisdiction
      </Text>
      <Text style={{ margin: "2rem", marginTop: "1rem" }} ta="justify">
        These terms and conditions shall be governed by and construed in
        accordance with the laws of [Jurisdiction]. Any disputes arising out of
        or in connection with these terms shall be subject to the exclusive
        jurisdiction of the courts of [Jurisdiction].
      </Text> */}
    </>
  );
}

export default TermsOfServices;
