import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to genereat an SEO-focused title for a YouTube video
based on its transscript. Please folow these guidelines:
-Be concise and descriptive, using keywords that are relevant to the video content.
-Highlight the main topic of the video.
-Include the target keyword at the beginning of the title.
-Keep the title under 60 characters.
-Use title case.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });

  const transscript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();

    

    if (!text) {
      throw new Error("Bad request");
    }

    return text
  });

  console.log(transscript);

  const { body } = await context.api.openai.call("generate-title", {
    token: process.env.OPEN_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transscript,
        },
      ],
    },
  });

  const title = body.choices[0]?.message.content;

  if (!title) {
    throw new Error("Bad request");
  }

  await context.run("update-video", async () => {    
    await db
      .update(videos)
      .set({
        title: title || video.title,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
