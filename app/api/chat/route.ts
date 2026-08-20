import { NextResponse } from "next/server";
import { getActiveProvider, runOpenAIChat, runGeminiChat } from "@/lib/providers";

export const dynamic = "force-dynamic";

interface ChatRequestBody {
  transcript?: unknown[];
  message?: string;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const priorTranscript = Array.isArray(body.transcript) ? body.transcript : [];
  const provider = getActiveProvider();

  try {
    const result =
      provider === "gemini"
        ? await runGeminiChat(priorTranscript, message)
        : await runOpenAIChat(priorTranscript, message);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[chat:${provider}] unexpected failure`, error);
    return NextResponse.json(
      {
        transcript: priorTranscript,
        reply: "Sorry, something went wrong on our side while generating a response. Please try again in a moment.",
        error: true,
      },
      { status: 200 }
    );
  }
}
