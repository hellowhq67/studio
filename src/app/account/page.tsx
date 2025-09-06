
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/hooks/useCurrency';
import { getUserOrders } from '@/actions/order-actions';
import { updateUserProfile } from '@/actions/user-actions';
import type { Order, ShippingAddress } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'ZIP code is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, loading: authLoading, updateUserDisplayName } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.displayName || '',
      address: user?.shippingAddress?.address || '',
      city: user?.shippingAddress?.city || '',
      state: user?.shippingAddress?.state || '',
      zip: user?.shippingAddress?.zip || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.displayName || '',
        address: user.shippingAddress?.address || '',
        city: user.shippingAddress?.city || '',
        state: user.shippingAddress?.state || '',
        zip: user.shippingAddress?.zip || '',
      });
    }
  }, [user, reset]);


  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          setLoadingOrders(true);
          const userOrders = await getUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user) return;
    setIsSaving(true);
    try {
        const shippingAddress: ShippingAddress = {
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip
        }
        
        // Update Firestore
        const dbResult = await updateUserProfile(user.uid, { name: data.name, shippingAddress });

        if (!dbResult.success) {
            throw new Error(dbResult.message);
        }
        
        // Update Firebase Auth profile
        await updateUserDisplayName(data.name);

        toast({
            title: 'Profile Updated',
            description: 'Your information has been saved successfully.',
        });

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message || 'There was a problem saving your profile.',
        });
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-headline text-4xl mb-8">My Account</h1>
      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Here's a list of your past orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingOrders ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading orders...</TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No orders found.</TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.substring(0, 7)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
             <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal and shipping details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                         <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">{user?.displayName}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" {...register('name')} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                                 <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                            <div className="space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" {...register('address')} placeholder="123 Beauty Lane" />
                                    {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" {...register('city')} placeholder="Glamour City" />
                                        {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" {...register('state')} placeholder="CA" />
                                        {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input id="zip" {...register('zip')} placeholder="90210" />
                                        {errors.zip && <p className="text-sm text-destructive">{errors.zip.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <div className="flex justify-end gap-2 w-full">
                        <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>
                           {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
