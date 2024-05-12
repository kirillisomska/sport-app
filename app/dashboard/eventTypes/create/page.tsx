"use client";

import { createEventType } from "@/actions/eventType";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { CreateEventTypeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const CreateEventTypePage = () => {
  const session = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateEventTypeSchema>>({
    resolver: zodResolver(CreateEventTypeSchema),
    defaultValues: {
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof CreateEventTypeSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createEventType(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        form.reset();
      });
    });
  };

  if (!session.data?.user || session.data.user.role !== "ADMIN") {
    return <h1>Недостаточно прав для просмотра страницы!</h1>;
  }

  return (
    <>
      <h1 className="text-2xl text-gray-900">Форма создания типа события</h1>
      <hr className="mt-2 mb-4" />
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="value"
            >
              Название типа
            </label>
            <input
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled={isPending}
              {...form.register("value")}
              id="value"
              name="value"
              type="text"
              placeholder="Марафон"
            />
          </div>
        </div>
        <FormSuccess message={success} />
        <FormError message={error} />
        <button
          disabled={isPending}
          type="submit"
          className="max-w-[280px] w-full bg-blue-500 text-white rounded-md py-2 hover:bg-inherit hover:text-black transition-all duration-500"
        >
          Создать
        </button>
      </form>
    </>
  );
};

export default CreateEventTypePage;
