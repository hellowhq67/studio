
'use server';
/**
 * @fileOverview An AI agent to generate product descriptions and promotional posters.
 * 
 * - generateProductContent - A function that handles content generation.
 * - GenerateProductContentInput - The input type for the function.
 * - GenerateProductContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Input Schema
const GenerateProductContentInputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product.'),
  imageDataUri: z
    .string()
    .describe(
      "The first uploaded image of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductContentInput = z.infer<typeof GenerateProductContentInputSchema>;

// Output Schema
const GenerateProductContentOutputSchema = z.object({
  description: z.string().describe('A short, catchy product description (around 10-15 words).'),
  longDescription: z.string().describe('A detailed, compelling product description (around 50-70 words).'),
  posterImageUrl: z
    .string()
    .describe(
      "A data URI of the generated poster image. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateProductContentOutput = z.infer<typeof GenerateProductContentOutputSchema>;


/**
 * The main function to generate product content.
 */
export async function generateProductContent(input: GenerateProductContentInput): Promise<GenerateProductContentOutput> {
  return generateProductContentFlow(input);
}


// Text Generation Prompt
const descriptionPrompt = ai.definePrompt({
    name: 'productDescriptionPrompt',
    input: { schema: z.object({ name: z.string(), category: z.string() }) },
    output: { schema: z.object({ description: z.string(), longDescription: z.string() }) },
    prompt: `You are a creative copywriter for a beauty brand called "Evanie Glow". 
    Your tone is elegant, modern, and inspiring.
    
    Generate a short and a long description for the following product.
    
    Product Name: {{{name}}}
    Category: {{{category}}}
    
    The short description should be a catchy tagline, around 10-15 words.
    The long description should be more detailed, highlighting benefits and unique features, around 50-70 words.`
});


// Image Generation Prompt (running in parallel)
const posterPrompt = [
    { media: { url: '{{imageDataUri}}' } },
    { text: 'Create a beautiful, minimalist, and elegant promotional poster for this product. Place the product on a clean, light-colored background with soft lighting. The overall mood should be luxurious and aspirational. Do not add any text to the image.' },
];


// Flow Definition
const generateProductContentFlow = ai.defineFlow(
  {
    name: 'generateProductContentFlow',
    inputSchema: GenerateProductContentInputSchema,
    outputSchema: GenerateProductContentOutputSchema,
  },
  async (input) => {

    const [descriptionResult, imageResult] = await Promise.all([
        // Generate Text
        descriptionPrompt({name: input.name, category: input.category}),

        // Generate Image
        ai.generate({
            model: googleAI.model('gemini-2.5-flash-image-preview'),
            prompt: posterPrompt.map(item => 
                'media' in item 
                ? { media: { url: input.imageDataUri } } 
                : item
            ),
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        })
    ]);
    
    const descriptions = descriptionResult.output;
    if (!descriptions) {
        throw new Error('Failed to generate product descriptions.');
    }
    
    const posterImage = imageResult.media;
    if (!posterImage?.url) {
        throw new Error('Failed to generate poster image.');
    }
    
    return {
      description: descriptions.description,
      longDescription: descriptions.longDescription,
      posterImageUrl: posterImage.url,
    };
  }
);
