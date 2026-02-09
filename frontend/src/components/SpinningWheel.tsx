import { useMemo, useState } from 'react';

const COLORS = [
  'var(--color-green)',
  'var(--color-tan)',
  'var(--color-orange)',

];
const WHEEL_RADIUS = 320 / 2;
export type WheelSegment = {
  id: string;
  startAngle: number;
  endAngle: number;
  label: string;
  value: any;
};
type SpinningWheelProps = {
  showSpinButton: boolean;
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
  wheelData: WheelSegment[];
  onSpin: (value: { city: string; country: string, id: string }) => void;
};

export const SpinningWheel = ({
  showSpinButton,
  isSpinning,
  setIsSpinning,
  wheelData,
  onSpin,
}: SpinningWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const segments = useMemo(() => createWheelSegments(wheelData), [wheelData]);

  const spinWheel = () => {
    if (isSpinning) return;
    startSpinning();
  };

  const startSpinning = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const fullSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = fullSpins * 360 + randomAngle;
    setRotation((prev) => {
      const finalRotation = prev + totalRotation;

      setTimeout(() => {
        setIsSpinning(false);
      }, 4000);
      setTimeout(() => {
        findSelectedDestination(finalRotation);
      }, 3000);
      return finalRotation;
    });
  };

  const findSelectedDestination = (finalRotation: number) => {
    const angleAtTop = (360 - (finalRotation % 360)) % 360;
    const selected =
      segments.find((segment) => {
        return (
          angleAtTop >= segment.startAngle && angleAtTop < segment.endAngle
        );
      }) || segments[0];
    onSpin(selected.value);
  };

  return (
    <>
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 ">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 " />
        </div>
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
            {segments?.map((segment, index) => {
              const color = COLORS[index % COLORS.length];
              const textAngle =
                segment.startAngle + (segment.endAngle - segment.startAngle);
              const textAngleRad = ((textAngle - 90) * Math.PI) / 180;
              const textStartRadius = WHEEL_RADIUS * 0.25;
              const textEndRadius = WHEEL_RADIUS * 0.75;

              return (
                <g key={segment.id}>
                  <path
                    d={drawSegmentPath(
                      segment.startAngle,
                      segment.endAngle,
                      WHEEL_RADIUS
                    )}
                    fill={color}
                  />
                  <defs>
                    <path
                      id={`text-path-${segment.id}`}
                      d={`M ${WHEEL_RADIUS + textStartRadius * Math.cos(textAngleRad)} ${WHEEL_RADIUS + textStartRadius * Math.sin(textAngleRad)} L ${WHEEL_RADIUS + textEndRadius * Math.cos(textAngleRad)} ${WHEEL_RADIUS + textEndRadius * Math.sin(textAngleRad)}`}
                    />
                  </defs>
                  <text>
                    <textPath
                      fontSize="4"
                      href={`#text-path-${segment.id}`}
                      startOffset="95%"
                      textAnchor="end"
                    >
                      {segment.label}
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

      {showSpinButton && (
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${isSpinning && 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
        </button>
      )}
    </>
  );
};

const createWheelSegments = (data: WheelSegment[]) =>
  data.map((segment, index) => {
    const angle = (360 / data.length) * index;
    return {
      ...segment,
      startAngle: angle,
      endAngle: angle + 360 / data.length,
    } as WheelSegment;
  }) as WheelSegment[];

const drawSegmentPath = (
  startAngle: number,
  endAngle: number,
  radius: number
) => {
  const start = ((startAngle - 90) * Math.PI) / 180;
  const end = ((endAngle - 90) * Math.PI) / 180;
  const x1 = WHEEL_RADIUS + radius * Math.cos(start);
  const y1 = WHEEL_RADIUS + radius * Math.sin(start);
  const x2 = WHEEL_RADIUS + radius * Math.cos(end);
  const y2 = WHEEL_RADIUS + radius * Math.sin(end);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${WHEEL_RADIUS} ${WHEEL_RADIUS} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};
