'use client';

/**
 * "Find Us" map — a real, interactive street map (Leaflet) with a pre-baked,
 * self-drawing driving route from Milliken & Kenyon to the office, plus a
 * looping arrow and wayfinding landmark labels.
 *
 * Why Leaflet instead of a Google embed: Google's free embed is a sealed
 * iframe we can't draw on. Leaflet lets us layer the animated route and
 * landmarks, and needs no API key/billing.
 *
 * Leaflet is bundled (npm), not loaded from a CDN. The route is pre-computed
 * and hard-coded (BAKED_ROUTE) so the page never depends on a live router or
 * geocoder at runtime — only the basemap tiles are fetched (CARTO). All
 * markers use divIcons/circleMarkers, so there are no Leaflet image assets to
 * resolve.
 */

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MAPS_DIRECTIONS_URL } from '@/lib/maps';

type LL = [number, number];

// Exact office coordinates — verified against the practice's Google Maps
// share link (maps.app.goo.gl/UJueZeNFVnqNMyRw8) and Plus Code 4CMV+MJ, both
// of which resolve to this point. Used for the map pin and route endpoint.
const DEST: LL = [34.1341994, -117.5559279];
// Milliken Ave & Kenyon Way (34°08'03.4"N 117°33'30.3"W).
const START: LL = [34.1342778, -117.5584167];

// Pre-baked OSRM driving route (start → office). Hard-coded so we never call a
// live router; regenerate by querying OSRM if the route ever changes.
const BAKED_ROUTE: LL[] = [
  [34.134315, -117.558418],
  [34.134316, -117.558351],
  [34.134316, -117.558327],
  [34.134323, -117.557827],
  [34.134308, -117.557456],
  [34.134275, -117.557098],
  [34.134214, -117.556773],
  [34.134688, -117.556641],
  [34.134686, -117.556368],
  [34.134686, -117.556294],
  [34.134667, -117.556157],
  [34.134662, -117.556127],
  [34.134619, -117.555965],
  [34.134302, -117.556149],
];

