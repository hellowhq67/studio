
'use client';
import { useActionState, useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addProduct } from '@/actions/product-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateProductContent } from '@/ai/flows/generate-product-content';

const ProductSchema = z.object({
  name: z.string().min(3, 'Product name is too short'),
  description: z.string().min(10, 'Description is too short'),
  longDescription: z.string().min(20, "Long description is too short"),
  tags: z.string().min(1, 'Please add at least one tag (comma-separated)'),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.coerce.number().optional().nullable(),
  specialPrice: z.coerce.number().optional().nullable(),
  couponCode: z.string().optional(),
  deliveryCharge: z.coerce.number().min(0, 'Delivery charge cannot be negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  deliveryTime: z.string().min(1, 'Please provide a delivery estimate'),
  category: z.enum(['Skincare', 'Makeup', 'Haircare', 'Fragrance']),
  brand: z.string().min(1, 'Brand is required'),
  images: z.string().min(1, 'At least one image is required'),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

export default function AddProductPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(addProduct, initialState);
  const { toast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      longDescription: '',
      tags: '',
      price: 0,
      salePrice: undefined,
      specialPrice: undefined,
      couponCode: '',
      deliveryCharge: 0,
      quantity: 0,
      deliveryTime: '',
      category: 'Skincare',
      brand: '',
      images: ''
    },
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleAiGenerate = async () => {
    const { name, category } = form.getValues();
    if (!name || !category) {
        toast({ variant: 'destructive', title: 'Missing Info', description: 'Please provide a product name and category first.' });
        return;
    }
    if (imageUrls.length === 0) {
        toast({ variant: 'destructive', title: 'Missing Image', description: 'Please upload at least one product image to generate content.' });
        return;
    }
    setIsGenerating(true);

    try {
        // Fetch the first image and convert it to a data URI
        const response = await fetch(imageUrls[0]);
        const blob = await response.blob();
        const imageDataUri = await fileToDataUri(new File([blob], "image"));
        
        const result = await generateProductContent({
            name,
            category,
            imageDataUri
        });

        form.setValue('description', result.description, { shouldValidate: true });
        form.setValue('longDescription', result.longDescription, { shouldValidate: true });
        
        // Handle the generated poster image
        const posterBlob = await (await fetch(result.posterImageUrl)).blob();
        const posterFile = new File([posterBlob], `${name.toLowerCase().replace(/\s+/g, '-')}-poster.png`, { type: 'image/png' });
        
        await handleImageUpload(new File([posterFile]));

        toast({ title: 'AI Content Generated', description: 'Descriptions and a poster have been created for you.' });
    } catch (e) {
        console.error('AI generation error:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'AI Generation Failed', description: errorMessage });
    } finally {
        setIsGenerating(false);
    }
  }

  const handleImageUpload = async (fileOrFiles: File | FileList | null) => {
    if (!fileOrFiles) return;
    setIsUploading(true);

    const files = 'length' in fileOrFiles ? Array.from(fileOrFiles) : [fileOrFiles];
    if(files.length === 0) {
        setIsUploading(false);
        return;
    }

    try {
        const uploadPromises = files.map(async file => {
             const response = await fetch(`/api/upload?filename=${file.name}`, {
                method: 'POST',
                body: file,
             });
             if(!response.ok) throw new Error('Upload failed');
             const newBlob = (await response.json()) as PutBlobResult;
             return newBlob.url;
        });

        const urls = await Promise.all(uploadPromises);
        const newImageUrls = [...imageUrls, ...urls];
        setImageUrls(newImageUrls);
        form.setValue('images', newImageUrls.join(','), { shouldValidate: true });

        toast({ title: 'Images uploaded successfully' });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Upload Error', description: 'Could not upload images.' });
    } finally {
        setIsUploading(false);
    }
  };
  
  const removeImage = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    form.setValue('images', newImageUrls.join(','), { shouldValidate: true });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Product</CardTitle>
        <CardDescription>Fill out the details for your new product, or use AI to help generate content.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={dispatch} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="brand" render={({ field }) => (
                  <FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Skincare">Skincare</SelectItem>
                        <SelectItem value="Makeup">Makeup</SelectItem>
                        <SelectItem value="Haircare">Haircare</SelectItem>
                        <SelectItem value="Fragrance">Fragrance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="space-y-1">
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-lg font-semibold">Content</h3>
                         <Button type="button" variant="outline" size="sm" onClick={handleAiGenerate} disabled={isGenerating || isUploading}>
                            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate with AI
                         </Button>
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={form.control} name="longDescription" render={({ field }) => (
                      <FormItem><FormLabel>Long Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="e.g. vegan, hydrating, summer" /></FormControl><FormMessage /></FormItem>
                )} />

              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                 <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Photos</FormLabel>
                             <FormControl>
                                <>
                                    <Input type="hidden" {...field} />
                                    <div 
                                        className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50"
                                        onClick={() => inputFileRef.current?.click()}
                                    >
                                        <input 
                                            type="file" 
                                            ref={inputFileRef} 
                                            multiple 
                                            accept="image/*"
                                            className="hidden" 
                                            onChange={(e) => handleImageUpload(e.target.files)}
                                            disabled={isUploading}
                                        />
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p>Uploading...</p>
                                            </div>
                                        ) : (
                                             <div className="flex flex-col items-center gap-2">
                                                <UploadCloud className="h-8 w-8 text-muted-foreground"/>
                                                <p>Click or drag to upload images</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            </FormControl>
                            <FormMessage />
                             {imageUrls.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img src={url} alt={`upload-preview-${index}`} className="w-full h-24 object-cover rounded-md"/>
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             )}
                        </FormItem>
                    )}
                 />

                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel>Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="salePrice" render={({ field }) => (
                        <FormItem><FormLabel>Sale Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="specialPrice" render={({ field }) => (
                        <FormItem><FormLabel>Special Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="couponCode" render={({ field }) => (
                        <FormItem><FormLabel>Coupon Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="deliveryCharge" render={({ field }) => (
                        <FormItem><FormLabel>Delivery Charge ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="deliveryTime" render={({ field }) => (
                  <FormItem><FormLabel>Delivery Time</FormLabel><FormControl><Input {...field} placeholder="e.g. 2-3 business days" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <Button type="submit">Add Product</Button>
             {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
