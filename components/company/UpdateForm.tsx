"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { UpdateCompanySchema } from "@/schemas";
import { updateCompany } from "@/actions/company";
import FormSuccess from "../auth/form-success";
import FormError from "../auth/form-error";
import MDEditor from "@uiw/react-md-editor";
import Link from "next/link";

type PropTypes = {
  company: Company;
};

const UpdateForm = ({ company }: PropTypes) => {
  const session = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [remember, setRemember] = useState<number>(0);
  const [description, setDescription] = useState<string | undefined>(
    company.description ?? ""
  );

  const form = useForm<z.infer<typeof UpdateCompanySchema>>({
    resolver: zodResolver(UpdateCompanySchema),
    defaultValues: {
      id: company.id,
      name: company.name,
      description: company.description ?? "",
      logoUrl: company.logoUrl ?? "",
      socialLink: company.socialLink ?? "",
    },
  });

  const handleSubmit = (values: z.infer<typeof UpdateCompanySchema>) => {
    setError("");
    setSuccess("");

    values.description = description ?? "";

    startTransition(() => {
      updateCompany(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  if (!session.data?.user || session.data.user.id !== company.userId) {
    return <h1>Недостаточно прав для просмотра страницы!</h1>;
  }

  return (
    <>
      <h1 className="text-2xl text-gray-900">Форма обновления компании</h1>
      <hr className="mt-2 mb-4" />

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="name"
            >
              Название компании
            </label>
            <input
              disabled={isPending}
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...form.register("name")}
              id="name"
              name="name"
              type="text"
              placeholder="ПаркFitness"
            />
          </div>

          <div className="flex flex-col">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="description"
            >
              Описание
            </label>

            <MDEditor
              value={description}
              onChange={setDescription}
              defaultValue={company.description ? company.description : ""}
              height={300}
              data-color-mode="light"
            />
            <textarea
              disabled={isPending}
              {...form.register("description")}
              id="description"
              name="description"
              hidden
              value={description}
              placeholder="Небольшое описание компании"
            />
          </div>

          <div className="flex flex-row gap-4">
          <div className="flex flex-col w-full">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="logoUrl"
            >
              Ссылка на логотип
            </label>
            <input
              disabled={isPending}
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...form.register("logoUrl")}
              id="logoUrl"
              name="logoUrl"
              type="text"
              placeholder="http://..."
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="socialLink"
            >
              Ссылка на социальную сеть
            </label>
            <input
              disabled={isPending}
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...form.register("socialLink")}
              id="socialLink"
              name="socialLink"
              type="text"
              placeholder="http://..."
            />
          </div>
          </div>
        </div>
        <FormSuccess message={success} />
        <FormError message={error} />
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value={remember}
              onChange={() => {
                setRemember(remember ? 0 : 1)
              }}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 outline-none"
              required

            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 "
          >
            Ознакомлен с {" "}
            <Link
              href="/dashboard/terms"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              правилами создания контента на платформе
            </Link>
            .
          </label>
        </div>
        <button
          disabled={isPending || !remember}
          type="submit"
          className="max-w-[280px] w-full bg-blue-500 text-white rounded-md py-2 hover:bg-inherit hover:text-black transition-all duration-500 disabled:bg-blue-300 disabled:hover:text-white"
        >
          Обновить
        </button>
      </form>
    </>
  );
};

export default UpdateForm;
