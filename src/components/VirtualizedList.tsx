import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Satellite {
  name: string;
  noradCatId: string;
  objectType: string;
  orbitCode: string;
  countryCode: string;
  launchDate: string;
}

interface Props {
  data: Satellite[];
}

const VirtualizedList: React.FC<Props> = ({ data }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 10,
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-y-auto border rounded-md shadow"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const satellite = data[virtualRow.index];
          return (
            <div
              key={satellite.noradCatId}
              className="absolute top-0 left-0 right-0 p-4 border-b bg-white"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <p className="font-semibold">{satellite.name}</p>
              <p className="text-sm text-gray-600">
                NORAD ID: {satellite.noradCatId} | {satellite.objectType} |{" "}
                {satellite.orbitCode} | {satellite.countryCode} |{" "}
                {satellite.launchDate ?? "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedList;
