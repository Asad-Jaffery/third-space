"use client";

import { use } from "react";
import SpaceDetails from "../SpaceDetails";

export default function SpaceDetailsPage({ params }) {
  // In Next.js 15+, params is a promise and must be unwrapped with use()
  const { id } = use(params);
  // id contains the dynamic route segment
  // e.g., /spaces/123 -> id = "123"
  return <SpaceDetails spaceId={id} />;
}

