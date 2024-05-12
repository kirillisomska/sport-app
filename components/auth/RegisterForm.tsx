"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { register } from "@/actions/register";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { useState, useTransition } from "react";
import Link from "next/link";

import logo from "@/public/images/logo.png";
import Image from "next/image";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        form.reset();
      });
    });
  };

  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
        >
          <Image
            src={logo}
            alt="Логотип"
            width={50}
            height={50}
            className="w-8 h-8 mr-2"
          />
          СпортАфиша
        </Link>
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Форма регистрации
            </h1>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Почта
                  </label>
                  <input
                    disabled={isPending}
                    {...form.register("email")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="example@mail.ru"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Пароль
                  </label>
                  <input
                    disabled={isPending}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 outline-none"
                    {...form.register("password")}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="******"
                  />
                </div>
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <button
                disabled={isPending}
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Зарегестрироваться
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Уже есть аккаунт?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Войти
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
