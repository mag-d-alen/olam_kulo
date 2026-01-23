import { Map } from '../components/Map';
import { HomeCityMapInput } from '../features/homeCityInfo/hooks/HomeCityMapInput';
export const OnboardingPage = () => {
  
  return (
    <Map focusPlace={null} zoom={3} headerText="Select your home city">
      <HomeCityMapInput />
    </Map>
  );
};
