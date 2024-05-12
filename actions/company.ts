"use server";

import * as z from "zod";
import { db } from "@/lib/db";

import { CreateCompanySchema, UpdateCompanySchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { getCompanyById } from "@/data/company";

export const createCompany = async (
  values: z.infer<typeof CreateCompanySchema>
) => {
  const validatedFields = CreateCompanySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, description, logoUrl, userId } = validatedFields.data;

  console.log(validatedFields.data);

  const user = await getUserById(userId);

  console.log(user);

  if (!user) {
    return { error: "Invalid user" };
  }

  try {
    await db.company.create({
      data: {
        name,
        description,
        logoUrl,
        isAccepted: false,
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  } catch {
    return {
      error: "Пользователь с данным id исчерпал количество созданных компаний",
    };
  }

  return { success: "Заявка на создание компании успешно создана!" };
};

export const updateCompany = async (
  values: z.infer<typeof UpdateCompanySchema>
) => {
  const validatedFields = UpdateCompanySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { id, name, description, logoUrl, socialLink } = validatedFields.data;

  const company = await getCompanyById(id);

  if (!company) {
    return { error: "Invalid company" };
  }

  try {
    await db.company.update({
      where: {
        id
      },
      data: {
        name,
        description,
        logoUrl,
        socialLink,
        isAccepted: false,
      },
    });
  } catch {
    return {
      error: "Не удалось обновить компанию",
    };
  }

  return { success: "Заявка на обновление компании успешно создана!" };
};