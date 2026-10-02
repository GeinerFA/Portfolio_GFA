import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/** Compara el correo con ADMIN_EMAIL (sin distinguir mayúsculas). */
export function isAdminEmail(email: string | null | undefined): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin && email && email.trim().toLowerCase() === admin);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    // Solo el correo de ADMIN_EMAIL (verificado por Google) obtiene sesión.
    // Cualquier otro vuelve a /admin/login?error=AccessDenied.
    signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      return profile?.email_verified === true && isAdminEmail(profile.email);
    },
  },
});
