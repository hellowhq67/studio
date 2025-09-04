
'use server';

/**
 * @fileOverview A conversational AI assistant for the e-commerce site.
 *
 * - chatAssistant - Handles the chat conversation.
 * - textToSpeech - Converts text to audio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

// Input Schema for the main chat flow
const ChatAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s message to the assistant.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

// Output Schema for the main chat flow
const ChatAssistantOutputSchema = z.object({
  reply: z.string().describe('The assistant\'s response to the user.'),
});
export type ChatAssistantOutputSchema = z.infer<typeof ChatAssistantOutputSchema>;

// Input schema for TTS flow
const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

// Output schema for TTS flow
const TextToSpeechOutputSchema = z.object({
    media: z.string().describe("A data URI of the generated audio. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


/**
 * The main chat assistant flow.
 */
export async function chatAssistant(input: ChatAssistantInput): Promise<ChatAssistantOutputSchema> {
  return chatAssistantFlow(input);
}

/**
 * Converts text to speech.
 */
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    return textToSpeechFlow(input);
}


// Helper function to convert PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Prompt for the chat assistant
const chatPrompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: { schema: ChatAssistantInputSchema },
  output: { schema: ChatAssistantOutputSchema },
  prompt: `You are a friendly and helpful AI customer service assistant for an e-commerce store called "Evanie Glow".
  Your goal is to assist users with their questions about products, orders, and the website.
  Keep your answers concise and helpful.

  User query: {{{query}}}`,
});


// Flow definition for the chat assistant
const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);


// Flow definition for Text-to-Speech
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('No media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
