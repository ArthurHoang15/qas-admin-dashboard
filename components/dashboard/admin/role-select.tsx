"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { assignRole } from "@/actions/rbac-actions";
import type { UserRole } from "@/lib/types";

interface RoleSelectProps {
  userId: string;
  currentRole: UserRole;
  onUpdate: () => void;
}

// Roles available for assignment (super_admin cannot be assigned via UI)
const ASSIGNABLE_ROLES: { value: UserRole; labelKey: string; bgColor: string; textColor: string }[] = [
  { value: null, labelKey: 'pending', bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
  { value: 'admin', labelKey: 'admin', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { value: 'internal', labelKey: 'internal', bgColor: 'bg-green-100', textColor: 'text-green-800' },
];

// Super admin display style (read-only badge)
const SUPER_ADMIN_STYLE = { bgColor: 'bg-purple-100', textColor: 'text-purple-800' };

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

  // Super admin badge (read-only)
  if (isProtected) {
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${SUPER_ADMIN_STYLE.bgColor} ${SUPER_ADMIN_STYLE.textColor}`}>
        {t('roles.super_admin')}
      </span>
    );
  }

  const currentRoleInfo = ASSIGNABLE_ROLES.find(r => r.value === currentRole) || ASSIGNABLE_ROLES[0];

  return (
    <div className="relative inline-block">
      <select
        value={currentRole === null ? 'null' : currentRole}
        onChange={handleRoleChange}
        disabled={updating}
        className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${currentRoleInfo.bgColor} ${currentRoleInfo.textColor}`}
      >
        {ASSIGNABLE_ROLES.map((role) => (
          <option
            key={role.labelKey}
            value={role.value === null ? 'null' : role.value}
            className="bg-white text-slate-900"
          >
            {t(`roles.${role.labelKey}`)}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {updating ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        ) : (
          <ChevronDown className={`w-4 h-4 ${currentRoleInfo.textColor}`} />
        )}
      </div>
    </div>
  );
}
