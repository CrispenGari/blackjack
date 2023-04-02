import { CImage, CToast, CToastBody, CToastHeader } from "@coreui/react";
import React from "react";

const notificationToast = ({
  message,
  notificationTitle,
}: {
  notificationTitle: string;
  message: string;
}) => {
  return (
    <CToast autohide={true}>
      <CToastHeader closeButton>
        <CImage
          src="/logo.png"
          alt="logo"
          draggable={false}
          style={{ width: 25, marginRight: 10 }}
        />
        <div className="fw-bold me-auto">{notificationTitle}</div>
        <small>now</small>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );
};

export default notificationToast;
