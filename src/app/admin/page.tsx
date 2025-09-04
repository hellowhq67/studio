
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { getProducts } from '@/actions/product-actions';
import { getAllOrders } from '@/actions/order-actions';
import { getAllUsers } from '@/actions/user-actions';
import { useCurrency } from '@/hooks/useCurrency';
import type { Order, Product, User } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        users: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        async function fetchStats() {
            const [productsData, ordersData, usersData] = await Promise.all([
                getProducts(),
                getAllOrders(),
                getAllUsers(),
            ]);

            const totalRevenue = ordersData.reduce((acc, order) => acc + order.total, 0);

            setStats({
                revenue: totalRevenue,
                orders: ordersData.length,
                products: productsData.length,
                users: usersData.length,
            });
            
            setRecentOrders(ordersData.slice(0, 5));
        }

        fetchStats();
    }, []);


  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatPrice(stats.revenue)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.orders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.products}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.users}</div>
                </CardContent>
            </Card>
        </div>
         <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>A quick look at the most recent orders.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {recentOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id.substring(0, 7).toUpperCase()}</TableCell>
                                <TableCell>{order.user.name}</TableCell>
                                <TableCell>{new Date(order.createdAt as string).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'Paid' ? 'default' : 'secondary'}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
