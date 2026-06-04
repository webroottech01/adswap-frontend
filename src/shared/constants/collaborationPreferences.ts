/** Shared with business onboarding Step 5 and cross-promotion targeting. */
export const LOCATION_RADIUS_OPTIONS = [
  'Same locality',
  '5 km',
  '10 km',
  '25 km',
  '50 km',
  'City-wide',
  'State-wide',
  'Pan India',
] as const;

export type LocationRadiusOption = (typeof LOCATION_RADIUS_OPTIONS)[number];
