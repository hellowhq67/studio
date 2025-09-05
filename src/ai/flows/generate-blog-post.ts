
'use server';
/**
 * @fileOverview An AI agent to generate blog posts based on web search results.
 * 
 * - generateBlogPost - A function that handles the blog post generation.
 * - GenerateBlogPostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI, googleSearchTool } from '@genkit-ai/googleai';

// Output Schema
const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('A catchy, SEO-friendly title for the blog post.'),
  content: z.string().describe('The full content of the blog post, formatted in HTML with headings, paragraphs, and lists.'),
  sources: z.array(z.string().url()).describe('A list of up to 5 source URLs used to generate the content.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


/**
 * The main function to generate a blog post.
 */
export async function generateBlogPost(topic: string): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(topic);
}


// Text Generation Prompt
const blogPrompt = ai.definePrompt({
    name: 'blogPostPrompt',
    input: { schema: z.string() },
    output: { schema: GenerateBlogPostOutputSchema },
    tools: [googleSearchTool],
    prompt: `You are an expert content writer and SEO specialist for a modern beauty and cosmetics e-commerce brand called "Evanie Glow".
    Your tone is engaging, informative, and stylish.
    
    Your task is to write a blog post about the following topic: {{{prompt}}}
    
    Use the provided web search tool to gather the latest information, trends, and tips related to the topic.
    Based on the search results, write a comprehensive and well-structured blog post.
    
    The output must be a single block of clean HTML. Do not wrap it in markdown.
    - Start with an <h2> heading for the main sections.
    - Use <p> tags for paragraphs.
    - Use <ul> and <li> for bullet points or <ol> and <li> for numbered lists where appropriate.
    
    Ensure the content is unique, helpful for the reader, and reflects the brand's sophisticated voice.
    Crucially, you MUST cite your sources. Your response must include a 'sources' array containing the top 3-5 most relevant URLs from your search results.`
});


// Flow Definition
const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: z.string(),
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (topic) => {
    
    const llmResponse = await blogPrompt(topic);
    const output = llmResponse.output;

    if (!output) {
      throw new Error('Failed to generate blog post content.');
    }

    return {
      title: output.title,
      content: output.content,
      sources: output.sources || [],
    };
  }
);
