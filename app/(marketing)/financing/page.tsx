import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Financing',
  description: 'CareCredit, in-house payment plans, and the insurance plans we accept.',
};

const PAYMENT_OPTIONS = [
  {
    label: 'CareCredit',
    description:
      'No-interest plans of 6 or 12 months for qualifying patients. Pay the minimum monthly and the balance in full by the end of the term — no interest is charged.',
  },
  {
    label: 'In-house payment plans',
    description:
      "For patients who don't qualify for CareCredit, we offer in-house plans of 3–12 months with no fees and no interest. Tailored to the specific treatment plan.",
  },
  {
    label: 'Major insurance plans',
    description:
      'We accept most major dental PPOs. We are not currently in network with HMOs — we accept patients with HMO coverage on a fee-for-service basis.',
  },
];

export default function FinancingPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Financing
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            We make it{' '}
            <span className="italic font-light">workable.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-stone-600 text-lg leading-relaxed">
            Cost shouldn't be the reason you delay treatment that affects your
            health. We work with most insurance plans, accept CareCredit, and
            offer in-house payment plans for treatment plans of any size.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <ul className="grid gap-px md:grid-cols-3 bg-stone-200">
          {PAYMENT_OPTIONS.map((opt) => (
            <li key={opt.label} className="bg-stone-50 p-8 md:p-10">
              <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">
                {opt.label}
              </h2>
              <p className="text-stone-600 leading-relaxed">{opt.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-stone-900 text-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter mb-8">
            Not sure what your plan covers?
          </h2>
          <p className="text-stone-300 text-lg max-w-xl mx-auto mb-10">
            Tell us your provider when you call and we'll verify benefits before
            your visit — so the cost picture is clear before treatment, not after.
          </p>
          <Link
            href="/request-appointment"
            className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-200 transition-colors"
          >
            Request appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
