import { practiceInfo } from '@/content/practice-info';

/**
 * Centralized Google Maps URLs for the practice. Every map link on the site
 * should come from here so they all resolve to the same, correct listing.
 *
 * Why a NAMED destination instead of bare coordinates or a bare address:
 * the office shares its building with other businesses (e.g. The Hair Inn
 * Salon). A coordinate- or address-only link lets Google snap the destination
 * to whichever listing is nearest — often a neighbor. Sending the unique
 * business name + address resolves Google to the Comfort Care Dental listing.
 */

const { googleListingName, address } = practiceInfo;

const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

/** "Comfort Care Dental - Brien Hsu DDS MS, 11458 Kenyon Way, Suite 120, …" */
const NAMED_QUERY = `${googleListingName}, ${fullAddress}`;

/** Driving-directions deep link to the clinic listing. */
export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  NAMED_QUERY,
)}`;

/** "Open/view in Google Maps" — opens the clinic listing. */
export const MAPS_PLACE_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  NAMED_QUERY,
)}`;
