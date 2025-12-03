"use client";

import SpaceDetails from "../SpaceDetails";

export default function SpaceDetailsPage({ params }) {
  // params.id contains the dynamic route segment
  // e.g., /spaces/123 -> params.id = "123"
  return <SpaceDetails spaceId={params.id} />;
}

