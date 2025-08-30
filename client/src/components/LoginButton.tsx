"use client";

import { createClient } from "@/supabase/client";

export default function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
}
