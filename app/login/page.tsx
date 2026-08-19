import { LoginForm } from "@/components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

function getSafeNextPath(next: string | undefined) {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function getErrorMessage(error: string | undefined) {
  if (error === "college_email") return "Preprence is currently available only to students of LD College of Engineering using a verified college email.";
  if (error === "auth") return "We couldn't complete sign in. Please try again.";
  return "";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <LoginForm
      initialMessage={getErrorMessage(params.error)}
      nextPath={getSafeNextPath(params.next)}
    />
  );
}
