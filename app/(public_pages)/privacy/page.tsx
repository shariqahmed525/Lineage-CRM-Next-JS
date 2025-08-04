'use client';

import { Box, Stack } from '@chakra-ui/react';
import React from 'react';


const Privacy: React.FC = () => (
  <Box
    height="100vh"
    p={10}
    pr={{ base: 10, md: '235px' }} // Set pr=20 on breakpoints above mobile, otherwise 0
    overflow="hidden"
    overflowY="scroll"
    scrollMarginTop={10}
    scrollBehavior="smooth"
  >
    <Stack spacing={4}>
      <h1><strong>Privacy Policy</strong></h1>
      <p>Lineage CRM respects your privacy and is committed to protecting your personal data. Our Privacy Policy outlines how we collect, use, store, and safeguard your data when you use our web app or website. By using our services, you consent to the practices described in this policy.</p>

      <p>
        <strong>Effective Date:</strong>
        {' '}
        05/16/2024
      </p>
      <p>
        <strong>Last Updated:</strong>
        {' '}
        05/16/2024
      </p>

      <h2>Introduction</h2>
      <p>In the digital age, safeguarding personal data is of paramount importance. At Lineage CRM, we are dedicated to upholding your privacy and protecting your personal information. This Privacy Policy is designed to explain how we gather, utilize, disclose, and safeguard your personal data when you access and use our web app or website. Your use of our web app or website implies your consent to the practices detailed herein.</p>

      <h2>Information We Collect</h2>
      <h3>Personal Information</h3>
      <p>We may collect personal information that you willingly provide when utilizing our services, including but not limited to:</p>
      <ul>
        <li>
          <strong>Name:</strong>
          {' '}
          To personalize your experience.
        </li>
        <li>
          <strong>Email Address:</strong>
          {' '}
          To communicate with you and send updates.
        </li>
        <li>
          <strong>Postal Address:</strong>
          {' '}
          When necessary for specific services.
        </li>
        <li>
          <strong>Phone Number:</strong>
          {' '}
          To contact you, if required.
        </li>
        <li>
          <strong>Any other data:</strong>
          {' '}
          You may provide voluntarily, such as preferences or user-generated content.
        </li>
      </ul>
      <p>This information might be collected during account registration, subscription to newsletters, or when you contact us.</p>

      <h3>Automatically Collected Information</h3>
      <p>When you access our web app or website, certain information is automatically collected, including:</p>
      <ul>
        <li>
          <strong>IP Address:</strong>
          {' '}
          For security and analytics.
        </li>
        <li>
          <strong>Browser Type:</strong>
          {' '}
          To optimize your browsing experience.
        </li>
        <li>
          <strong>Operating System:</strong>
          {' '}
          To ensure compatibility.
        </li>
        <li>
          <strong>Referring URLs:</strong>
          {' '}
          To understand how you found our web app or website.
        </li>
        <li>
          <strong>Pages Visited:</strong>
          {' '}
          For site improvement and analytics.
        </li>
      </ul>
      <p>This data helps us enhance our web app or website and improve your user experience.</p>

      <h2>How We Use Your Information</h2>
      <h3>Providing and Enhancing Services</h3>
      <p>We use your personal information to deliver the services you request and continually enhance your experience on our web app or website.</p>

      <h3>Personalization</h3>
      <p>We may personalize your web app or website experience based on the data we collect to make your interactions more relevant and enjoyable.</p>

      <h3>Communication</h3>
      <p>Your contact information allows us to respond to your inquiries, provide updates, and engage with you when necessary.</p>

      <h3>Analytics and Security</h3>
      <p>We monitor and analyze usage patterns to bolster our web app or website’s functionality and security.</p>

      <h2>Data Security Measures</h2>
      <p>The security of your data is a top priority. We implement robust security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, and regular security assessments.</p>

      <h2>Sharing of Information</h2>
      <p>We do not sell, trade, or transfer your personal information to third parties without your consent. However, we may share your data with trusted service providers who assist us in operating our web app or website, subject to strict confidentiality agreements.</p>

      <h2>Cookies and Tracking Technologies</h2>
      <p>
        Our web app or website may utilize cookies and similar tracking technologies to collect information about your browsing behavior. You can manage your cookie preferences through your browser settings. Please review our
        <a href="[link to Cookie Policy]">Cookie Policy</a>
        {' '}
        for detailed information.
      </p>

      <h2>Your Rights</h2>
      <p>
        <strong>Access:</strong>
        {' '}
        You have the right to access the personal information we hold about you. Feel free to contact us for a copy of your data.
      </p>
      <p>
        <strong>Correction:</strong>
        {' '}
        If you believe the personal information we hold about you is inaccurate or incomplete, you can request corrections.
      </p>
      <p>
        <strong>Deletion:</strong>
        {' '}
        You can request the deletion of your personal information.
      </p>
      <p>
        <strong>Objection:</strong>
        {' '}
        You have the right to object to the processing of your personal information for certain purposes, such as direct marketing.
      </p>
      <p>
        <strong>Data Portability:</strong>
        {' '}
        You can request your personal information in a structured, commonly used, and machine-readable format.
      </p>

      <h2>Changes to this Privacy Policy</h2>
      <p>We may periodically update this Privacy Policy to reflect changes in our practices or for legal reasons. Significant changes will be communicated by posting the revised Privacy Policy on our web app or website.</p>

      <h2>Contact Us</h2>
      <p>
        If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at
        <a href="mailto:help@lineagecrm.com">help@lineagecrm.com</a>
        .
      </p>

      <p>This Privacy Policy was last updated on 05/16/2024.</p>

      <br />
      <br />
    </Stack>
  </Box>
);

export default Privacy;
