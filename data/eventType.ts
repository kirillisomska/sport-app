import { db } from "@/lib/db";

export const getAllEventTypes = async () => {
  try {
    const eventTypesList = await db.eventType.findMany();

    return eventTypesList;
  } catch {
    return [];
  }
};

export const getEventTypeById = async (id: string) => {
  try {
    const eventType = await db.eventType.findUnique({
      where: {
        id,
      },
    });

    return eventType;
  } catch {
    return null;
  }
};
