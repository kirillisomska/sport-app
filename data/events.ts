import { db } from "@/lib/db";
import { getUserById } from "./user";

export const getEventById = async (id: string) => {
  try {
    const event = await db.event.findUnique({
      where: {
        id,
      },
      include: {
        type: true,
        users: true,
        Company: true,
      },
    });

    return event;
  } catch {
    return null;
  }
};

export const getAllEvents = async () => {
  try {
    const eventList = await db.event.findMany({
      include: {
        type: true,
        users: true,
        Company: true,
      },
    });

    return eventList;
  } catch {
    return [];
  }
};

export const getAllActiveEvents = async () => {
  try {
    const eventList = await db.event.findMany({
      where: {
        isAccepted: true,
      },
      include: {
        type: true,
        users: true,
        Company: true,
      },
    });

    return eventList;
  } catch {
    return [];
  }
};

export const getAllEventsByUserId = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        events: {
          include: {
            type: true,
            users: true,
            Company: true,
          },
        },
      },
    });

    if (!user) {
      console.log("Пользователь не найден");
      return [];
    }

    return user.events.filter((event) => event.isAccepted);
  } catch {
    return [];
  }
};

export const getAllEventsByOwnerId = async (userId: string) => {
  try {
    const eventsList = await db.company.findUnique({
      where: {
        userId,
      },
      include: {
        EventList: {
          include: {
            Company: true,
            users: true,
            type: true,
          },
        },
      },
    });

    if (!eventsList) {
      return [];
    }

    return eventsList.EventList;
  } catch {
    return [];
  }
};

export const updateEventStatus = async (id: string) => {
  try {
    const event = await getEventById(id);

    if (!event) {
      return null;
    }

    const updatedEvent = await db.event.update({
      where: {
        id,
      },
      data: {
        isAccepted: !event.isAccepted,
      },
    });

    return updatedEvent;
  } catch {
    return null;
  }
};

export const updateUserToEvent = async (userId: string, eventId: string) => {
  try {
    const event = await getEventById(eventId);

    if (!event) {
      return null;
    }

    const user = await getUserById(userId);

    if (!user) {
      return null;
    }

    if (event.users.filter((usr) => usr.id === user.id).length) {
      await db.event.update({
        where: {
          id: eventId,
        },
        data: {
          users: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } else {
      await db.event.update({
        where: {
          id: eventId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }
  } catch {
    return null;
  }
};
