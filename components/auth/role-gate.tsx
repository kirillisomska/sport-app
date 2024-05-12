"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
  children: React.ReactNode;
  role: UserRole;
}

export const RoleGate = ({ children, role }: RoleGateProps) => {
  const currentRole = useCurrentRole();

  if (currentRole !== role && currentRole !== UserRole.ADMIN) {
    return <p>Dont have permissions</p>;
  }

  return <>{children}</>;
};
