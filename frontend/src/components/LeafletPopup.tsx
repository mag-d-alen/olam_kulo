import { Popup } from "react-leaflet";

export const LeafletPopup = ({ children }: { children: React.ReactNode }) => {
    return <Popup keepInView>{children}</Popup>;
};