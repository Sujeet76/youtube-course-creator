import React, { PropsWithChildren } from "react";

import Header from "@/components/shared/navbar/navbar";
import SignInDialog from "@/feature/auth/components/login-dialog";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <SignInDialog />
      {children}
    </>
  );
};

export default RootLayout;
