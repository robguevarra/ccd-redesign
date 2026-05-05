import { practiceInfo } from '@/content/practice-info';
import { AppointmentForm } from './appointment-form';

export const metadata = {
  title: 'Request Appointment',
  description: `Send an appointment request to ${practiceInfo.brandName}. We'll call back the same business day.`,
};

export default function RequestAppointmentPage() {
  const main = practiceInfo.phones[1] ?? practiceInfo.phones[0]!;

  return (
    <>
      <section className="bg-stone-100/60 py-20 md:py-28 border-b border-stone-200">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-6">
            Request an appointment
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter text-stone-900 leading-[0.95]">
            Tell us a little. We'll call back.
          </h1>
          <p className="mt-8 max-w-xl text-stone-600 text-lg leading-relaxed">
            Or, if it's faster, just dial{' '}
            <a
              href={`tel:${main.tel}`}
              className="font-mono tabular-nums text-stone-900 underline underline-offset-4"
            >
              {main.number}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-20">
        <AppointmentForm />
      </section>
    </>
  );
}
