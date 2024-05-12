import {
  getAllEvents,
  getAllEventsByOwnerId,
  getAllEventsByUserId,
  updateEventStatus,
} from "@/data/events";
import { currentUser } from "@/lib/auth";
import { $Enums, Event, EventType, User, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const EventsPage = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return <h1>Недостаточно прав для просмотра контента страницы!</h1>;
  }

  let eventsList = await getEventsListByUSerRole(user.role, user.id);

  return (
    <>
      <h1 className="text-2xl text-gray-900">Список всех событий</h1>
      <hr className="mt-2 mb-4" />
      {user.role === "COMPANY" ? (
        <Link
          className="mb-3 hover:text-blue-600 transition-all flex flex-row items-center gap-2 text-gray-900 text-md w-24"
          href="/dashboard/events/create"
        >
          <span className="font-bold text-3xl text-blue-600">+</span>Создать
        </Link>
      ) : null}
      {user.role === "ADMIN" ? renderEventsTableADMIN(eventsList) : null}
      {user.role === "COMPANY" ? renderEventsTableCOMPANY(eventsList) : null}
      {user.role === "USER" ? renderEventsTableUSER(eventsList) : null}
    </>
  );
};

const getEventsListByUSerRole = async (userRole: UserRole, userId: string) => {
  if (userRole === "ADMIN") {
    return await getAllEvents();
  }

  if (userRole === "COMPANY") {
    return await getAllEventsByOwnerId(userId);
  }

  return await getAllEventsByUserId(userId);
};

type FullEvent = Event & {
  type: {
    id: string;
    value: string;
  };
  Company: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    socialLink: string | null;
    userId: string;
    isAccepted: boolean;
  } | null;
  users: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    role: $Enums.UserRole;
  }[];
};

const renderEventsTableCOMPANY = (eventsList: FullEvent[]) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-blue-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Название
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Статус
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Дата
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Пользователи
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {eventsList.map((event) => (
            <tr key={event.id} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {event.name}
              </th>
              <td className="px-6 py-4">
                {event.isAccepted ? (
                  <span className="rounded bg-green-400 py-1 px-3 text-xs font-bold text-white">
                    Активирована
                  </span>
                ) : (
                  <span className="rounded bg-orange-400 py-1 px-3 text-xs font-bold text-white">
                    Ждет активации
                  </span>
                )}
              </td>
              <td className="px-6 py-4"> {event.date?.toDateString()}</td>
              <td className="px-6 py-4">
                {" "}
                {`${event.users.length}/${event.maxUserCount}`}
              </td>
              <td className="px-6 py-4 text-right flex flex-col gap-1">
                <Link
                  href={`/dashboard/events/update/${event.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Редактировать
                </Link>
                <Link
                  href={`/events/${event.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Просмотреть
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderEventsTableUSER = (eventsList: FullEvent[]) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-blue-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Название
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Дата
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {eventsList.map((event) => (
            <tr key={event.id} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {event.name}
              </th>
              <td className="px-6 py-4"> {event.date?.toDateString()}</td>
              <td className="px-6 py-4 text-right flex flex-col gap-1">
                <Link
                  href={`/dashboard/events/update/${event.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Перестать отслеживать
                </Link>
                <Link
                  href={`/events/${event.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Просмотреть
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderEventsTableADMIN = (eventsList: FullEvent[]) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-blue-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Название
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Статус
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Дата
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Компания
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <div className="flex items-center">
                Пользователи
                <a href="#">
                  <svg
                    className="w-3 h-3 ms-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg>
                </a>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {eventsList.map((event) => (
            <tr key={event.id} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {event.name}
              </th>
              <td className="px-6 py-4">
                {event.isAccepted ? (
                  <span className="rounded bg-green-400 py-1 px-3 text-xs font-bold text-white">
                    Активирована
                  </span>
                ) : (
                  <span className="rounded bg-orange-400 py-1 px-3 text-xs font-bold text-white">
                    Ждет активации
                  </span>
                )}
              </td>
              <td className="px-6 py-4"> {event.date?.toDateString()}</td>
              <td className="px-6 py-4"> {event.Company?.name}</td>

              <td className="px-6 py-4">
                {" "}
                {`${event.users.length}/${event.maxUserCount}`}
              </td>
              <td className="px-6 py-4 text-right flex flex-col gap-1">
              <form
                action={async () => {
                  "use server";
                  await updateEventStatus(event.id);

                  revalidatePath("/dashboard/events", "page");
                }}
              >
                <button
                  type="submit"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Изменить статус
                </button>
              </form>
                <Link
                  href={`/events/${event.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Просмотреть
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsPage;
