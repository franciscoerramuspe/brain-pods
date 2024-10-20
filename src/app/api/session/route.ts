import dotenv from "dotenv";

dotenv.config();

export async function startSession({ podId }: { podId: string }) {
  await fetch(`https://${process.env.NEXT_PUBLIC_SERVICE_API}/start`, {
    method: "POST",
    body: JSON.stringify({ podId: podId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