// Quadratic Bézier sampler — used to draw a soft curve from the driving
// route's end to the office door.
function quadBezier(a: LL, ctrl: LL, b: LL, steps: number): LL[] {
  const pts: LL[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([
      u * u * a[0] + 2 * u * t * ctrl[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * ctrl[1] + t * t * b[1],
    ]);
  }
  return pts;
}

// Continue the red line from the driving route's end to the entrance, so it
// leads to the door instead of stopping in the lot. The control point pulls
// the curve gently toward Kenyon Way for a soft bend.
const DOOR_APPROACH: LL[] = quadBezier(
  BAKED_ROUTE[BAKED_ROUTE.length - 1]!,
  [34.13421, -117.55604],
  DEST,
  6,
);
const ROUTE_PATH: LL[] = [...BAKED_ROUTE, ...DOOR_APPROACH];

// Wayfinding landmark labels — both businesses share the clinic's building.
// Positions estimated from the practice's annotated satellite image: the music
// academy at the building's north end (≈ due north of the clinic pin), the
// salon on the west/parking-lot side (north-west of the pin).
const LANDMARKS: { name: string; ll: LL }[] = [
  // Both inside the shared building: Applause sits just inside the building's
  // west (left) edge, a little north of the Hair Inn; the salon is mid-front.
  { name: 'Applause Music Academy', ll: [34.134338, -117.555958] },
  { name: 'The Hair Inn Salon', ll: [34.134285, -117.556015] },
];

const TEAL = '#346a66';
const ROUTE = '#d9573f';

const CSS = `
.ccd-findus{
  --ink:#2b3a39; --muted:#6e7c7a; --teal:#346a66; --teal-dk:#28524f; --sand:#bfae9a;
  --route:#d9573f; --card:#ffffff; --border:#e7decf; --shadow:0 10px 30px rgba(40,82,79,.12);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  color:var(--ink); max-width:820px; margin:0 auto; background:var(--card);
  border:1px solid var(--border); border-radius:18px; box-shadow:var(--shadow); overflow:hidden;
}
.ccd-findus *{box-sizing:border-box;}
.ccd-findus .ccd-head{padding:22px 24px 14px;}
.ccd-findus .ccd-head h2{margin:0;font-size:20px;letter-spacing:.2px;color:var(--teal-dk);}
.ccd-findus .ccd-head h2 .ccd-h2-sub{font-weight:400;color:var(--muted);white-space:nowrap;}
.ccd-findus .ccd-head p{margin:6px 0 0;font-size:14px;color:var(--muted);line-height:1.45;}
.ccd-findus .ccd-mapwrap{position:relative;margin:0 14px;border-radius:12px;overflow:hidden;border:1px solid var(--border);}
.ccd-findus .ccd-map{height:clamp(320px,56vw,460px);width:100%;background:#eef1f0;z-index:0;}
.ccd-findus .ccd-note{position:absolute;left:12px;bottom:12px;z-index:500;background:var(--teal);color:#fff;
  font-size:12.5px;font-weight:700;padding:7px 12px;border-radius:9px;box-shadow:var(--shadow);max-width:72%;line-height:1.3;pointer-events:none;}
.ccd-findus .ccd-pin{filter:drop-shadow(0 3px 4px rgba(0,0,0,.28));animation:ccdDrop .5s cubic-bezier(.22,1.3,.4,1) both;}
@keyframes ccdDrop{0%{transform:translateY(-22px);opacity:0;}100%{transform:translateY(0);opacity:1;}}
.ccd-findus .ccd-start{width:16px;height:16px;border-radius:50%;background:#fff;border:5px solid var(--route);box-shadow:0 1px 3px rgba(0,0,0,.45);}
.ccd-findus .ccd-arrow{width:26px;height:26px;display:flex;align-items:center;justify-content:center;transition:transform .05s linear;}
.leaflet-tooltip.ccd-lm{background:rgba(255,255,255,.94);border:1px solid #e7decf;border-radius:7px;
  box-shadow:0 1px 4px rgba(0,0,0,.12);color:#2b3a39;font:600 11.5px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:4px 7px;white-space:nowrap;}
.leaflet-tooltip.ccd-lm:before{display:none;}
.leaflet-tooltip.ccd-clinic{background:#346a66;border:0;border-radius:8px;
  box-shadow:0 2px 10px rgba(40,82,79,.4);color:#fff;padding:7px 12px;white-space:nowrap;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.25;}
.leaflet-tooltip.ccd-clinic .ccd-clinic-name,
.leaflet-tooltip.ccd-clinic .ccd-clinic-sub{display:block;font-weight:700;font-size:12.5px;letter-spacing:.2px;}
.leaflet-tooltip.ccd-clinic:before{display:none;}
.ccd-findus .ccd-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px 24px 20px;}
.ccd-findus .ccd-step{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.4;color:var(--ink);}
.ccd-findus .ccd-num{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:var(--sand);color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;}
.ccd-findus .ccd-step.is-end .ccd-num{background:var(--teal);}
.ccd-findus .ccd-foot{border-top:1px solid var(--border);padding:14px 24px;display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;justify-content:space-between;font-size:13px;color:var(--muted);}
.ccd-findus .ccd-foot strong{color:var(--ink);}
.ccd-findus .ccd-btn{display:inline-block;background:var(--teal);color:#fff;text-decoration:none;padding:9px 16px;border-radius:10px;font-weight:600;font-size:13px;white-space:nowrap;}
.ccd-findus .ccd-btn:hover{background:var(--teal-dk);}
.leaflet-popup-content{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:13px;color:#2b3a39;}
@media (max-width:560px){.ccd-findus .ccd-steps{grid-template-columns:1fr;gap:8px;}.ccd-findus .ccd-head h2{font-size:18px;}}
`;

function bearing(a: LL, b: LL): number {
  const toR = Math.PI / 180,
    toD = 180 / Math.PI;
  const y = Math.sin((b[1] - a[1]) * toR) * Math.cos(b[0] * toR);
  const x =
    Math.cos(a[0] * toR) * Math.sin(b[0] * toR) -
    Math.sin(a[0] * toR) * Math.cos(b[0] * toR) * Math.cos((b[1] - a[1]) * toR);
  return (Math.atan2(y, x) * toD + 360) % 360;
}

export function FindUsMap() {
  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapEl.current;
    if (!el) return;

    let cancelled = false;
    let cleanup: () => void = () => {};

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapEl.current) return;

      const reduce = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      const map = L.map(el, { scrollWheelZoom: false }).setView(DEST, 17);
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      ).addTo(map);

      const pinIcon = (color: string) => {
        const s = 42,
          h = 54;
        return L.divIcon({
          className: '',
          iconSize: [s, h],
          iconAnchor: [s / 2, h - 1],
          popupAnchor: [0, -h + 10],
          html:
            '<div class="ccd-pin"><svg width="' +
            s +
            '" height="' +
            h +
            '" viewBox="0 0 24 30"><path d="M12 29C12 29 2 16 2 9A10 10 0 1 1 22 9C22 16 12 29 12 29Z" fill="' +
            color +
            '" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="9.3" r="4" fill="#fff"/></svg></div>',
        });
      };
      const dotIcon = () =>
        L.divIcon({
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          html: '<div class="ccd-start"></div>',
        });
      const arrowIcon = () =>
        L.divIcon({
          className: '',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          html:
            '<div class="ccd-arrow"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2 L20 21 L12 16 L4 21 Z" fill="' +
            ROUTE +
            '" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></div>',
        });

      const path = ROUTE_PATH;
      let drawer: ReturnType<typeof setInterval> | null = null;
      let raf: number | null = null;

      // start dot
      L.marker(START, { icon: dotIcon() })
        .addTo(map)
        .bindTooltip('Start here', { direction: 'top', offset: [0, -8] });

      // white casing under the route
      L.polyline(path, {
        color: '#ffffff',
        weight: 10,
        opacity: 0.95,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map);

      const route = L.polyline([], {
        color: ROUTE,
        weight: 6,
        opacity: 0.95,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map);
      // Asymmetric padding: the destination sits at the east end and its
      // labels extend to the right, so reserve extra room on that side.
      map.fitBounds(L.latLngBounds(path).extend(DEST), {
        paddingTopLeft: [24, 28],
        paddingBottomRight: [185, 34],
      });

      const dropPin = () => {
        L.marker(DEST, { icon: pinIcon(TEAL) })
          .addTo(map)
          // Prominent, always-visible clinic label (bolder than the landmark
          // chips). The popup stays available on click for the full detail.
          .bindTooltip(
            '<span class="ccd-clinic-name">Comfort Care Dental</span>' +
              '<span class="ccd-clinic-sub">Brien Hsu, DDS, MS &amp; Associates</span>',
            {
              permanent: true,
              direction: 'right',
              offset: [10, 0],
              className: 'ccd-clinic',
            },
          )
          .bindPopup(
            '<strong>Comfort Care Dental</strong><br>Brien Hsu, DDS, MS &amp; Associates<br><span style="color:#6e7c7a">Entrance faces Kenyon Way</span>',
          );
      };

      // looping arrow that travels the route at constant speed
      const flow = () => {
        const cum = [0];
        let total = 0;
        for (let k = 1; k < path.length; k++) {
          total += L.latLng(path[k - 1]!).distanceTo(L.latLng(path[k]!));
          cum.push(total);
        }
        if (total === 0) return;

        const first = path[0]!;
        const last = path[path.length - 1]!;

        const mover = L.marker(first, {
          icon: arrowIcon(),
          interactive: false,
          keyboard: false,
          zIndexOffset: 1000,
        }).addTo(map);
        const DURATION = 6500;
        let t0: number | null = null;

        const pointAt = (d: number): { pos: LL; brg: number } => {
          if (d <= 0) return { pos: first, brg: bearing(first, path[1] || first) };
          if (d >= total)
            return {
              pos: last,
              brg: bearing(path[path.length - 2] || first, last),
            };
          let lo = 0,
            hi = cum.length - 1;
          while (lo < hi - 1) {
            const mid = (lo + hi) >> 1;
            if (cum[mid]! <= d) lo = mid;
            else hi = mid;
          }
          const seg = cum[hi]! - cum[lo]!,
            f = seg ? (d - cum[lo]!) / seg : 0;
          const a = path[lo]!,
            b = path[hi]!;
          return {
            pos: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f],
            brg: bearing(a, b),
          };
        };

        const frame = (ts: number) => {
          if (t0 === null) t0 = ts;
          const f = ((ts - t0) % DURATION) / DURATION;
          const p = pointAt(f * total);
          mover.setLatLng(p.pos);
          const elm = mover.getElement();
          if (elm) {
            const a = elm.querySelector<HTMLElement>('.ccd-arrow');
            if (a) a.style.transform = 'rotate(' + p.brg + 'deg)';
          }
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      };

      if (reduce) {
        // No motion: show the full route + pin immediately.
        route.setLatLngs(path);
        dropPin();
      } else {
        let i = 0;
        const stepN = Math.max(1, Math.floor(path.length / 110));
        drawer = setInterval(() => {
          i += stepN;
          route.setLatLngs(path.slice(0, Math.min(i, path.length)));
          if (i >= path.length) {
            if (drawer) clearInterval(drawer);
            drawer = null;
            dropPin();
            flow();
          }
        }, 16);
      }

      // landmark labels
      LANDMARKS.forEach((m) => {
        L.circleMarker(m.ll, {
          radius: 5,
          color: '#fff',
          weight: 2,
          fillColor: TEAL,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip(m.name, {
            permanent: true,
            direction: 'right',
            offset: [6, 0],
            className: 'ccd-lm',
          });
      });

      // click-to-zoom (don't hijack page scroll)
      map.on('focus', () => map.scrollWheelZoom.enable());
      map.on('blur', () => map.scrollWheelZoom.disable());

      cleanup = () => {
        if (drawer) clearInterval(drawer);
        if (raf) cancelAnimationFrame(raf);
        map.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="ccd-findus">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ccd-head">
        <h2>
          Find Comfort Care Dental{' '}
          <span className="ccd-h2-sub">| Brien Hsu, DDS, MS &amp; Associates</span>
        </h2>
        <p>
          From <strong>Milliken Ave &amp; Kenyon Way</strong>, head east on
          Kenyon Way into the Vineyards Marketplace lot. We&rsquo;re in the
          corner by <strong>Woodruff Pl</strong>{' '}&mdash; our entrance faces
          Kenyon Way.
        </p>
      </div>

      <div className="ccd-mapwrap">
        <div className="ccd-map" ref={mapEl} />
        <div className="ccd-note">
          Entrance faces Kenyon Way &mdash; around the corner from the lot
        </div>
      </div>

      <div className="ccd-steps">
        <div className="ccd-step">
          <span className="ccd-num">1</span>
          <span>
            At <strong>Milliken Ave &amp; Kenyon Way</strong>, head{' '}
            <strong>east</strong> on Kenyon Way.
          </span>
        </div>
        <div className="ccd-step">
          <span className="ccd-num">2</span>
          <span>
            Turn into the <strong>Vineyards Marketplace lot</strong>{' '}(past
            Johnny O&rsquo;s) and drive to the far right side.
          </span>
        </div>
        <div className="ccd-step is-end">
          <span className="ccd-num">3</span>
          <span>
            We&rsquo;re in the <strong>corner by Woodruff Pl</strong>. The
            entrance faces <strong>Kenyon Way</strong>.
          </span>
        </div>
      </div>

      <div className="ccd-foot">
        <span>
          <strong>Comfort Care Dental &mdash; Brien Hsu DDS MS</strong>
          <br />
          11458 Kenyon Way #120, Rancho Cucamonga, CA 91701
        </span>
        <a
          className="ccd-btn"
          href={MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions &rarr;
        </a>
      </div>
    </div>
  );
}
