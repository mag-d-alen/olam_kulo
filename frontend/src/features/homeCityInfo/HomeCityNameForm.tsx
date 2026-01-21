import { useState } from 'react';
import { useAddHomeCity } from './hooks/useAddHomeCity';
import { LocationPickerMap } from '../../components/LocationPickerMap';
import { Button, Input } from '../../components/ui';
import { useForm } from 'react-hook-form';
import { Place } from '../../types';

type LocationData = {
  lat: number;
  lng: number;
  city: string;
  country: string;
};

export const HomeCityNameForm = () => {
  const { register, handleSubmit } = useForm();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const { mutate: addHomeCity, isPending } = useAddHomeCity();

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const onSubmit = (data: Place) => {
    addHomeCity(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Select Your Home City
      </h2>
      <form
        onSubmit={handleSubmit((data) => addHomeCity(data as Place))}
        className="space-y-6"
      >
    

  
          <div className="space-y-2">    <div>
          <LocationPickerMap onLocationSelect={handleLocationSelect} />
        </div>
            <Input {...register('city')} label="City" type="text" />
            <Input {...register('country')} label="Country" type="text" />
            <Input {...register('lat')} label="Latitude" type="number" />
            <Input {...register('lng')} label="Longitude" type="number" />

            {/* <Input
                label="City"
                value={selectedLocation.city}
                readOnly
                className="bg-background"
              />
              <Input
                label="Country"
                value={selectedLocation.country}
                readOnly
                className="bg-background"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  value={selectedLocation.lat.toFixed(6)}
                  readOnly
                  className="bg-background"
                />
                <Input
                  label="Longitude"
                  value={selectedLocation.lng.toFixed(6)}
                  readOnly
                  className="bg-background"
                /> */}
            {/* </div> */}


          <button type="submit">Add Home City</button>
          </div>
        {/* 
        <Button
          type="submit"
          disabled={isPending || !selectedLocation}
          className="w-full"
          isLoading={isPending}
        >
          {selectedLocation ? 'Confirm Home City' : 'Please select a location'}
        </Button> */}
      </form>
    </div>
  );
};
