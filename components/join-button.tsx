import { JOIN_FALLBACK_URL } from "@/lib/site";

export function JoinButton({
  joinUrl,
  variant = "primary",
}: {
  joinUrl?: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <a href={joinUrl || JOIN_FALLBACK_URL} className={`btn btn-${variant}`}>
      Join Rural ACCESS
    </a>
  );
}
