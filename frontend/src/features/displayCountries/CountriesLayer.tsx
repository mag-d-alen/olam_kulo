import { Layer, PathOptions } from "leaflet";
import type { Feature } from "geojson";
import { useRef } from "react";;
import { Loader } from "../../components/Loader";
import { Place } from "../../types";
import { useGetCountriesData } from "./hooks/useGetCountriesData"; import { GeoJSON, Popup, useMap, } from 'react-leaflet';
type CountriesLayerProps = {
    children: React.ReactNode;
    customStyle: PathOptions;
    onEachCountry: ({ feature, layer }: { feature: Feature, layer: Layer }) => void;
}

export const CountriesLayer = ({ children, customStyle, onEachCountry }: CountriesLayerProps) => {
    const { data: countries, isLoading } = useGetCountriesData();
    // const map = useMap();
    // const clickedCountryRef = useRef<Place | null>(null);
    // const itineraryRef = useRef<Place[]>([]);
    const handleFeatureClick = ({ feature, layer }: { feature: Feature, layer: Layer }) => {
        onEachCountry({ feature, layer });
        layer.on({
            mouseover: (e: any) => {
                console.log('Mouse over:', e.target.properties);
                e.target.setStyle({
                    fillOpacity: 0.8,
                    fillColor: '#f0a529',
                });
            },
            mouseout: (e: any) => {
                e.target.setStyle({
                    fillOpacity: 0,
                });
            },
        });
    }
    let style = customStyle ? customStyle : countryStyle;
    if (isLoading) return <Loader text="Loading countries data..." />;
    if (!countries) return <></>;
    return (
        <GeoJSON key={"countries-layer"} data={countries} style={style as PathOptions} onEachFeature={(feature, layer) => handleFeatureClick({ feature, layer })}
            interactive={true}>
            {children}
        </GeoJSON>

    );
}
const countryStyle = {
    fillColor: 'inherit',
    color: 'inherit',
    fillOpacity: 0,
    weight: 0.1,
};