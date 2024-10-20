import { supabase } from "@/lib/supabase";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
//
// dotenv.config();

export async function uploadEmbeddings({
  podId,
  context,
}: {
  podId: string;
  context: string;
}) {
  // const genAI = new GoogleGenerativeAI(
  //   process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  // );
  // const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  // const result = await model.embedContent(context);
  // const embedding = result.embedding.values;

  // INSERT EMBEDDING INTO DATABASE
  const { data, error } = await supabase
    .from("pod")
    .update({
      embedding: context,
    })
    .eq("id", podId);

  if (error) {
    console.error("Error uploading embeddings: ", error);
    return error;
  }

  return data;
}
