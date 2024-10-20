import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function uploadEmbeddings({
  podId,
  context,
}: {
  podId: string;
  context: string;
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const result = await model.embedContent(context);
  const embedding = result.embedding;

  console.log(embedding);

  // INSERT EMBEDDING INTO DATABASE
  supabase
    .from("pod")
    .update({
      embedding: embedding,
    })
    .eq("id", podId);
}
