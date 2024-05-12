import CreateEventForm from "@/components/events/CreateEventForm";
import { getCompanyByOwnerId } from "@/data/company";
import { getAllEventTypes } from "@/data/eventType";
import { currentUser } from "@/lib/auth";

const CreateEventPage = async () => {
  const user = await currentUser();

  if (!user?.id || user.role !== "COMPANY") {
    return <h1>Недостаточно прав для просмотра контента страницы!</h1>;
  }

  const company = await getCompanyByOwnerId(user.id);

  if (!company) {
    return <h1>Не найдена компания для создания события</h1>
  }

  const eventTypesList = await getAllEventTypes();

  return (
    <>
        {
            <CreateEventForm company={company} userId={user.id} eventTypes={eventTypesList} />
        }
    </>
  );
};

export default CreateEventPage;
