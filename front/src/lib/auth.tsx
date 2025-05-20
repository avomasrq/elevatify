import { useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    user: isLoaded && isSignedIn ? user : null,
    signOut: async () => { if (user) await user.signOut(); },
    updateUser: user?.update,
  };
}