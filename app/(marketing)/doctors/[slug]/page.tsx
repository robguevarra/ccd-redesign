import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getDoctorBySlug, listDoctors } from '@/lib/supabase/queries';
import { practiceInfo } from '@/content/practice-info';
import { FadeUp } from '@/components/motion/fade-up';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  // generateStaticParams runs at build time without an HTTP request, so we must
  // not call cookies(). Use a cookie-free public client instead.
  //
  // Guard the env + wrap in try/catch: builds without Supabase env (e.g. a
  // preview deployment that hasn't been given the keys) must not crash here.
  // With `dynamicParams = true`, returning [] just means doctor pages render
  // on demand at runtime instead of being prerendered.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const { createClient: createPublicClient } = await import('@supabase/supabase-js');
    const supabase = createPublicClient(url, key);
    const { data } = await supabase.from('doctors').select('slug').eq('active', true);
    return (data ?? []).map((d: { slug: string }) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: doctor.name,
    description: doctor.short,
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const main = practiceInfo.phones[0]!;
  const { portrait } = doctor;

  return (
    <article>
      {/* Cinematic portrait header */}
      <header className="relative h-[80svh] md:h-[100svh] bg-stone-900 text-stone-50 overflow-hidden">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority
          sizes="100vw"
          placeholder={portrait.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={portrait.blurDataURL}
          style={{ objectPosition: portrait.objectPosition ?? 'center' }}
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between px-5 md:px-8 pt-24 md:pt-32 pb-16 md:pb-20">
          <div className="mx-auto max-w-7xl w-full">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-sm text-stone-300 hover:text-stone-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back to team
            </Link>
          </div>
          <FadeUp className="mx-auto max-w-7xl w-full">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-300 mb-6">
              {/* CMS titles already carry "· Lead Clinician" where it applies —
                  appending isLead here printed it twice. */}
              {doctor.title}
            </p>
            <h1 className="font-serif text-[clamp(3.5rem,12vw,11rem)] tracking-tighter text-stone-50 leading-[0.9] font-light">
              {doctor.name.split(' ').slice(0, -1).join(' ')}
              <br />
              <span className="italic">
                {doctor.name.split(' ').slice(-1)[0]}
              </span>
            </h1>
            <p className="mt-10 max-w-2xl text-stone-200 text-lg leading-relaxed">
              {doctor.short}
            </p>
          </FadeUp>
        </div>
      </header>

      {/* Bio body */}
      <FadeUp as="section" className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-32">
        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:leading-[1.75]">
          <ReactMarkdown>{doctor.bio}</ReactMarkdown>
        </div>

        <div className="mt-16 border-t border-stone-200 pt-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-600)] mb-4">
            Specialties
          </p>
          <ul className="flex flex-wrap gap-2">
            {doctor.specialties.map((s) => (
              <li
                key={s}
                className="text-sm text-[var(--color-accent-900)] bg-[var(--color-accent-50)] rounded-full px-3 py-1.5"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/request-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Request to see a provider
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={`tel:${main.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-900 text-stone-900 px-6 py-3 text-sm font-medium hover:bg-stone-900 hover:text-stone-50 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {main.number}
          </a>
        </div>
      </FadeUp>
    </article>
  );
}
