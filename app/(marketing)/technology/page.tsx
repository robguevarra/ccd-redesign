import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Technology',
  description: `${practiceInfo.brandName} invests early in dental technology that improves clinical outcomes — 3D Cone Beam CT, 3Shape Trios scanner, and surgical-grade microscopy.`,
};

const TECHNOLOGIES = [
  {
    name: 'iCAT FLX 3D Cone Beam CT',
    since: 2014,
    summary:
      'Volumetric imaging of teeth, bone, and soft tissue in three dimensions.',
    body: 'A traditional dental X-ray captures one slice. A CBCT captures the whole jaw, in 3D, in seconds — letting us plan implants without surprises, see cracked teeth that 2D X-rays miss, evaluate the TM joint accurately, and avoid nerves during extractions. We invested in 2014 when most general practices still considered this a specialist tool.',
  },
  {
    name: '3Shape Trios 5 intra-oral scanner',
    since: 2024,
    summary:
      'Digital impressions instead of traditional impression trays.',
    body: 'A handheld wand replaces the goop-and-tray impression most patients dread. The scan is more accurate, the lab turnaround is faster, and we can evaluate the result on a screen with you immediately. Upgraded to the Trios 5 in 2024 with wireless connectivity across every operatory.',
  },
  {
    name: 'Zeiss Dental Microscope',
    since: 2010,
    summary:
      'Surgical-grade magnification for restorative and endodontic work.',
    body: "Many cracks, decay margins, and canal anatomy are simply invisible at the magnification levels of standard loupes. Working under a Zeiss microscope is the difference between a 5-year filling and a 15-year one — and the difference between a successful root canal and one that needs to be redone.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Technology
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            We invested early so you'd <em className="font-light">save the tooth.</em>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            We don't buy technology to put it on a brochure. We buy it when it
            changes a clinical outcome. Below is what's actually in our office,
            why we have it, and what it means for you.
          </p>
        </div>
      </section>

      {TECHNOLOGIES.map((t, idx) => (
        <section
          key={t.name}
          className="border-b border-stone-200 last:border-b-0"
        >
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-3 gap-10 md:gap-16">
            <div className="md:col-span-1">
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">
                {String(idx + 1).padStart(2, '0')} · Since {t.since}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tighter text-stone-900 mb-4">
                {t.name}
              </h2>
              <p className="text-stone-700 italic leading-relaxed">{t.summary}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-stone-700 text-lg leading-[1.7]">{t.body}</p>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-stone-900 text-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter mb-8">
            See what a CBCT scan can show you.
          </h2>
          <p className="text-stone-300 max-w-xl mx-auto mb-10">
            We routinely include CBCT imaging in evaluations for implants, TMJ,
            wisdom teeth, and complex restorative work. Most patients have never
            seen one before.
          </p>
          <Link
            href="/request-appointment"
            className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-200 transition-colors"
          >
            Schedule a consult <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
