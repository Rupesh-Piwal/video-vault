import { getUser } from "@/queries/user";
import { Login } from "../login";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await getUser();
  if (user) {
    return redirect("/dashboard");
  }

  return <Login mode="signup" />;
}
