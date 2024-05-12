"use client";

import { CreateEventSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, EventType, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSuccess from "../auth/form-success";
import FormError from "../auth/form-error";
import { createEvent } from "@/actions/events";
import MDEditor from "@uiw/react-md-editor";
import Link from "next/link";

type PropTypes = {
  company: Company;
  userId: string;
  eventTypes: EventType[];
};

const CreateEventForm = ({ company, userId, eventTypes }: PropTypes) => {
  const session = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState<string | undefined>();
  const [remember, setRemember] = useState<number>(0);

  const form = useForm<z.infer<typeof CreateEventSchema>>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      name: "",
      description: "",
      eventTypeId: eventTypes.length ? eventTypes[0].id : "",
      location: "",
      date: new Date(),
      socialLink: "",
      logo: "",
      maxUserCount: 0,
      companyId: company.id,
    },
  });

  const handleSubmit = (values: z.infer<typeof CreateEventSchema>) => {
    setError("");
    setSuccess("");

    values.description = description ?? "";
    values.maxUserCount = Number(values.maxUserCount);
    values.date = new Date(values.date);

    startTransition(() => {
      createEvent(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        form.reset();
      });
    });
  };

  if (!session.data?.user || session.data.user.role !== "COMPANY") {
    return (
      <h1 className="text-2xl text-gray-900">
        Недостаточно прав для просмотра страницы!
      </h1>
    );
  }

  return (
    <>
      <h1 className="text-2xl text-gray-900">Форма создания события</h1>
      <hr className="mt-2 mb-4" />

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              className="block mb-2 text-sm font-medium text-gray-900"
              htmlFor="name"
            >
              Название события
            </label>
            <input
              disabled={isPending}
              className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...form.register("name")}
              id="name"
              name="name"
              type="text"
              placeholder="Название"
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
              placeholder="Небольшое описание события"
            />
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="logo"
              >
                Ссылка на картинку
              </label>
              <input
                disabled={isPending}
                className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...form.register("logo")}
                id="logo"
                name="logo"
                type="text"
                placeholder="http://..."
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="socialLink"
              >
                Ссылка на соц сеть
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

          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="location"
              >
                Место проведения события
              </label>
              <input
                disabled={isPending}
                {...form.register("location")}
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="location"
                name="location"
                type="text"
                placeholder="Омск, ..."
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="date"
              >
                Дата события
              </label>
              <input
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                disabled={isPending}
                {...form.register("date")}
                id="date"
                name="date"
                type="datetime-local"
              />
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="maxUserCount"
              >
                Максимальное число участников
              </label>
              <input
                disabled={isPending}
                {...form.register("maxUserCount")}
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="maxUserCount"
                name="maxUserCount"
                type="number"
                min={0}
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="eventTypeId"
              >
                Тип события
              </label>
              <select
                id="eventTypeId"
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                {...form.register("eventTypeId")}
                disabled={isPending}
              >
                {eventTypes.map((eventType) => (
                  <option key={eventType.id} value={eventType.id}>
                    {eventType.value}
                  </option>
                ))}
              </select>
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
              правилами создания мероприятий
            </Link>
            .
          </label>
        </div>
        <button
          disabled={isPending || !remember}
          type="submit"
          className="max-w-[280px] w-full bg-blue-500 text-white rounded-md py-2 hover:bg-inherit hover:text-black transition-all duration-500 disabled:bg-blue-300 disabled:hover:text-white"
        >
          Создать
        </button>
      </form>
    </>
  );
};

export default CreateEventForm;
