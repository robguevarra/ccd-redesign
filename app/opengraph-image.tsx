import { ImageResponse } from 'next/og';
import { practiceInfo } from '@/content/practice-info';
import { SITE_HOST } from '@/lib/site';

export const alt = `${practiceInfo.brandName} — Considered dentistry in ${practiceInfo.address.city} since 1999`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand tokens mirrored from globals.css. Kept inline (not imported) because
// next/og runs in an isolated edge-y context and avoids the Tailwind layer.
const INK_950 = '#02060f';
const INK_900 = '#050a16';
const STONE_50 = '#faf9f7';
const STONE_300 = '#d6cfc1';
const ACCENT_200 = '#a9c8c5';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          color: STONE_50,
          background: `radial-gradient(ellipse at 15% 100%, rgba(31,44,69,0.55), transparent 55%), linear-gradient(180deg, ${INK_950} 0%, ${INK_900} 100%)`,
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: STONE_300,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {practiceInfo.address.city}, {practiceInfo.address.state} · Since 1999
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              lineHeight: 0.95,
              letterSpacing: -2,
              fontWeight: 300,
              maxWidth: 900,
            }}
          >
            {practiceInfo.brandName}
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.25,
              letterSpacing: -0.4,
              color: STONE_300,
              fontStyle: 'italic',
              fontWeight: 300,
              maxWidth: 980,
            }}
          >
            A hybrid medical &amp; dental practice. TMJ, sleep apnea, orofacial
            pain — managed under one roof.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: STONE_300,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: ACCENT_200,
              }}
            />
            <span>{SITE_HOST}</span>
          </div>
          <div>Five doctors · One roof</div>
        </div>
      </div>
    ),
    size,
  );
}
