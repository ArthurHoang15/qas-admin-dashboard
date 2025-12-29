"use server";

import { query } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { AppUser, UserRole, DashboardPage, RolePermission, ALL_DASHBOARD_PAGES } from "@/lib/types";

// Helper to verify current user is super_admin
async function verifySuperAdmin(): Promise<{ isAdmin: boolean; userId: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, userId: null };
  }

  const result = await query<{ role: UserRole }>(
    `SELECT role FROM app_users WHERE auth_user_id = $1`,
    [user.id]
  );

  return {
    isAdmin: result.rows[0]?.role === 'super_admin',
    userId: user.id
  };
}

/**
 * Get current user's app_user data
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const result = await query<AppUser>(
    `SELECT * FROM app_users WHERE auth_user_id = $1`,
    [user.id]
  );

  return result.rows[0] || null;
}

/**
 * Get all users (super_admin only)
 */
export async function getAllUsers(): Promise<AppUser[]> {
  const { isAdmin } = await verifySuperAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: Only super_admin can view all users");
  }

  const result = await query<AppUser>(
    `SELECT * FROM app_users ORDER BY created_at DESC`
  );

  return result.rows;
}

/**
 * Get user by ID (super_admin only)
 */
export async function getUserById(id: string): Promise<AppUser | null> {
  const { isAdmin } = await verifySuperAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: Only super_admin can view user details");
  }

  const result = await query<AppUser>(
    `SELECT * FROM app_users WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

/**
 * Assign role to user (super_admin only)
 * Cannot change role of the main super_admin email
 */
export async function assignRole(userId: string, role: UserRole): Promise<{ success: boolean; message: string }> {
  const { isAdmin } = await verifySuperAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized: Only super_admin can assign roles" };
  }

  // Check if trying to change the main super_admin email
  const userResult = await query<{ email: string }>(
    `SELECT email FROM app_users WHERE id = $1`,
    [userId]
  );

  const userEmail = userResult.rows[0]?.email;
  if (userEmail === process.env.ADMIN_EMAIL && role !== 'super_admin') {
    return { success: false, message: "Cannot change role of the main super_admin account" };
  }

  await query(
    `UPDATE app_users SET role = $1, updated_at = NOW() WHERE id = $2`,
    [role, userId]
  );

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: "Role assigned successfully" };
}

/**
 * Toggle user active status (super_admin only)
 * Cannot deactivate the main super_admin email
 */
export async function toggleUserActive(userId: string, isActive: boolean): Promise<{ success: boolean; message: string }> {
  const { isAdmin } = await verifySuperAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized: Only super_admin can change user status" };
  }

  // Check if trying to deactivate the main super_admin email
  const userResult = await query<{ email: string }>(
    `SELECT email FROM app_users WHERE id = $1`,
    [userId]
  );

  const userEmail = userResult.rows[0]?.email;
  if (userEmail === process.env.ADMIN_EMAIL && !isActive) {
    return { success: false, message: "Cannot deactivate the main super_admin account" };
  }

  await query(
    `UPDATE app_users SET is_active = $1, updated_at = NOW() WHERE id = $2`,
    [isActive, userId]
  );

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: isActive ? "User activated" : "User deactivated" };
}

/**
 * Get role permissions (all authenticated users can read)
 */
export async function getRolePermissions(role: NonNullable<UserRole>): Promise<DashboardPage[]> {
  const result = await query<{ page: DashboardPage }>(
    `SELECT page FROM role_permissions WHERE role = $1`,
    [role]
  );

  return result.rows.map(r => r.page);
}

/**
 * Get all role permissions (super_admin only)
 */
export async function getAllRolePermissions(): Promise<Record<NonNullable<UserRole>, DashboardPage[]>> {
  const { isAdmin } = await verifySuperAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: Only super_admin can view role permissions");
  }

  const result = await query<RolePermission>(
    `SELECT * FROM role_permissions ORDER BY role, page`
  );

  const permissions: Record<NonNullable<UserRole>, DashboardPage[]> = {
    super_admin: [],
    admin: [],
    internal: [],
  };

  result.rows.forEach(rp => {
    if (permissions[rp.role]) {
      permissions[rp.role].push(rp.page);
    }
  });

  return permissions;
}

/**
 * Update role permissions (super_admin only)
 * Cannot modify super_admin permissions
 */
export async function updateRolePermissions(
  role: NonNullable<UserRole>,
  pages: DashboardPage[]
): Promise<{ success: boolean; message: string }> {
  const { isAdmin } = await verifySuperAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized: Only super_admin can update permissions" };
  }

  // Cannot modify super_admin permissions
  if (role === 'super_admin') {
    return { success: false, message: "Cannot modify super_admin permissions" };
  }

  // Delete existing permissions for this role
  await query(`DELETE FROM role_permissions WHERE role = $1`, [role]);

  // Insert new permissions
  if (pages.length > 0) {
    const values = pages.map((page, i) => `($1, $${i + 2})`).join(', ');
    await query(
      `INSERT INTO role_permissions (role, page) VALUES ${values}`,
      [role, ...pages]
    );
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: "Permissions updated successfully" };
}

/**
 * Get current user's allowed pages based on role
 */
export async function getCurrentUserAllowedPages(): Promise<DashboardPage[]> {
  const currentUser = await getCurrentUser();

  if (!currentUser?.role) {
    return [];
  }

  return getRolePermissions(currentUser.role);
}
