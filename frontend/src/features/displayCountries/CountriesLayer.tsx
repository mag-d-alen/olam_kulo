import { Layer, PathOptions } from "leaflet";
import type { Feature } from "geojson";
import { Loader } from "../../components/Loader";
import { useGetCountriesData } from "./hooks/useGetCountriesData"; import { GeoJSON } from 'react-leaflet';
type CountriesLayerProps = {
    children: React.ReactNode;
    customStyle: PathOptions;
    onEachCountry: ({ feature, layer }: { feature: Feature, layer: Layer }) => void;
}

export const CountriesLayer = ({ children, customStyle, onEachCountry }: CountriesLayerProps) => {
    const { data: countries, isLoading } = useGetCountriesData();

    const handleFeatureClick = ({ feature, layer }: { feature: Feature, layer: Layer }) => {
        onEachCountry({ feature, layer });
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