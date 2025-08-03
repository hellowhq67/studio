import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, File } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

const mockOrders = [
  { id: 'ORD001', customer: 'Liam Johnson', email: 'liam@example.com', date: '2023-06-23', status: 'Fulfilled', total: '$250.00' },
  { id: 'ORD002', customer: 'Olivia Smith', email: 'olivia@example.com', date: '2023-06-24', status: 'Fulfilled', total: '$150.00' },
  { id: 'ORD003', customer: 'Noah Williams', email: 'noah@example.com', date: '2023-06-25', status: 'Unfulfilled', total: '$350.00' },
  { id: 'ORD004', customer: 'Emma Brown', email: 'emma@example.com', date: '2023-06-26', status: 'Fulfilled', total: '$450.00' },
  { id: 'ORD005', customer: 'Ava Jones', email: 'ava@example.com', date: '2023-06-27', status: 'Unfulfilled', total: '$550.00' },
];

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
         <div className="flex justify-between items-center">
            <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Recent orders from your store.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="gap-1">
                <File className="h-4 w-4" />
                <span>Export</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">{order.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={order.status === 'Fulfilled' ? 'default' : 'secondary'}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Order</DropdownMenuItem>
                      <DropdownMenuItem>View Customer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
