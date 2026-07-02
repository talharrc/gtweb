const ADMIN_UID = import.meta.env.VITE_ADMIN_UID as string | undefined;

export function isSpaceAdmin(uid: string | null | undefined): boolean {
  return !!uid && !!ADMIN_UID && uid === ADMIN_UID;
}
