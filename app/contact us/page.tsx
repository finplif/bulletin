import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function ContactPage() {
  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Contact Us</h1>
        <p className="mb-6 text-lg leading-relaxed">
          if you’d like to submit an event, collaborate, or just say hi — please fill out the form below.
        </p>
        <a
          href="https://docs.google.com/forms/d/your-form-id-here"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4B6E47] underline text-lg font-medium"
        >
          open contact form ↗
        </a>
      </div>
    </main>
  );
}
