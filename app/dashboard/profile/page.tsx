import Card from "@/components/cards/Card";
import { getCompanyByOwnerId } from "@/data/company";
import { getAllEventTypes } from "@/data/eventType";
import { getFullUserInfoById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

const ProfilePage = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return <></>;
  }

  const fullUserInfo = await getFullUserInfoById(user?.id);

  const company = await getCompanyByOwnerId(user.id);

  const eventType = await getAllEventTypes();

  return (
    <>
      <h1 className="text-2xl text-gray-900">Профиль пользователя</h1>
      <hr className="mt-2 mb-4" />
      <div className="flex flex-row gap-6">
        <div className="relative flex flex-col gap-4 flex-auto min-w-0 p-4 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border mb-4 draggable">
          <div className="flex flex-row w-full justify-between items-center">
            <h1 className="text-xl text-gray-900">Общая информация</h1>
            <Link
              href="/dashboard/profile/edit"
              className="font-medium text-blue-600 hover:underline"
            >
              Редактировать
            </Link>
          </div>

          <div className="flex flex-row w-full gap-4">
            <div className="relative w-20 h-20 overflow-hidden bg-blue-100 rounded-md">
              {fullUserInfo?.image ? (
                <Image
                  width={100}
                  height={100}
                  className="absolute w-20 h-20"
                  src={fullUserInfo.image}
                  alt=" Аватарка пользователя"
                />
              ) : (
                <svg
                  className="absolute w-20 h-20 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="text-md text-gray-900">
                {fullUserInfo?.name ?? "Пользователь"}
              </h3>
              <h3 className="text-md font-bold text-gray-600">{user.role}</h3>
              <Link
                className="text-xs italic mt-4 text-gray-900 hover:text-blue-500 duration-500"
                href={`mailto:${user.email}`}
              >
                {user.email}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[50%] relative flex flex-col gap-4 flex-auto min-w-0 p-4 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border mb-4 draggable">
          <div className="flex flex-row w-full justify-between items-center">
            <h1 className="text-xl text-gray-900">Компания</h1>
            <Link
              href={`/dashboard/company/update/${company?.id}`}
              className="font-medium text-blue-600 hover:underline"
            >
              Редактировать
            </Link>
          </div>
          {company ? (
            <div className="flex flex-row w-full gap-4">
              <div className="relative w-20 h-20 overflow-hidden bg-blue-100 rounded-md">
                {company?.logoUrl ? (
                  <Image
                    width={100}
                    height={100}
                    className="absolute w-20 h-20"
                    src={company.logoUrl}
                    alt=" Аватарка пользователя"
                  />
                ) : (
                  <svg
                    className="absolute w-20 h-20 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-md text-gray-900">{company.name}</h3>
                <h3 className="text-md font-bold text-gray-600">
                  {company.isAccepted ? "Активирована" : "В процессе активации"}
                </h3>
                <Link
                  className="text-xs italic mt-4 text-gray-900 hover:text-blue-500 duration-500"
                  href={`/company/${company.id}`}
                >
                  Страница компании
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p>
                На платформе есть возможность{" "}
                <Link
                  className="font-medium text-blue-600 hover:underline"
                  href="/dashboard/company/create"
                >
                  регистрации
                </Link>{" "}
                собственной компании.
              </p>
              <p>
                Регистрация компании откроет возможность создания собственных
                событий и расширенному функционалу платформы
              </p>
            </>
          )}
        </div>
      </div>

      <div className="relative flex flex-col gap-4 flex-auto min-w-0 p-4 overflow-hidden break-words border-0 shadow-blur rounded-2xl bg-white/80 bg-clip-border mb-4 draggable">
        {user.role === "COMPANY" ? (
          <>
            <h1 className="text-xl text-gray-900">Список событий компании</h1>
            {company?.EventList.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {company.EventList.map((event) => (
                  <Card
                    key={event.id}
                    event={event}
                    company={company}
                    type={
                      eventType.find((ev) => ev.id === event.eventTypeId) ??
                      eventType[0]
                    }
                  ></Card>
                ))}
              </div>
            ) : (
              <section className="bg-white ">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                  <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ">
                      404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
                      Пока нет событий
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 ">
                      Не удалось найти список событий на которые зарегестрирован
                      пользователь
                    </p>
                    <Link
                      href="/"
                      className="inline-flex text-blue-500 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
                    >
                      К списку всех событий
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <h1 className="text-xl text-gray-900">Список событий</h1>
            {fullUserInfo?.events.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fullUserInfo.events.map((event) => (
                  <Card key={event.id} event={event}></Card>
                ))}
              </div>
            ) : (
              <section className="bg-white ">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                  <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ">
                      404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
                      Пока нет событий
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 ">
                      Не удалось найти список событий на которые зарегестрирован
                      пользователь
                    </p>
                    <Link
                      href="/"
                      className="inline-flex text-blue-500 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
                    >
                      К списку всех событий
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
