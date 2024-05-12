import { db } from "@/lib/db";

export const getCompanyById = async (id: string) => {
  try {
    const company = await db.company.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        EventList: true,
      },
    });

    return company;
  } catch {
    return null;
  }
};

export const getCompanyByOwnerId = async (id: string) => {
  try {
    const company = await db.company.findUnique({
      where: {
        userId: id,
      },
      include: {
        owner: true,
        EventList: true,
      },
    });

    return company;
  } catch {
    return null;
  }
};

export const getAllCompanys = async () => {
  try {
    const company = await db.company.findMany();

    return company;
  } catch {
    return [];
  }
};

export const updateCompanyStatus = async (id: string) => {
  try {
    const company = await db.company.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        EventList: true,
      },
    });

    if (!company) return null;

    const res = await db.company.update({
      where: {
        id,
      },
      data: {
        isAccepted: !company.isAccepted,
      },
    });

    await db.user.update({
      where: {
        id: res.userId,
      },
      data: {
        role: res.isAccepted ? "COMPANY" : "ADMIN",
      },
    });

    return res;
  } catch {
    return null;
  }
};
