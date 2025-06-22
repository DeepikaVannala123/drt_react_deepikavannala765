export async function fetchSatellitesBySearch(query: string) {
  const attributes = [
    "noradCatId",
    "intlDes",
    "name",
    "launchDate",
    "objectType",
    "orbitCode",
    "countryCode",
  ];

  const response = await fetch(
    `https://backend.digantara.dev/v1/satellites?attributes=${attributes.join(
      ","
    )}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch satellites");
  }

  const result = await response.json();

  const filtered = result.data.filter(
    (item: any) =>
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.noradCatId?.toString().includes(query)
  );

  return filtered;
}
