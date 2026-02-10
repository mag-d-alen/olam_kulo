
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as turf from '@turf/turf';
import { AxiosError } from 'axios';

const configService = new ConfigService();

const SUPABASE_URL = configService.get<string>('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = configService.get<string>(
  'SUPABASE_SERVICE_ROLE_KEY',
)!;

const VERSION = '2026-01';
const SEA_DISTANCE_KM = 10;


type CountryFeature = {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
  };
  geometry: any;
};

async function run() {

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );
  let countries = [];
  const { data: savedCountries } = await supabase.from('countries').select('*');
  countries = savedCountries?.length ? savedCountries : await getCountries() as CountryFeature[];
  if (!savedCountries?.length) {
    const { error: countriesError } = await supabase.from('countries').upsert(
      countries.map((f: CountryFeature) => ({
        name: f.properties.name,
        geometry: f.geometry
      })),
      { onConflict: 'id' }
    );
    if (countriesError) {
      throw new Error('Error saving countries: ' + countriesError.message);
    }
  }

  const features: CountryFeature[] = countries
    .filter((c: any) => c && c.geometry)
    .map((c: any) => ({
      type: 'Feature',
      properties: {
        id: c.properties?.id ?? c.id,
        name: c.properties?.name ?? c.name,
      },
      geometry: c.geometry,
    }));

  console.log(`Processing ${features.length} countries`);

  const neighbors: any[] = [];

  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {
      const a = features[i];
      const b = features[j];

      if (!turf.booleanIntersects(
        turf.bboxPolygon(turf.bbox(a)),
        turf.bboxPolygon(turf.bbox(b))
      )) {
        continue;
      }

      if (turf.booleanTouches(a, b)) {
        neighbors.push(
          {
            country_id: a.properties.id,
            neighbor_id: b.properties.id,
            type: 'land',
            distance_km: null,
            method: 'booleanTouches',
            version: VERSION
          },
          {
            country_id: b.properties.id,
            neighbor_id: a.properties.id,
            type: 'land',
            distance_km: null,
            method: 'booleanTouches',
            version: VERSION
          }
        );
        continue;
      }
      const dist = turf.distance(
        turf.centroid(a),
        turf.centroid(b)
      );
      console.log(`Distance between ${a.properties.name} and ${b.properties.name}: ${dist}`);

      if (dist <= SEA_DISTANCE_KM) {
        neighbors.push(
          {
            country_id: a.properties.id,
            neighbor_id: b.properties.id,
            type: 'sea',
            distance_km: dist,
            method: 'centroid_distance',
            version: VERSION
          },
          {
            country_id: b.properties.id,
            neighbor_id: a.properties.id,
            type: 'sea',
            distance_km: dist,
            method: 'centroid_distance',
            version: VERSION
          }
        );
      }
    }
  }

  console.log(`Computed ${neighbors.length} neighbor links`);

  await supabase
    .from('country_neighbors')
    .delete()
    .eq('version', VERSION);

  const { error } = await supabase
    .from('country_neighbors')
    .insert(neighbors);

  if (error) {
    throw error;
  }

  console.log('Neighbors saved');
}

run()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function getCountries() {
  console.log("Getting countries data");
  try {
    const res = await fetch(
      `https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson`
      , {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
    const data = await res.json();
    const mappedFeatures = data.features.map((feature: any) => ({

      properties: { name: feature.properties.COUNTRY, id: feature.properties.AFF_ISO, },
      geometry: feature.geometry
    }));
    return mappedFeatures;
  } catch (error) {
    console.error(new AxiosError('Error getting countries data', error as string));
  }
}