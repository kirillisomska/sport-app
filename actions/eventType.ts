"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { CreateEventTypeSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createEventType = async (
  values: z.infer<typeof CreateEventTypeSchema>
) => {
  const validatedFields = CreateEventTypeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { value } = validatedFields.data;

  try {
    await db.eventType.create({
      data: {
        value,
      },
    });
    revalidatePath("/dashboard/eventTypes");
  } catch {
    return {
      error: "Ошибка при создании типа",
    };
  }

  return { success: "Тип успешно создан" };
};
