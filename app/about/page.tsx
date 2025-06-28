import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function AboutPage() {
  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">About Us</h1>
        <p className="text-lg leading-relaxed">
          This platform is a lovingly curated guide to Chicago’s vibrant underground culture—
          from music shows and art exhibitions to alternative venues and neighborhood gems.
          We highlight local voices and independent spaces that make this city come alive.
        </p>
      </div>
    </main>
  );
}
