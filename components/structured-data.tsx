import { practiceInfo } from '@/content/practice-info';
import { listDoctors, getOfficeHours } from '@/lib/supabase/queries';
import { SITE_URL as BASE } from '@/lib/site';

/**
 * schema.org `Dentist` JSON-LD for the practice. Rendered on every public page
 * via the marketing layout. Includes location, hours, phones, doctors, and
 * social links — everything Google needs to populate a rich Knowledge Panel
 * and improve Local SEO.
 */
export async function PracticeStructuredData() {
  const [doctors, hours] = await Promise.all([listDoctors(), getOfficeHours()]);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${BASE}/#practice`,
    name: practiceInfo.brandName,
    legalName: practiceInfo.legalName,
    url: BASE,
    telephone: practiceInfo.phones[1]?.tel ?? practiceInfo.phones[0]?.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: practiceInfo.address.street,
      addressLocality: practiceInfo.address.city,
      addressRegion: practiceInfo.address.state,
      postalCode: practiceInfo.address.zip,
      addressCountry: 'US',
    },
    // Exact verified coordinates so Google pins the practice precisely rather
    // than geocoding the address to a neighboring unit in the same building.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: practiceInfo.geo.lat,
      longitude: practiceInfo.geo.lng,
    },
    ...(practiceInfo.googleMapsUrl ? { hasMap: practiceInfo.googleMapsUrl } : {}),
    openingHoursSpecification: hours
      .filter((h) => !h.closed && h.open && h.close)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    sameAs: Object.values(practiceInfo.socials).filter(Boolean),
    employee: doctors.map((d) => ({
      '@type': 'Person',
      name: d.name,
      jobTitle: d.title,
      url: `${BASE}/doctors/${d.slug}`,
    })),
    medicalSpecialty: [
      'Dentistry',
      'Orofacial Pain',
      'Endodontics',
      'Oral and Maxillofacial Surgery',
      'Periodontics',
    ],
    priceRange: '$$',
  };

  return (
    <script
      type="application/ld+json"
      // Inline JSON-LD per Google's recommended schema.org delivery method.
      // Safe because we control the input shape and `JSON.stringify` escapes
      // angle brackets and quotes correctly.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
