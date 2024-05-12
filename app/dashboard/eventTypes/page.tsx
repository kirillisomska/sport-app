import { getAllEventTypes } from "@/data/eventType";
import { currentUser } from "@/lib/auth";
import { EventType } from "@prisma/client";
import Link from "next/link";

const EventTypesPage = async () => {
  const user = await currentUser();

  if (!user?.id || user.role !== "ADMIN") {
    return <h1>Недостаточно прав для просмотра контента страницы!</h1>;
  }

  const eventTypesList = await getAllEventTypes();

  return (
    <div>
      <h1 className="text-2xl text-gray-900">Список типов событий</h1>
      <hr className="mt-2 mb-4" />
      <Link
        className="mb-3 hover:text-blue-600 transition-all flex flex-row items-center gap-2 text-gray-900 text-md w-24"
        href="/dashboard/eventTypes/create"
      >
        <span className="font-bold text-3xl text-blue-600">+</span>Создать
      </Link>
      {renderEventTypesList(eventTypesList)}
    </div>
  );
};

const renderEventTypesList = (eventTypesList: EventType[]) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-blue-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              id
            </th>
            <th scope="col" className="px-6 py-3">
              Название
            </th>
          </tr>
        </thead>
        <tbody>
          {eventTypesList.map((eventType) => (
            <tr key={eventType.id} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {eventType.id}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {eventType.value}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTypesPage;
