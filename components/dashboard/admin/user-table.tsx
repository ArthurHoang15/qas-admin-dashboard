"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, ToggleLeft, ToggleRight } from "lucide-react";
import { RoleSelect } from "./role-select";
import { toggleUserActive } from "@/actions/rbac-actions";
import type { AppUser } from "@/lib/types";

interface UserTableProps {
  users: AppUser[];
  onUpdate: () => void;
}

export function UserTable({ users, onUpdate }: UserTableProps) {
  const t = useTranslations("admin.usersTable");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);
    try {
      const result = await toggleUserActive(userId, !currentStatus);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("noUsers")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("columns.user")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("columns.role")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("columns.status")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("columns.createdAt")}
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {user.full_name || 'No name'}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <RoleSelect
                  userId={user.id}
                  currentRole={user.role}
                  onUpdate={onUpdate}
                />
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {user.is_active ? t("active") : t("inactive")}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(user.created_at)}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => handleToggleActive(user.id, user.is_active)}
                  disabled={updating === user.id || user.role === 'super_admin'}
                  className={`p-2 rounded-lg transition-colors ${
                    user.is_active
                      ? 'text-green-400 hover:bg-green-500/20'
                      : 'text-muted-foreground hover:bg-muted'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={user.is_active ? t("deactivate") : t("activate")}
                >
                  {updating === user.id ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
                  ) : user.is_active ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
