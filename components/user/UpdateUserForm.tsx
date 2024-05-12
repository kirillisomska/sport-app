"use client";

import { updateUser } from "@/actions/user";
import { UpdateUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSuccess from "../auth/form-success";
import FormError from "../auth/form-error";

type PropTypes = {
  user: User;
};

const UpdateUserForm = ({ user }: PropTypes) => {
  const session = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name ?? "",
      image: user.image ?? "",
    },
  });

  const handleSubmit = (values: z.infer<typeof UpdateUserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      updateUser(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        form.reset();
      });
    });
  };

  if (!session.data?.user) {
    return (
      <h1 className="text-2xl text-gray-900">
        Недостаточно прав для просмотра страницы!
      </h1>
    );
  }

  return (
    <>
      <h1 className="text-2xl text-gray-900">Форма обновления пользователя</h1>
      <hr className="mt-2 mb-4" />

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="name"
            >
              Имя пользователя
            </label>
            <input
              disabled={isPending}
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...form.register("name")}
              id="name"
              name="name"
              type="text"
              placeholder="Имя пользователя"
            />
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="image"
              >
                Аватарка пользователя
              </label>
              <input
                disabled={isPending}
                className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...form.register("image")}
                id="image"
                name="image"
                type="text"
                placeholder="http://..."
              />
            </div>
          </div>
        </div>
        <FormSuccess message={success} />
        <FormError message={error} />
        <button
          disabled={isPending}
          type="submit"
          className="max-w-[280px] w-full bg-blue-500 text-white rounded-md py-2 hover:bg-inherit hover:text-black transition-all duration-500 disabled:bg-blue-300 disabled:hover:text-white"
        >
          Обновить
        </button>
      </form>
    </>
  );
};

export default UpdateUserForm;
