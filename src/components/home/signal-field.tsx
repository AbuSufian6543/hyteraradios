const VIEW_HEIGHT = 400;

type Tone = "brand" | "light";

type Wave = {
  d: string;
  width: number;
  duration: string;
  opacity: number;
  reverse?: boolean;
};

function carrierPath(
  baseline: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  width: number,
) {
  let path = "";
  const step = 12;
  for (let x = 0; x <= width; x += step) {
    const y = baseline + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude;
    path += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
  }
  return path;
}

/** Two periods wide so a -50% slide loops without a jump. */
const DRIFT_WIDTH = 2880;

const BRAND_WAVES: Wave[] = [
  {
    d: carrierPath(96, 12, 480, 0.4, DRIFT_WIDTH),
    width: DRIFT_WIDTH,
    duration: "52s",
    opacity: 0.2,
  },
  {
    d: carrierPath(214, 20, 360, 1.15, DRIFT_WIDTH),
    width: DRIFT_WIDTH,
    duration: "38s",
    opacity: 0.28,
    reverse: true,
  },
  {
    d: carrierPath(328, 14, 240, 0.2, DRIFT_WIDTH),
    width: DRIFT_WIDTH,
    duration: "46s",
    opacity: 0.22,
  },
];

const LIGHT_WAVES: Wave[] = [
  {
    d: carrierPath(120, 16, 480, 0.3, DRIFT_WIDTH),
    width: DRIFT_WIDTH,
    duration: "44s",
    opacity: 0.34,
  },
  {
    d: carrierPath(270, 18, 360, 1.4, DRIFT_WIDTH),
    width: DRIFT_WIDTH,
    duration: "58s",
    opacity: 0.22,
    reverse: true,
  },
];

/**
 * Slow carrier waves behind a section. A separate halo sits behind the
 * featured radio. Neither uses a particle mesh.
 */
export function SignalField({
  className = "",
  tone = "brand",
}: {
  className?: string;
  tone?: Tone;
}) {
  const waves = tone === "light" ? LIGHT_WAVES : BRAND_WAVES;

  return (
    <div
      aria-hidden
      data-tone={tone}
      className={`signal-field ${className}`}
    >
      {waves.map((wave) => (
        <svg
          key={`${wave.duration}-${wave.opacity}`}
          className={`signal-wave${wave.reverse ? " signal-wave-reverse" : ""}`}
          style={{ animationDuration: wave.duration, opacity: wave.opacity }}
          viewBox={`0 0 ${wave.width} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path className="signal-wave-glow" d={wave.d} />
          <path d={wave.d} />
        </svg>
      ))}
    </div>
  );
}

/** Expanding signal rings centered on the featured product. */
export function SignalHalo({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`signal-halo ${className}`}>
      <span className="signal-ring" />
      <span className="signal-ring" />
      <span className="signal-ring" />
    </div>
  );
}
