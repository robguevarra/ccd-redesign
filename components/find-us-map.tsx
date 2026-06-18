/**
 * "Find Us" wayfinding map — a self-contained, practice-supplied SVG + HTML
 * block (parking lot, landmarks, walking path to the corner entrance, and
 * step-by-step directions). Scoped under `.ccd-findus` so its styles don't
 * leak. Rendered via dangerouslySetInnerHTML because the markup is static,
 * trusted, hand-authored art — converting the dense SVG to JSX would only risk
 * transcription errors. No third-party calls; the "Get directions" link deep-
 * links to Google Maps.
 */

const FIND_US_MAP_HTML = `
<div class="ccd-findus">
  <style>
    .ccd-findus{
      --ink:#2b3a39;
      --muted:#6e7c7a;
      --teal:#346a66;
      --teal-dk:#28524f;
      --sand:#bfae9a;
      --sand-dk:#a08d75;
      --lot:#e8f1f0;
      --lot-line:#c4d6d4;
      --road:#faf3e7;
      --road-text:#a8965f;
      --card:#ffffff;
      --border:#e7decf;
      --shadow:0 10px 30px rgba(40,82,79,.12);
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      color:var(--ink);
      max-width:780px;margin:0 auto;background:var(--card);
      border:1px solid var(--border);border-radius:18px;box-shadow:var(--shadow);overflow:hidden;
    }
    .ccd-findus *{box-sizing:border-box;}
    .ccd-head{padding:22px 24px 6px;}
    .ccd-head h2{margin:0;font-size:20px;letter-spacing:.2px;color:var(--teal-dk);}
    .ccd-head p{margin:6px 0 0;font-size:14px;color:var(--muted);line-height:1.45;}
    .ccd-map{display:block;width:100%;height:auto;padding:8px 14px 0;}
    .ccd-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px 24px 22px;}
    .ccd-step{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.4;color:var(--ink);}
    .ccd-num{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:var(--sand);color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;}
    .ccd-step.is-entrance .ccd-num{background:var(--teal);}
    .ccd-foot{border-top:1px solid var(--border);padding:14px 24px;display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;justify-content:space-between;font-size:13px;color:var(--muted);}
    .ccd-foot strong{color:var(--ink);}
    .ccd-btn{display:inline-block;background:var(--teal);color:#fff;text-decoration:none;padding:9px 16px;border-radius:10px;font-weight:600;font-size:13px;white-space:nowrap;}
    .ccd-btn:hover{background:var(--teal-dk);}
    @media (max-width:560px){.ccd-steps{grid-template-columns:1fr;gap:8px;}.ccd-head h2{font-size:18px;}}
  </style>

  <div class="ccd-head">
    <h2>How to find Comfort Care Dental</h2>
    <p>Our entrance is on the <strong>corner facing Kenyon Way</strong> &mdash; around the side from where you park. Park near <strong>The Hair Inn Salon</strong> and <strong>Applause Music Academy</strong> (both on the left/lot side), then walk around to the corner door.</p>
  </div>

  <svg class="ccd-map" viewBox="0 0 900 700" role="img"
       aria-label="Simplified map: park in the lot near The Hair Inn Salon and Applause Music Academy, then walk around to the Comfort Care Dental entrance on the corner facing Kenyon Way.">

    <rect x="0" y="0" width="900" height="700" fill="#ffffff"/>

    <rect x="0" y="612" width="820" height="74" fill="var(--road)"/>
    <line x1="0" y1="649" x2="820" y2="649" stroke="#ffffff" stroke-width="3" stroke-dasharray="22 18"/>
    <text x="40" y="675" font-size="17" font-weight="700" fill="var(--road-text)" letter-spacing=".5">KENYON WAY</text>

    <rect x="812" y="0" width="88" height="686" fill="var(--road)"/>
    <line x1="856" y1="0" x2="856" y2="612" stroke="#ffffff" stroke-width="3" stroke-dasharray="22 18"/>
    <text x="858" y="300" font-size="16" font-weight="700" fill="var(--road-text)" letter-spacing=".5"
          transform="rotate(90 858 300)">WOODRUFF PL</text>

    <rect x="34" y="40" width="690" height="560" rx="10" fill="var(--lot)" stroke="var(--lot-line)" stroke-width="2"/>
    <g stroke="var(--lot-line)" stroke-width="2">
      <line x1="80" y1="90" x2="80" y2="150"/><line x1="120" y1="90" x2="120" y2="150"/><line x1="160" y1="90" x2="160" y2="150"/><line x1="200" y1="90" x2="200" y2="150"/><line x1="240" y1="90" x2="240" y2="150"/><line x1="280" y1="90" x2="280" y2="150"/><line x1="320" y1="90" x2="320" y2="150"/><line x1="360" y1="90" x2="360" y2="150"/><line x1="400" y1="90" x2="400" y2="150"/><line x1="440" y1="90" x2="440" y2="150"/><line x1="480" y1="90" x2="480" y2="150"/><line x1="520" y1="90" x2="520" y2="150"/><line x1="560" y1="90" x2="560" y2="150"/><line x1="600" y1="90" x2="600" y2="150"/><line x1="640" y1="90" x2="640" y2="150"/><line x1="680" y1="90" x2="680" y2="150"/><line x1="60" y1="150" x2="700" y2="150"/>
      <line x1="80" y1="250" x2="80" y2="320"/><line x1="120" y1="250" x2="120" y2="320"/><line x1="160" y1="250" x2="160" y2="320"/><line x1="200" y1="250" x2="200" y2="320"/><line x1="60" y1="285" x2="220" y2="285"/>
    </g>
    <text x="120" y="210" font-size="16" font-weight="600" fill="#8aa3a0">Shopping-center parking</text>

    <path d="M470 250 H770 V560 H510 L470 520 V250 Z"
          fill="var(--sand)" stroke="var(--sand-dk)" stroke-width="3" stroke-linejoin="round"/>

    <g>
      <rect x="214" y="392" width="244" height="34" rx="8" fill="#fff" stroke="var(--border)" stroke-width="1.5"/>
      <text x="230" y="414" font-size="13.5" font-weight="600" fill="var(--ink)">Applause Music Academy</text>
      <line x1="458" y1="409" x2="470" y2="409" stroke="var(--teal)" stroke-width="2.5"/>
      <circle cx="470" cy="409" r="8" fill="#fff" stroke="var(--teal)" stroke-width="3"/>
      <circle cx="470" cy="409" r="3" fill="var(--teal)"/>
    </g>
    <g>
      <rect x="214" y="452" width="244" height="34" rx="8" fill="#fff" stroke="var(--border)" stroke-width="1.5"/>
      <text x="230" y="474" font-size="13.5" font-weight="600" fill="var(--ink)">The Hair Inn Salon</text>
      <line x1="458" y1="469" x2="470" y2="469" stroke="var(--teal)" stroke-width="2.5"/>
      <circle cx="470" cy="469" r="8" fill="#fff" stroke="var(--teal)" stroke-width="3"/>
      <circle cx="470" cy="469" r="3" fill="var(--teal)"/>
    </g>

    <g>
      <rect x="250" y="300" width="150" height="40" rx="20" fill="var(--sand)"/>
      <text x="325" y="325" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">P &nbsp;Park here</text>
    </g>

    <path d="M325 342 C 316 430, 360 505, 452 540"
          fill="none" stroke="var(--teal)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="2 14"/>
    <path d="M436 522 L462 544 L432 550 Z" fill="var(--teal)"/>
    <text x="360" y="470" font-size="13" font-weight="700" fill="var(--teal-dk)" transform="rotate(57 360 470)">walk this way</text>

    <line x1="500" y1="552" x2="478" y2="530" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    <g>
      <path d="M468 552 C 468 552, 442 514, 442 500 a 26 26 0 1 1 52 0 C 494 514, 468 552, 468 552 Z"
            fill="var(--teal)" stroke="#fff" stroke-width="3"/>
      <circle cx="468" cy="500" r="16" fill="#fff"/>
      <path d="M468 491c-6 0-10 4-10 9 0 4 2 7 3 11 1 2 2 3 3 3s1-2 1-4c0-3 1-5 3-5s3 2 3 5c0 2 0 4 1 4s2-1 3-3c1-4 3-7 3-11 0-5-4-9-10-9z" fill="var(--teal)"/>
    </g>
    <g>
      <line x1="430" y1="566" x2="452" y2="540" stroke="var(--teal)" stroke-width="2.5"/>
      <rect x="120" y="540" width="312" height="58" rx="10" fill="var(--teal)"/>
      <text x="276" y="565" text-anchor="middle" font-size="14.5" font-weight="800" fill="#fff">OUR ENTRANCE</text>
      <text x="276" y="584" text-anchor="middle" font-size="12.5" font-weight="600" fill="#fff">on the corner, facing Kenyon Way</text>
    </g>

    <g transform="translate(160,90)">
      <circle r="26" fill="#fff" stroke="var(--border)" stroke-width="2"/>
      <path d="M0 -18 L8 8 L0 2 L-8 8 Z" fill="var(--ink)"/>
      <text x="0" y="22" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">N</text>
    </g>
  </svg>

  <div class="ccd-steps">
    <div class="ccd-step">
      <span class="ccd-num">1</span>
      <span>Pull into the <strong>shopping-center lot</strong> off Kenyon Way and park toward the back-right building.</span>
    </div>
    <div class="ccd-step">
      <span class="ccd-num">2</span>
      <span>On the lot side you&rsquo;ll see <strong>Applause Music Academy</strong> and <strong>The Hair Inn Salon</strong> &mdash; head toward them.</span>
    </div>
    <div class="ccd-step is-entrance">
      <span class="ccd-num">3</span>
      <span>Walk to the <strong>corner</strong> of the building. Our entrance faces <strong>Kenyon Way</strong>.</span>
    </div>
  </div>

  <div class="ccd-foot">
    <span><strong>Comfort Care Dental &mdash; Brien Hsu DDS MS</strong><br>11458 Kenyon Way #120, Rancho Cucamonga, CA 91701</span>
    <a class="ccd-btn" href="https://www.google.com/maps/dir/?api=1&destination=11458+Kenyon+Way+%23120,+Rancho+Cucamonga,+CA+91701" target="_blank" rel="noopener">Get directions &rarr;</a>
  </div>
</div>
`;

export function FindUsMap() {
  return <div dangerouslySetInnerHTML={{ __html: FIND_US_MAP_HTML }} />;
}
