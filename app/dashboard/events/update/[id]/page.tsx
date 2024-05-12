import CreateEventForm from "@/components/events/CreateEventForm";
import UpdateEventForm from "@/components/events/UpdateEventForm";
import { getCompanyByOwnerId } from "@/data/company";
import { getAllEventTypes } from "@/data/eventType";
import { getAllEvents, getEventById } from "@/data/events";
import { currentUser } from "@/lib/auth";

export async function generateStaticParams() {
  const eventsList = await getAllEvents();

  return eventsList.map((event) => ({
    id: event.id,
  }));
}

const UpdateEventPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user?.id || user.role !== "COMPANY") {
    return <h1>Недостаточно прав для просмотра контента страницы!</h1>;
  }

  const company = await getCompanyByOwnerId(user.id);

  if (!company) {
    return <h1 className="text-2xl text-gray-900">Не найдена компания для создания события</h1>;
  }

  const event = await getEventById(params.id);

  if (!event) {
    return <h1 className="text-2xl text-gray-900">Обновляемое событие не найдено</h1>;
  }

  if (event.Company?.id !== company.id) {
    return <h1 className="text-2xl text-gray-900">Недостаточно прав для просмотра контента страницы!</h1>;
  }

  const eventTypesList = await getAllEventTypes();

  return (
    <>
      {
        <UpdateEventForm
          event={event}
          company={company}
          userId={user.id}
          eventTypes={eventTypesList}
        />
      }
    </>
  );
};

export default UpdateEventPage;
