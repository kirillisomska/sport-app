import { currentUser } from "@/lib/auth";
import type { Metadata } from "next";
import { signOut } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

import logo from "@/public/images/logo.png";

export const metadata: Metadata = {
  title: "Dashboard panel",
  description: "Dashboard panel",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/");
  }

  return (
    <div className="flex overflow-y-hidden h-[100vh]">
      <aside className="fixed flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-blue-600 border-r rtl:border-r-0 rtl:border-l">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Image
            className="w-auto h-12 rounded-full"
            src={logo}
            alt="Логотип"
            width={100}
            height={100}
          />
          <h2 className="text-white text-xl">СпортАфиша</h2>
        </Link>
        {
          user.role === "ADMIN" ? renderADMINMenu() : null
        }
        {
          user.role === "COMPANY" || user.role === "USER" ? renderShortMenu() : null
        }
      </aside>
      <div className="w-full flex flex-col">
        <header className=" bg-white py-2 pl-72 flex flex-row h-12 items-center justify-end pr-8 shadow-md">
          <div className="flex flex-row gap-4 w-3/12 items-end">
            <p>{user.name}</p>
            <p className="text-gray-900">Роль пользователя - {user.role}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              className="bg-blue-600 p-1 rounded-md text-white hover:text-gray-900 hover:bg-white transition-all font-medium"
              type="submit"
            >
              Выход
            </button>
          </form>
        </header>
        <div className="bg-gray-100 h-[100vh] overflow-y-scroll">
          <div className="ml-64 px-8 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

const renderADMINMenu = () => (
  <div className="flex flex-col justify-between flex-1 mt-6">
    <nav className="-mx-3 space-y-6 ">
      <div className="space-y-3 ">
        <label className="px-3 text-xs text-white uppercase">компании</label>

        <Link
          className="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg  hover:bg-blue-500 hover:text-gray-200"
          href="/dashboard/company"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>

          <span className="mx-2 text-sm font-medium">Компании</span>
        </Link>
      </div>

      <div className="space-y-3 ">
        <label className="px-3 text-xs text-white uppercase">События</label>

        <Link
          className="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg  hover:bg-blue-500 hover:text-gray-200"
          href="/dashboard/events"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>

          <span className="mx-2 text-sm font-medium">События</span>
        </Link>

        <Link
          className="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg  hover:bg-blue-500 hover:text-gray-200"
          href="/dashboard/eventTypes"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
            />
          </svg>

          <span className="mx-2 text-sm font-medium">Типы</span>
        </Link>
      </div>

      <div className="space-y-3 ">
        <label className="px-3 text-xs text-white uppercase">
          Кастомизация
        </label>

        <a
          className="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg  hover:bg-blue-500 hover:text-gray-200"
          href="/dashboard/profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span className="mx-2 text-sm font-medium">Настройки профиля</span>
        </a>
      </div>
    </nav>
  </div>
);

const renderShortMenu = () => (
  <div className="flex flex-col justify-between flex-1 mt-6">
    <nav className="-mx-3 space-y-6 ">
      <div className="space-y-3 ">
        <label className="px-3 text-xs text-white uppercase">События</label>

        <Link
          className="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg  hover:bg-blue-500 hover:text-gray-200"
          href="/dashboard/events"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>

          <span className="mx-2 text-sm font-medium">События</span>
        </Link>
      </div>

      <div className="space-y-3 ">
        <label className="px-3 text-xs text-white uppercase">
          Кастомизация
        </label>

        <a
          className="flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg  hover:bg-blue-500 hover:text-gray-200"
          href="/dashboard/profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span className="mx-2 text-sm font-medium">Настройки профиля</span>
        </a>
      </div>
    </nav>
  </div>
);
