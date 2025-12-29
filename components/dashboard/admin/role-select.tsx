"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { assignRole } from "@/actions/rbac-actions";
import type { UserRole } from "@/lib/types";

interface RoleSelectProps {
  userId: string;
  currentRole: UserRole;
  onUpdate: () => void;
}

const ROLES: { value: UserRole; labelKey: string; color: string }[] = [
  { value: null, labelKey: 'pending', color: 'bg-amber-500/20 text-amber-400' },
  { value: 'super_admin', labelKey: 'super_admin', color: 'bg-purple-500/20 text-purple-400' },
  { value: 'admin', labelKey: 'admin', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'internal', labelKey: 'internal', color: 'bg-green-500/20 text-green-400' },
];

export function RoleSelect({ userId, currentRole, onUpdate }: RoleSelectProps) {
  const t = useTranslations("admin");
  const [updating, setUpdating] = useState(false);

  // Super admin role cannot be changed (server will also reject)
  const isProtected = currentRole === 'super_admin';

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value === 'null' ? null : e.target.value as NonNullable<UserRole>;

    if (newRole === currentRole) return;

    setUpdating(true);
    try {
      const result = await assignRole(userId, newRole);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
    } finally {
      setUpdating(false);
    }
  };

  const currentRoleInfo = ROLES.find(r => r.value === currentRole) || ROLES[0];

  if (isProtected) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentRoleInfo.color}`}>
        {t(`roles.${currentRoleInfo.labelKey}`)}
      </span>
    );
  }

  return (
    <div className="relative">
      <select
        value={currentRole === null ? 'null' : currentRole}
        onChange={handleRoleChange}
        disabled={updating}
        className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-sm font-medium border-0 cursor-pointer ${currentRoleInfo.color} disabled:opacity-50`}
      >
        {ROLES.map((role) => (
          <option key={role.labelKey} value={role.value === null ? 'null' : role.value}>
            {t(`roles.${role.labelKey}`)}
          </option>
        ))}
      </select>
      {updating && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      )}
    </div>
  );
}
