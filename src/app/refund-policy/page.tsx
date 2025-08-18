import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. General Policy</h2>
          <p>We want you to be completely satisfied with your purchase. If you are not satisfied with your product, you may request a refund or exchange within 30 days of the purchase date, subject to the conditions below.</p>

          <h2>2. Conditions for Refund</h2>
          <p>To be eligible for a refund, please make sure that:</p>
          <ul>
            <li>The product was purchased in the last 30 days.</li>
            <li>The product is in its original packaging.</li>
            <li>The product isn't used or damaged.</li>
            <li>You have the receipt or proof of purchase.</li>
          </ul>
          <p>Products that do not meet these criteria will not be considered for a refund.</p>
          
          <h2>3. How to Initiate a Refund</h2>
          <p>To initiate a refund, please contact our customer service team at support@evanieglow.com with your order number and a reason for the return. We will provide you with instructions on how to send back the returned products.</p>

          <h2>4. Shipping Charges</h2>
          <p>Shipping charges incurred in connection with the return of a product are non-refundable. You are responsible for paying the costs of shipping and for the risk of loss of or damage to the product during shipping, both to and from EVANIEGLOW.</p>

          <h2>5. Damaged Items</h2>
          <p>If you received a damaged product, please notify us immediately for assistance. We will work with you to resolve the issue as quickly as possible.</p>
          
          <h2>6. Contact Us</h2>
          <p>If you have any questions about our Refund Policy, please contact us at support@evanieglow.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}