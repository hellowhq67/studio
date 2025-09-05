
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
import { getProducts } from '@/actions/product-actions';
import type { Product } from '@/lib/types';


// Tool: Get Products
const getProductsTool = ai.defineTool(
    {
      name: 'getProducts',
      description: 'Retrieves a list of available products from the store catalog. Use this to answer questions about what products are available, what is on sale, or to find products with discounts or free delivery.',
      inputSchema: z.object({
        query: z.string().describe('A search query to filter products by name, description, category, or brand. Can also be "sale", "discount", or "free delivery" to find specific deals.'),
      }),
      outputSchema: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        salePrice: z.number().nullable().optional(),
        category: z.string(),
        brand: z.string(),
        images: z.array(z.string()),
        deliveryCharge: z.number().optional(),
      })),
    },
    async (input) => {
        console.log(`Getting products with query: ${input.query}`);
        const allProducts = await getProducts();
        const query = input.query.toLowerCase();

        if (query === 'sale' || query === 'discount') {
            return allProducts.filter(p => p.salePrice).map(p => ({ ...p, salePrice: p.salePrice || null }));
        }

        if (query === 'free delivery') {
            return allProducts.filter(p => p.deliveryCharge === 0).map(p => ({ ...p, salePrice: p.salePrice || null }));
        }

        if (!query) {
            return allProducts.slice(0, 5).map(p => ({ ...p, salePrice: p.salePrice || null })); // Return first 5 if no query
        }
        
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        );
        
        return filtered.map(p => ({ ...p, salePrice: p.salePrice || null }));
    }
);

// Tool: Add to Cart
const addToCartTool = ai.defineTool(
    {
        name: 'addToCart',
        description: "Adds a specified quantity of a product to the user's shopping cart. Returns a confirmation message.",
        inputSchema: z.object({
            productId: z.string().describe("The ID of the product to add to the cart."),
            quantity: z.number().int().positive().describe("The number of units to add."),
        }),
        outputSchema: z.string(),
    },
    async ({ productId, quantity }) => {
        // This is a placeholder. In a real app, you would have an action `cartActions.ts` 
        // to interact with the user's cart (e.g., in localStorage or a database).
        console.log(`AI trying to add ${quantity} of product ${productId} to cart.`);
        const product = await getProducts().then(products => products.find(p => p.id === productId));
        if (product) {
          return `I've added ${quantity} x ${product.name} to your cart.`;
        }
        return "I couldn't find that product to add it to your cart.";
    }
);

// Tool: Get Checkout URL
const getCheckoutUrlTool = ai.defineTool(
    {
        name: 'getCheckoutUrl',
        description: "Provides a URL to the checkout page.",
        inputSchema: z.object({}),
        outputSchema: z.string(),
    },
    async () => {
        return "/checkout";
    }
);


// Input Schema for the main chat flow
const ChatAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s message to the assistant.'),
  userName: z.string().optional().describe('The name of the user, if they are logged in.'),
  history: z.array(z.any()).optional().describe('The conversation history.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

// Output Schema for the main chat flow
const ChatAssistantOutputSchema = z.object({
  reply: z.string().describe('The assistant\'s text response to the user.'),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    salePrice: z.number().nullable().optional(),
    category: z.string(),
    brand: z.string(),
    images: z.array(z.string()),
    deliveryCharge: z.number().optional(),
  })).describe('A list of relevant products to display to the user, if any.'),
  checkoutUrl: z.string().optional().describe('A URL to the checkout page, if requested.'),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

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
export async function chatAssistant(input: ChatAssistantInput): Promise<ChatAssistantOutput> {
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
  tools: [getProductsTool, addToCartTool, getCheckoutUrlTool],
  prompt: `You are Eva, a friendly and helpful AI shopping assistant for an e-commerce store called "Evanie Glow".
  Your goal is to provide a delightful and seamless shopping experience.
  
  {{#if userName}}
  The user you are talking to is named {{userName}}. Greet them by name.
  {{else}}
  Greet the user warmly and introduce yourself.
  {{/if}}
  
  - Proactively suggest products, especially those on sale or with special offers like free delivery. Use the getProductsTool for this.
  - When you find products, list them in your reply and also return the product data in the 'products' output field.
  - If a user wants to add an item to their cart, use the addToCartTool. Confirm what was added.
  - If a user asks to checkout or is ready to pay, use the getCheckoutUrlTool and provide the link in your reply. Set the 'checkoutUrl' output field.
  - Use the conversation history to understand the context of the user's request.

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
    const llmResponse = await chatPrompt(input);
    const output = llmResponse.output;

    if (!output) {
      return { reply: "I'm sorry, I couldn't generate a response. Please try again.", products: [] };
    }

    // Ensure products array is always present
    if (!output.products) {
      output.products = [];
    }

    return output;
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
            prebuiltVoiceConfig: { voiceName: 'Calytrix' }, // Using a female voice
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
