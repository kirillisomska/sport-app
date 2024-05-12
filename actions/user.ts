"use server";

import * as z from "zod";
import { db } from "@/lib/db";

import { getUserById } from "@/data/user";
import { getCompanyById } from "@/data/company";
import { UpdateUserSchema } from "@/schemas";
import { getEventTypeById } from "@/data/eventType";
import { getEventById } from "@/data/events";
import { revalidatePath } from "next/cache";


export const updateUser = async (
  values: z.infer<typeof UpdateUserSchema>
) => {
  const validatedFields = UpdateUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const {
    id,
    name,
    image
  } = validatedFields.data;

  const user = await getUserById(id);

  if (!user) {
    return {error: "Не удалось найти пользователя с заданным id"}
  }

  try {
    await db.user.update({
      where: {
        id
      },
      data: {
        name,
        image,
      },
    });

    revalidatePath("/dashboard/profile", "page");
  } catch (e) {
    console.log(e);
    return {
      error: "Ошибка при обновлении пользователя",
    };
  }

  return { success: "Пользователь успешно обновлен!" };
};
