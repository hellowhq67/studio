'use server';
/**
 * @fileOverview A customer service AI agent for the e-commerce store.
 *
 * - customerService - A function that handles customer service inquiries.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CustomerServiceInputSchema = z.object({
  prompt: z.string(),
});

const prompt = ai.definePrompt({
  name: 'customerServicePrompt',
  input: { schema: CustomerServiceInputSchema },
  output: { schema: z.string() },
  prompt: `You are a friendly and helpful customer service agent for "GlowUp," an online beauty and cosmetics store. 
  
  Your goal is to assist users with their questions about products, orders, and our store policies. Be polite, concise, and professional.

  - If a user asks about product recommendations, ask them about their skin type or preferences.
  - If a user asks about their order status, tell them they can check their order history in their account page.
  - If a user asks about shipping or return policies, summarize the relevant policy and direct them to the respective page in the footer.
  - For any other question, try to be as helpful as possible.

  User's question: {{{prompt}}}
  
  Your response:`,
});

export async function customerService(query: string): Promise<string> {
  const { output } = await prompt({ prompt: query });
  return output || "I'm sorry, I'm not sure how to answer that. Could you rephrase?";
}
