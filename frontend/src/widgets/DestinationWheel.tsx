import { useState, useMemo } from 'react';
import { useGetDestination } from '../features/destinationChoice/hooks/useGetDestination';
import { useSetDestination } from '../features/destinationChoice/hooks/useSetDestination';
import { useUser } from '../authentication/hooks/useAuth';
import { SpinningWheel } from '../components/SpinningWheel';

export const DestinationWheel = () => {
  const {places} = useGetDestination();
  const { mutate: setDestination } = useSetDestination();
  const { user } = useUser();
  const [isSpinning, setIsSpinning] = useState(false);

  const wheelData = useMemo(() => {
    if (!places || places.length === 0) return [];
    return places.map((place, index) => ({
      id: index.toString(),
      startAngle: (360 / places.length) * index,
      endAngle: (360 / places.length) * (index + 1),
      label: place.city,
      value: { city: place.city, country: place.country, id: place.id },
    }));
  }, [places]);

  if (!places || places?.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No destinations available</p>
      </div>
    );
  }

  if (places.length === 1) {
    return (
      <div className="text-center p-8">
        <p className="text-lg font-semibold">{places[0].city}</p>
        <p className="text-sm text-gray-500">{places[0].country}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {places && (
        <SpinningWheel
          showSpinButton={!user?.destination?.city}
          wheelData={wheelData}
          onSpin={(value: {
            city: string;
            country: string;
            id: string;
          }) => setDestination(value)}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
        />
      )}
      {user?.destination?.city && !isSpinning && (
        <p className="flex font-bold text-center">
          🎉 {user.destination.city} 🎉
        </p>
      )}
    </div>
  );
};
