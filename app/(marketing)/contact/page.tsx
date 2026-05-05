import Link from 'next/link';
import { Phone, MapPin, Clock } from 'lucide-react';
import { practiceInfo } from '@/content/practice-info';

export const metadata = {
  title: 'Contact',
  description: `Visit ${practiceInfo.brandName} at ${practiceInfo.address.street}, ${practiceInfo.address.city}, CA. Call ${practiceInfo.phones[1]?.number}.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-stone-100/60 py-24 md:py-32 border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Visit · Call · Find us
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter text-stone-900 leading-[0.95]">
            We're easy to{' '}
            <span className="italic font-light">find.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-3 gap-12">
        {/* Address */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-stone-900">
            <MapPin className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-serif text-2xl">Address</h2>
          </div>
          <address className="not-italic text-stone-700 text-lg leading-relaxed">
            {practiceInfo.address.street}
            <br />
            {practiceInfo.address.city}, {practiceInfo.address.state}{' '}
            {practiceInfo.address.zip}
          </address>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              `${practiceInfo.address.street}, ${practiceInfo.address.city}, ${practiceInfo.address.state}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 hover:underline underline-offset-4"
          >
            Open in Google Maps →
          </a>
        </div>

        {/* Phones */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-stone-900">
            <Phone className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-serif text-2xl">Call us</h2>
          </div>
          <ul className="space-y-3 text-stone-700 text-lg">
            {practiceInfo.phones.map((p) => (
              <li key={p.tel}>
                <p className="text-sm text-stone-500 uppercase tracking-[0.18em]">
                  {p.label}
                </p>
                <a href={`tel:${p.tel}`} className="font-mono tabular-nums text-2xl">
                  {p.number}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-stone-900">
            <Clock className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-serif text-2xl">Hours</h2>
          </div>
          <ul className="text-stone-700 leading-relaxed font-mono tabular-nums">
            {practiceInfo.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4 py-1">
                <span>{h.day}</span>
                <span className="text-stone-500">
                  {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-stone-900 text-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter mb-8">
            Have a question that can wait?
          </h2>
          <p className="text-stone-300 text-lg max-w-xl mx-auto mb-10">
            Send a request and we'll call back the same business day.
          </p>
          <Link
            href="/request-appointment"
            className="inline-flex items-center gap-2 rounded-full bg-stone-50 text-stone-900 px-8 py-4 text-base font-medium hover:bg-stone-200 transition-colors"
          >
            Request appointment
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-20 text-center">
        <h2 className="font-serif text-2xl text-stone-900 mb-4">Accessibility statement</h2>
        <p className="text-stone-600 leading-relaxed">
          {practiceInfo.brandName} is committed to ensuring digital accessibility for
          people with disabilities. We are continually improving the user experience
          and applying the relevant accessibility standards. If you experience any
          difficulty in accessing any part of this website, please call us at{' '}
          <a
            href={`tel:${practiceInfo.phones[1]?.tel}`}
            className="text-stone-900 underline underline-offset-4"
          >
            {practiceInfo.phones[1]?.number}
          </a>{' '}
          and we will be happy to assist you.
        </p>
      </section>
    </>
  );
}
