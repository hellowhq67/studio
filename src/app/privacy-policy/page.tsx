import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. Introduction</h2>
          <p>Welcome to GlowUp. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

          <h2>2. Information We Collect</h2>
          <p>We may collect personal information from you such as your name, shipping address, email address, and payment information when you place an order. We also collect information automatically as you navigate the site, such as your IP address and browsing history.</p>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and manage your orders and payments.</li>
            <li>Communicate with you about your account or orders.</li>
            <li>Improve our website and services.</li>
            <li>Personalize your user experience.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2>4. Sharing Your Information</h2>
          <p>We do not sell or trade your personal information to third parties. We may share information with service providers who perform services for us, such as payment processors and shipping companies, but only to the extent necessary to provide you with our services.</p>

          <h2>5. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

          <h2>6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at support@glowup.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
