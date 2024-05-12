"use server";

import * as z from "zod";
import { db } from "@/lib/db";

import { getUserById } from "@/data/user";
import { getCompanyById } from "@/data/company";
import { CreateEventSchema, UpdateEventSchema } from "@/schemas";
import { getEventTypeById } from "@/data/eventType";
import { getEventById } from "@/data/events";

export const createEvent = async (
  values: z.infer<typeof CreateEventSchema>
) => {
  const validatedFields = CreateEventSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  console.log(validatedFields.data);

  const {
    name,
    description,
    eventTypeId,
    location,
    date,
    socialLink,
    maxUserCount,
    logo,
    companyId,
  } = validatedFields.data;

  const eventType = await getEventTypeById(eventTypeId);

  if (!eventType) {
    return { error: "Invalid Event Type!" };
  }

  const company = await getCompanyById(companyId);

  if (!company) {
    return { error: "Invalid company!" };
  }

  try {
    await db.event.create({
      data: {
        name,
        description,
        location,
        date,
        socialLink,
        maxUserCount,
        logo,
        isAccepted: false,
        Company: {
          connect: {
            id: companyId,
          },
        },
        type: {
          connect: {
            id: eventTypeId,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Ошибка при создании события",
    };
  }

  return { success: "Заявка на создание события успешно создана!" };
};

export const updateEvent = async (
  values: z.infer<typeof UpdateEventSchema>
) => {
  const validatedFields = UpdateEventSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  console.log(validatedFields.data);

  const {
    id,
    name,
    description,
    eventTypeId,
    location,
    date,
    socialLink,
    maxUserCount,
    logo,
    companyId,
  } = validatedFields.data;

  const event = await getEventById(id);

  if (!event) {
    return {error: "Не удалось найти событие с заданным id"}
  }

  const eventType = await getEventTypeById(eventTypeId);

  if (!eventType) {
    return { error: "Invalid Event Type!" };
  }

  const company = await getCompanyById(companyId);

  if (!company) {
    return { error: "Invalid company!" };
  }

  try {
    await db.event.update({
      where: {
        id
      },
      data: {
        name,
        description,
        location,
        date,
        socialLink,
        maxUserCount,
        logo,
        isAccepted: false,
        Company: {
          connect: {
            id: companyId,
          },
        },
        type: {
          connect: {
            id: eventTypeId,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Ошибка при обновлении события",
    };
  }

  return { success: "Заявка на обновление события успешно создана!" };
};
