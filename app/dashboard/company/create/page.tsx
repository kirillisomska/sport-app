"use client";

import CreateCompanyForm from "@/components/company/CreateCompany";
import { useSession } from "next-auth/react";

const CreateCompanyPage = () => {
  const session = useSession();

  if (!session.data?.user) {
    return <h1>Недостаточно прав для просмотра страницы!</h1>;
  }

  return (
    <>
      <CreateCompanyForm userId={session.data.user.id} />
    </>
  );
};

export default CreateCompanyPage;
