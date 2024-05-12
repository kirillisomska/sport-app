import UpdateForm from "@/components/company/UpdateForm";
import { getAllCompanys, getCompanyById } from "@/data/company";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  const companyList = await getAllCompanys();

  return companyList.map((company) => ({
    id: company.id,
  }));
}

const UpdateCompanyPage = async ({ params }: { params: { id: string } }) => {
  const company = await getCompanyById(params.id);

  if (!company) {
    redirect("/404");
  }

  return (
    <>
      <UpdateForm company={company} />
    </>
  );
};

export default UpdateCompanyPage;
