export const rolePermissions = {
  ADMIN: ["*"] as const,
  ACCOUNTANT: [
    "invoice:create",
    "invoice:update",
    "payment:create",
    "expense:create",
    "withdrawal:create",
    "income:create",
    "reports:view"
  ] as const,
  STAFF: ["invoice:create", "payment:create", "expense:create"] as const
};

export function can(role: keyof typeof rolePermissions, permission: string) {
  const perms = rolePermissions[role] ?? [];
  return perms.includes("*") || perms.includes(permission as never);
}
