"use client";

import { GlobeToMapTransform } from "@/components/globe-to-map-transform";

export function GlobeSection() {
  return (
    <section className="relative py-12 sm:py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="text-foreground text-lg font-medium">Globe To Map Transform</h3>
          <p className="text-muted-foreground text-sm max-w-lg">
            Interactive visualization that smoothly transforms a 3D globe into a 2D equirectangular map.
          </p>
        </div>

        <div className="w-full min-h-[360px] sm:min-h-[540px] lg:min-h-[700px] flex items-center justify-center">
          <GlobeToMapTransform />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <p className="text-muted-foreground text-sm">
            Controls: &ldquo;Unroll Map&rdquo; to transition to map view, &ldquo;Roll to Globe&rdquo; to return, and &ldquo;Reset&rdquo; to clear rotation.
          </p>
        </div>
      </div>
    </section>
  );
}
