import * as topojson from "topojson-client";
import * as d3 from "d3-geo";
// @ts-ignore
import countriesData from "world-atlas/countries-110m.json";

export type CityNode = {
  id: string;
  name: string;
  region: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
  latency: number;
  status: "up" | "slow" | "down";
  incidentsCount: number;
};

export const PROBE_CITIES: CityNode[] = [
  { id: "us-east", name: "Ashburn (US-East)", region: "North America", code: "US", coordinates: [-77.4875, 39.0438], latency: 45, status: "up", incidentsCount: 0 },
  { id: "us-west", name: "Silicon Valley (US-West)", region: "North America", code: "US", coordinates: [-121.8863, 37.3382], latency: 62, status: "up", incidentsCount: 0 },
  { id: "eu-central", name: "Frankfurt", region: "Europe", code: "DE", coordinates: [8.6821, 50.1109], latency: 38, status: "up", incidentsCount: 0 },
  { id: "eu-west", name: "London", region: "Europe", code: "GB", coordinates: [-0.1278, 51.5074], latency: 41, status: "up", incidentsCount: 0 },
  { id: "in-south", name: "Mumbai", region: "Asia-Pacific", code: "IN", coordinates: [72.8777, 19.076], latency: 18, status: "up", incidentsCount: 0 },
  { id: "in-north", name: "Delhi NCR", region: "Asia-Pacific", code: "IN", coordinates: [77.1025, 28.7041], latency: 22, status: "up", incidentsCount: 0 },
  { id: "ap-east", name: "Tokyo", region: "Asia-Pacific", code: "JP", coordinates: [139.6917, 35.6895], latency: 85, status: "up", incidentsCount: 0 },
  { id: "ap-se", name: "Singapore", region: "Asia-Pacific", code: "SG", coordinates: [103.8198, 1.3521], latency: 34, status: "up", incidentsCount: 0 },
  { id: "au-east", name: "Sydney", region: "Oceania", code: "AU", coordinates: [151.2093, -33.8688], latency: 125, status: "up", incidentsCount: 0 },
  { id: "sa-east", name: "São Paulo", region: "South America", code: "BR", coordinates: [-46.6333, -23.5505], latency: 140, status: "up", incidentsCount: 0 },
  { id: "af-south", name: "Johannesburg", region: "Africa", code: "ZA", coordinates: [28.0473, -26.2041], latency: 165, status: "up", incidentsCount: 0 },
];

export function getRealWorldMapPaths(width = 960, height = 500) {
  const geojson = topojson.feature(countriesData as any, (countriesData as any).objects.countries) as any;
  const projection = d3.geoNaturalEarth1().scale(155).translate([width / 2, height / 2]);
  const pathGen = d3.geoPath().projection(projection);

  const countryPaths: { id: string | number; d: string }[] = [];
  if (geojson && geojson.features) {
    geojson.features.forEach((feature: any) => {
      const d = pathGen(feature);
      if (d) {
        countryPaths.push({ id: feature.id || Math.random(), d });
      }
    });
  }

  // Graticules (Lat/Long grid lines)
  const graticule = d3.geoGraticule10();
  const graticulePath = pathGen(graticule) || "";

  // Sphere outline
  const spherePath = pathGen({ type: "Sphere" }) || "";

  // Calculate pixel positions for probe cities
  const projectedNodes = PROBE_CITIES.map((city) => {
    const coords = projection(city.coordinates) || [0, 0];
    return {
      ...city,
      x: coords[0],
      y: coords[1],
    };
  });

  return {
    countryPaths,
    graticulePath,
    spherePath,
    projectedNodes,
  };
}
