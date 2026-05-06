import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'About',
  description: `${practiceInfo.brandName} — a five-doctor practice in ${practiceInfo.address.city}, in continuous service since 1999.`,
};

const TIMELINE = [
  { year: '1999', label: 'The practice opens', body: 'Dr. Brien Hsu begins seeing patients in Rancho Cucamonga.' },
  { year: '2002', label: 'Acquisition', body: 'Took over an established practice in Alta Loma serving the area since 1993.' },
  { year: '2014', label: 'CBCT introduced', body: 'Adopted 3D Cone Beam CT — early among general dental practices.' },
  { year: '2024', label: 'Trios 5 upgrade', body: 'Wireless intra-oral scanning across every operatory.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            About the practice
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            Twenty-five years.{' '}
            <span className="italic font-light">Same office.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            We have been treating families in {practiceInfo.address.city} continuously since 1999.
            Long tenure means we know our patients — and the patients know us.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-28">
        <div className="space-y-8 text-stone-700 text-lg leading-[1.7]">
          <p>
            The practice opened in 1999 with a simple premise: dentistry should be
            something you don't dread, the work should last, and the doctor should
            recognize you when you walk in. Twenty-five years later, that's still
            the brief.
          </p>
          <p>
            Four doctors work alongside Dr. Brien Hsu today — board-certified
            specialists in oral surgery, endodontics, and orofacial pain. We
            invest in technology when it actually improves a clinical outcome
            (3D CBCT in 2014, the Trios scanner in 2024) and we leave the rest
            of the dental industry's gimmicks alone.
          </p>
          <p>
            Outside of the practice, our doctors volunteer with the ADA Give Kids a
            Smile program and free outreach clinics in San Bernardino. A practice
            is more than a service business — it's a community responsibility.
          </p>
        </div>
      </section>

      <section className="bg-stone-100/60 py-20 md:py-28 border-y border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Timeline
          </p>
          <ul className="space-y-12">
            {TIMELINE.map((t) => (
              <li key={t.year} className="grid sm:grid-cols-4 gap-4 border-t border-stone-200 pt-8">
                <div className="font-serif text-3xl md:text-4xl text-stone-900 sm:col-span-1">
                  {t.year}
                </div>
                <div className="sm:col-span-3">
                  <h3 className="font-serif text-xl text-stone-900 mb-2">{t.label}</h3>
                  <p className="text-stone-600 leading-relaxed">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tighter text-stone-900 mb-8">
          Curious to see if we're a fit?
        </h2>
        <Link
          href="/request-appointment"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-stone-50 px-8 py-4 text-base font-medium hover:bg-stone-700 transition-colors"
        >
          Request appointment <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}
