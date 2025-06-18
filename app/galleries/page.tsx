import { getGalleries } from '../utils';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
export const dynamic = 'force-dynamic';

function stripThe(name: string): string {
  return name.toLowerCase().startsWith('the ') ? name.slice(4) : name;
}

export default async function Page() {
  const galleries = await getGalleries();

  const sortedGalleries = [...galleries].sort((a, b) =>
    stripThe(a.name).localeCompare(stripThe(b.name))
  );

  return (
    <main className={`min-h-screen bg-[#F9F6F8] px-6 py-10 text-[#1F1F1F] ${dmSans.className}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Galleries</h1>
        <ul className="space-y-4">
          {sortedGalleries.map((gallery, index) => (
            <li key={index}>
              <Link
                href={`/galleries/${gallery.slug}`}
                className="text-lg underline hover:text-black"
              >
                {gallery.name}
              </Link>
              <p className="text-sm text-gray-600">{gallery.hood}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
