import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Ensure AWS credentials are configured in environment variables

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const modelId = "meta.llama3-8b-instruct-v1:0";

interface BedrockResponse {
  generation: string;
  prompt_token_count: number;
  generation_token_count: number;
  stop_reason: string;
}

export async function getBedrockCompletion(
  prompt: string
): Promise<string | null> {
  try {
    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: `<s>[INST] ${prompt} [/INST]`,
        max_gen_len: 2048,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    const response = await client.send(command);
    const decodedBody = new TextDecoder().decode(response.body);
    const parsedBody: BedrockResponse = JSON.parse(decodedBody);

    return parsedBody.generation;
  } catch (error) {
    console.error("Error getting completion from Bedrock:", error);
    return null;
  }
}
