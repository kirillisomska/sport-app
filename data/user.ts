import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      }
    });

    return user;
  } catch {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const userList = await db.user.findMany();

    return userList;
  } catch {
    return [];
  }
}

export const getFullUserInfoById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        events: true,
        company: true,
      }
    });

    return user;
  } catch {
    return null;
  }
}
