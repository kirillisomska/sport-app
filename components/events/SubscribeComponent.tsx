import { updateUserToEvent } from "@/data/events";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type PropTypes = {
  sessionId: string;
  eventId: string;
  isSubscribed: boolean;
};

const SubscribeComponent = async ({
  sessionId,
  eventId,
  isSubscribed,
}: PropTypes) => {
  const handleEvent = async () => {
    "use server";

    if (!sessionId) {
      redirect("/login");
    }

    await updateUserToEvent(sessionId, eventId);

    revalidatePath("/events/");
  };
  return (
    <form action={handleEvent}>
      <button
        className=" mt-2 max-w-[280px] w-full bg-blue-500 text-white rounded-md py-2 hover:bg-inherit hover:text-black transition-all duration-500 disabled:bg-blue-300 disabled:hover:text-white"
        type="submit"
      >
        {isSubscribed ? "Перестать отслеживать" : "Зарегестрироваться"}
      </button>
    </form>
  );
};

export default SubscribeComponent;
