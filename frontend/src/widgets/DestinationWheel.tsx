import { useState, useMemo } from 'react';
import { useGetDestination } from '../features/destinationChoice/hooks/useGetDestination';
import { useSetDestination } from '../features/destinationChoice/hooks/useSetDestination';
import { useUser } from '../authentication/hooks/useAuth';

export const DestinationWheel = () => {
  const places = useGetDestination();
  const { mutate: setDestination } = useSetDestination();
  const { user } = useUser();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const wheelData = useMemo(() => {
    if (!places || places.length === 0) return null;

    const segments = places.map((place, index) => {
      const angle = (360 / places.length) * index;
      return {
        ...place,
        angle,
        startAngle: angle,
        endAngle: angle + 360 / places.length,
      };
    });
    return segments;
  }, [places]);

  const spinWheel = () => {
    if (!wheelData || isSpinning) return;

    setIsSpinning(true);
    const fullSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = fullSpins * 360 + randomAngle;

    setRotation((prev) => {
      const finalRotation = prev + totalRotation;
      const angleAtTop = (360 - (finalRotation % 360)) % 360;

      const selected =
        wheelData.find((segment) => {
          if (angleAtTop === 0 && segment.startAngle === 0) {
            return true;
          }
          return (
            angleAtTop >= segment.startAngle && angleAtTop < segment.endAngle
          );
        }) || wheelData[0];

      setTimeout(() => {
        setIsSpinning(false);
      }, 4000);
      setTimeout(() => {
        setDestination({ city: selected.city, country: selected.country });
      }, 3000);

      return finalRotation;
    });
  };

  if (!places || places.length === 0) {
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

  const wheelRadius = 160; // 320px diameter / 2
  const colors = [
    '#3b82f6', // blue-500
    '#60a5fa', // blue-400
    '#8b5cf6', // violet-500
    '#a78bfa', // violet-400
    '#ec4899', // pink-500
    '#f472b6', // pink-400
  ];

  // Helper function to create SVG path for segment
  const createSegmentPath = (
    startAngle: number,
    endAngle: number,
    radius: number
  ) => {
    const start = ((startAngle - 90) * Math.PI) / 180;
    const end = ((endAngle - 90) * Math.PI) / 180;
    const x1 = 160 + radius * Math.cos(start);
    const y1 = 160 + radius * Math.sin(start);
    const x2 = 160 + radius * Math.cos(end);
    const y2 = 160 + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 160 160 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative">
        {/* Spinning Wheel */}
        <div
          className="relative w-400 h-400 rounded-full border-8 border-transparent overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        >
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            style={{ transform: 'rotate(0deg)' }}
          >
            {wheelData?.map((segment, index) => {
              const color = colors[index % colors.length];

              const textAngle =
                segment.startAngle + (segment.endAngle - segment.startAngle);

              // Convert to radians, adjusting for SVG coordinate system (0° is at 3 o'clock, we want 0° at top)
              const textAngleRad = ((textAngle - 90) * Math.PI) / 180;

              const textStartRadius = wheelRadius * 0.25;
              const textEndRadius = wheelRadius * 0.75;

              return (
                <g key={segment.id}>
                  <path
                    d={createSegmentPath(
                      segment.startAngle,
                      segment.endAngle,
                      wheelRadius
                    )}
                    fill={color}
                    strokeWidth="4"
                  />
                  <defs>
                    <path
                      id={`text-path-${segment.id}`}
                      d={`M ${160 + textStartRadius * Math.cos(textAngleRad)} ${160 + textStartRadius * Math.sin(textAngleRad)} L ${160 + textEndRadius * Math.cos(textAngleRad)} ${160 + textEndRadius * Math.sin(textAngleRad)}`}
                    />
                  </defs>
                  <text>
                    <textPath
                      fontSize="4"
                      href={`#text-path-${segment.id}`}
                      startOffset="95%"
                      textAnchor="end"
                    >
                      {segment.city}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 ">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 " />
        </div>
      </div>

      {!user?.destinationCity && (
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${
            isSpinning && 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
        </button>
      )}

      {user?.destinationCity && !isSpinning && (
        <>
          <p className="flex font-bold text-center">
            🎉 {user.destinationCity}, {user.destinationCity} 🎉
          </p>
        </>
      )}
    </div>
  );
};
