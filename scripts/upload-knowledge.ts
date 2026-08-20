/**
 * Uploads the knowledge files in /knowledge and creates a File Search
 * store for the VONROC customer service demo — for whichever AI
 * provider(s) have an API key configured. Runs the OpenAI upload if
 * OPENAI_API_KEY is set, the Gemini upload if GEMINI_API_KEY is set, or
 * both if both are set.
 *
 * Usage:
 *   npm run upload-knowledge
 *
 * Requires OPENAI_API_KEY and/or GEMINI_API_KEY to be set (e.g. in
 * .env.local).
 */
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

/** Minimal .env.local loader so this standalone script doesn't need a
 * dotenv dependency — Next.js loads .env.local automatically for the app,
 * but a script run via `tsx` does not. */
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");
const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".pdf"]);
const STORE_NAME = "vonroc-customer-service-demo";

const MIME_TYPES: Record<string, string> = {
  ".md": "text/markdown",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
};

/** Recursively collects supported knowledge files, so subfolders like
 * knowledge/products/ are picked up along with top-level files. */
function collectKnowledgeFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectKnowledgeFiles(fullPath));
    } else if (
      SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) &&
      entry.name.toLowerCase() !== "readme.md"
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadToOpenAI(files: string[]) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return;

  console.log("\n--- OpenAI ---");
  const client = new OpenAI({ apiKey });

  console.log(`Creating vector store "${STORE_NAME}"...`);
  const vectorStore = await client.vectorStores.create({ name: STORE_NAME });
  console.log(`Vector store created: ${vectorStore.id}`);

  console.log("Uploading and indexing files (this can take a minute)...");
  const streams = files.map((file) => fs.createReadStream(file));
  const batch = await client.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
    files: streams,
  });

  console.log(`Upload complete. Batch status: ${batch.status}`);
  console.log(`Files indexed: ${batch.file_counts.completed}/${batch.file_counts.total}`);
  if (batch.file_counts.failed > 0) {
    console.warn(`Warning: ${batch.file_counts.failed} file(s) failed to index.`);
  }

  console.log("\nAdd this to your .env.local file:");
  console.log(`\n  OPENAI_VECTOR_STORE_ID=${vectorStore.id}\n`);
}

async function uploadToGemini(files: string[]) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return;

  console.log("\n--- Gemini ---");
  const ai = new GoogleGenAI({ apiKey });

  console.log(`Creating File Search store "${STORE_NAME}"...`);
  const store = await ai.fileSearchStores.create({ config: { displayName: STORE_NAME } });
  if (!store.name) {
    throw new Error("Gemini did not return a File Search store name.");
  }
  console.log(`File Search store created: ${store.name}`);

  console.log("Uploading and indexing files (this can take a minute)...");
  for (const file of files) {
    const relativePath = path.relative(KNOWLEDGE_DIR, file);
    const mimeType = MIME_TYPES[path.extname(file).toLowerCase()] ?? "text/plain";

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      fileSearchStoreName: store.name,
      file,
      config: { displayName: relativePath, mimeType },
    });

    while (!operation.done) {
      await sleep(2000);
      operation = await ai.operations.get({ operation });
    }

    if (operation.error) {
      console.warn(`  ! Failed to index ${relativePath}: ${JSON.stringify(operation.error)}`);
    } else {
      console.log(`  - indexed ${relativePath}`);
    }
  }

  console.log("\nAdd this to your .env.local file:");
  console.log(`\n  GEMINI_FILE_SEARCH_STORE_NAME=${store.name}\n`);
}

async function main() {
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY?.trim());

  if (!hasOpenAIKey && !hasGeminiKey) {
    console.error(
      "Neither OPENAI_API_KEY nor GEMINI_API_KEY is set. Set at least one in your environment or .env.local before running this script."
    );
    process.exit(1);
  }

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`Knowledge directory not found at ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = collectKnowledgeFiles(KNOWLEDGE_DIR);

  if (files.length === 0) {
    console.error(`No supported knowledge files found in ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} knowledge file(s):`);
  for (const file of files) console.log(`  - ${path.relative(KNOWLEDGE_DIR, file)}`);

  if (hasOpenAIKey) await uploadToOpenAI(files);
  if (hasGeminiKey) await uploadToGemini(files);

  console.log("\n=======================================================");
  console.log("Done. Paste the value(s) printed above into .env.local,");
  console.log("then restart the dev server so the assistant picks them up.");
  console.log("=======================================================\n");
}

main().catch((error) => {
  console.error("Failed to upload knowledge base:", error);
  process.exit(1);
});
