'use client';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
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

const ProductSchema = z.object({
  name: z.string().min(3, 'Product name is too short'),
  description: z.string().min(10, 'Description is too short'),
  longDescription: z.string().min(20, "Long description is too short"),
  tags: z.string().min(1, 'Please add at least one tag (comma-separated)'),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.coerce.number().optional(),
  specialPrice: z.coerce.number().optional(),
  couponCode: z.string().optional(),
  deliveryCharge: z.coerce.number().min(0, 'Delivery charge cannot be negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  deliveryTime: z.string().min(1, 'Please provide a delivery estimate'),
  category: z.enum(['Skincare', 'Makeup', 'Haircare', 'Fragrance']),
  brand: z.string().min(1, 'Brand is required'),
  images: z.any().refine((files) => files?.length >= 1, 'At least one image is required.'),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

export default function AddProductPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addProduct, initialState);
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
      images: undefined
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Product</CardTitle>
        <CardDescription>Fill out the details for your new product.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={dispatch} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
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

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="longDescription" render={({ field }) => (
                  <FormItem><FormLabel>Long Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="e.g. vegan, hydrating, summer" /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="images" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Product Photos</FormLabel>
                        <FormControl>
                            <Input type="file" multiple onChange={(e) => onChange(e.target.files)} {...rest} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
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
             {state.message && <p className="text-sm text-destructive">{state.message}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
