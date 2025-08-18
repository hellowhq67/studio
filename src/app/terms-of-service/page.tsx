import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. Agreement to Terms</h2>
          <p>By using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

          <h2>2. Use of Our Service</h2>
          <p>You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service in any way that violates any applicable federal, state, local, or international law or regulation.</p>
          
          <h2>3. Accounts</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>

          <h2>4. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of EVANIEGLOW and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of EVANIEGLOW.</p>

          <h2>5. Limitation of Liability</h2>
          <p>In no event shall EVANIEGLOW, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2>6. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.</p>
          
          <h2>7. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@evanieglow.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}