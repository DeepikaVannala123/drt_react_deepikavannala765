const isDev = import.meta.env.DEV;

const API_BASE_URL = isDev
  ? '/api/v1' // local proxy path
  : 'https://backend.digantara.dev/v1'; // real API in prod


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
  `${API_BASE_URL}/satellites?attributes=${attributes.join(",")}`
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
