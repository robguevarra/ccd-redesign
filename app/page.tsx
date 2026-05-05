import { practiceInfo } from '@/content/practice-info';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-6">
        Pitch demo · Phase 4 in progress
      </p>
      <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-stone-900 max-w-3xl">
        {practiceInfo.brandName}
      </h1>
      <p className="mt-6 text-stone-600 max-w-xl text-lg leading-relaxed">
        Considered dentistry in {practiceInfo.address.city} since {1999}.
      </p>
      <a
        href={`tel:${practiceInfo.phones[1]?.tel}`}
        className="mt-12 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-white text-sm font-medium hover:bg-stone-700 transition-colors"
      >
        Call {practiceInfo.phones[1]?.number}
      </a>
    </main>
  );
}
