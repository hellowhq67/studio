import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GlowUp. All Rights Reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Instagram
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Facebook
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
