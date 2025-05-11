export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#F9F6F8] text-[#1F1F1F]">
      <h1 className="text-3xl font-semibold mb-4">Welcome to the Bulletin</h1>
      <p className="mb-6 text-sm text-gray-600">Discover local events around Chicago</p>
      <a
        href="/events"
        className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
      >
        View Events
      </a>
    </main>
  );
}