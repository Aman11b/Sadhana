/**
 * Sadhana pattern icons — lucide-react style API, with image fill.
 *
 * <MantraMandala size={160} color="#B8945A" fillImage="/my-texture.jpg" />
 *
 * Props (all optional):
 *   size                number | string  width of the icon (height follows aspect ratio)   default 48
 *   color               string           stroke colour                                      default 'currentColor'
 *   strokeWidth         number           stroke width in icon units (viewBox = 100 wide)    default 0.8
 *   absoluteStrokeWidth boolean          keep strokeWidth in screen px, whatever the size   default false
 *   fillImage           string           URL / import / data-URI painted inside the shape
 *   fillColor           string           flat colour inside the shape (used under the image)
 *   fillOpacity         number           0–1                                                default 1
 *   imageFit            'cover'|'contain'                                                    default 'cover'
 *   imageScale          number           zoom the image inside the shape                    default 1
 *   ...any other SVG props (className, style, onClick, aria-*)
 */
import {
  createElement,
  forwardRef,
  useId,
  type ForwardRefExoticComponent,
  type ReactElement,
  type RefAttributes,
  type SVGProps,
} from "react";

type SvgAttributes = Record<string, string | number | undefined>;

type SvgNode = [tag: string, attrs: SvgAttributes, children?: SvgNode[]];

type Point = [number, number];
type BezierCurve = [Point, Point, Point, Point];

interface IconDefinition {
  w: number;
  h: number;
  fill: SvgNode[];
  lines: SvgNode[];
}

type IconName =
  | "mantra-mandala"
  | "stotra-lotus-ornament"
  | "mantra-anushthan-yantra"
  | "stotra-anushthan-ornament"
  | "journey-motif"
  | "reflection-motif"
  | "section-lotus"
  | "shree-yantra"
  | "ganpati-yantra"
  | "yantra-divider"
  | "ornamental-divider";

type IconDefinitionName =
  | "MantraMandala"
  | "StotraLotusOrnament"
  | "MantraAnushthanYantra"
  | "StotraAnushthanOrnament"
  | "JourneyMotif"
  | "ShreeYantra"
  | "GanpatiYantra"
  | "YantraDivider"
  | "ReflectionMotif"
  | "SectionLotus"
  | "OrnamentalDivider";

interface SadhanaIconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  fillImage?: string;
  fillColor?: string;
  fillOpacity?: number;
  imageFit?: "cover" | "contain";
  imageScale?: number;
}

type SadhanaIconComponent = ForwardRefExoticComponent<
  SadhanaIconProps & RefAttributes<SVGSVGElement>
>;

/* ------------------------------------------------------------------ */
/* geometry helpers                                                     */
/* ------------------------------------------------------------------ */
interface BezierPoint {
  x: number;
  y: number;
  ang: number;
}

const f = (n: number): number => Math.round(n * 100) / 100;

const rad = (d: number): number => (d * Math.PI) / 180;

const petalD = (
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  w: number,
): string => {
  const L = r1 - r0;
  const y0 = cy - r0;
  const y1 = cy - r1;

  return (
    `M${f(cx)} ${f(y0)} ` +
    `C${f(cx + w)} ${f(y0 - L * 0.25)} ${f(cx + w * 0.55)} ${f(y0 - L * 0.8)} ${f(cx)} ${f(y1)} ` +
    `C${f(cx - w * 0.55)} ${f(y0 - L * 0.8)} ${f(cx - w)} ${f(y0 - L * 0.25)} ${f(cx)} ${f(y0)}Z`
  );
};

const petal = (
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  w: number,
  angle = 0,
): SvgNode => [
  "path",
  {
    d: petalD(cx, cy, r0, r1, w),
    transform: angle ? `rotate(${angle} ${cx} ${cy})` : undefined,
  },
];

const ring = (
  n: number,
  offset: number,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  w: number,
): SvgNode[] =>
  Array.from({ length: n }, (_, i) =>
    petal(cx, cy, r0, r1, w, offset + (i * 360) / n),
  );

const leafD = (len: number, w: number): string =>
  `M0 0 C${f(len * 0.3)} ${-w} ${f(len * 0.7)} ${-w} ${len} 0 C${f(len * 0.7)} ${w} ${f(len * 0.3)} ${w} 0 0Z`;

const leaf = (
  x: number,
  y: number,
  len: number,
  angle: number,
  w = len * 0.34,
): SvgNode => [
  "path",
  {
    d: leafD(len, f(w)),
    transform: `translate(${f(x)} ${f(y)}) rotate(${f(angle)})`,
  },
];

const circle = (
  cx: number,
  cy: number,
  r: number,
  extra: SvgAttributes = {},
): SvgNode => ["circle", { cx, cy, r, ...extra }];

const path = (d: string, extra: SvgAttributes = {}): SvgNode => [
  "path",
  { d, ...extra },
];

const polyPts = (cx: number, cy: number, R: number, up: boolean): string =>
  [0, 1, 2]
    .map((i) => {
      const a = rad((up ? -90 : 90) + i * 120);
      return `${f(cx + R * Math.cos(a))},${f(cy + R * Math.sin(a))}`;
    })
    .join(" ");

const tri = (
  cx: number,
  cy: number,
  R: number,
  up: boolean,
  extra: SvgAttributes = {},
): SvgNode => ["polygon", { points: polyPts(cx, cy, R, up), ...extra }];

const bez = (p: BezierCurve, t: number): BezierPoint => {
  const [a, b, c, d] = p;
  const u = 1 - t;

  const x =
    u * u * u * a[0] +
    3 * u * u * t * b[0] +
    3 * u * t * t * c[0] +
    t * t * t * d[0];

  const y =
    u * u * u * a[1] +
    3 * u * u * t * b[1] +
    3 * u * t * t * c[1] +
    t * t * t * d[1];

  const dx =
    3 * u * u * (b[0] - a[0]) +
    6 * u * t * (c[0] - b[0]) +
    3 * t * t * (d[0] - c[0]);

  const dy =
    3 * u * u * (b[1] - a[1]) +
    6 * u * t * (c[1] - b[1]) +
    3 * t * t * (d[1] - c[1]);

  return {
    x,
    y,
    ang: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
};

const bezD = (p: BezierCurve): string =>
  `M${p[0][0]} ${p[0][1]} C${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} ${p[3][0]} ${p[3][1]}`;

const branchLeaves = (
  p: BezierCurve,
  ts: number[],
  len: number,
  spread = 38,
): SvgNode[] => {
  const out = ts.map((t, i) => {
    const { x, y, ang } = bez(p, t);
    return leaf(x, y, len * (1 - t * 0.25), ang + (i % 2 ? spread : -spread));
  });

  const tip = bez(p, 1);
  out.push(leaf(tip.x, tip.y, len * 0.9, tip.ang));

  return out;
};

const xform = (t: string, nodes: SvgNode[]): SvgNode[] =>
  nodes.map(
    ([tag, attrs, kids]): SvgNode => [
      tag,
      {
        ...attrs,
        transform: `${t} ${attrs.transform || ""}`.trim(),
      },
      kids,
    ],
  );

const mirrorX = (w: number, nodes: SvgNode[]): SvgNode[] =>
  xform(`translate(${w} 0) scale(-1 1)`, nodes);

const flipY = (h: number, nodes: SvgNode[]): SvgNode[] =>
  xform(`translate(0 ${h}) scale(1 -1)`, nodes);
const dotted = { strokeDasharray: "0.1 2.1", strokeLinecap: "round" };
const faint = { opacity: 0.6 };
const fadeNodes = (nodes: SvgNode[]): SvgNode[] =>
  nodes.map(
    ([tag, attrs, kids]): SvgNode => [tag, { ...attrs, ...faint }, kids],
  );

/* ------------------------------------------------------------------ */
/* lotus (shared by SectionLotus & JourneyMotif) — 100 x 70 space      */
/* ------------------------------------------------------------------ */
const lotusFill = () => [
  path("M50 58 C32 60 14 54 6 38 C22 36 40 44 50 58Z"),
  ...mirrorX(100, [path("M50 58 C32 60 14 54 6 38 C22 36 40 44 50 58Z")]),
  path("M50 58 C36 56 26 44 24 24 C38 28 48 42 50 58Z"),
  ...mirrorX(100, [path("M50 58 C36 56 26 44 24 24 C38 28 48 42 50 58Z")]),
  path("M50 6 C60 20 62 38 50 58 C38 38 40 20 50 6Z"),
  path("M50 58 L42 64 L50 69 L58 64Z"),
];
const lotusLines = () => [path("M50 16 C52 28 52 40 50 54", faint)];

/* ------------------------------------------------------------------ */
/* icon definitions                                                     */
/* ------------------------------------------------------------------ */
const DEFS: Record<IconDefinitionName, IconDefinition> = {} as Record<
  IconDefinitionName,
  IconDefinition
>;

// 01 — mantra mandala ------------------------------------------------
DEFS.MantraMandala = {
  w: 100,
  h: 100,
  fill: [...ring(12, 0, 50, 50, 22, 48, 14.5), circle(50, 50, 34)],
  lines: [
    ...ring(12, 15, 50, 50, 16, 40, 11),
    ...fadeNodes(ring(24, 7.5, 50, 50, 36, 47, 3)),
    ...fadeNodes(ring(12, 0, 50, 50, 26, 44, 6.5)),
    circle(50, 50, 22),
    circle(50, 50, 40, { ...dotted, ...faint }),
    ...ring(8, 0, 50, 50, 4, 18, 5.5),
    ...fadeNodes(ring(8, 22.5, 50, 50, 5, 12, 3)),
    circle(50, 50, 3),
  ],
};

// 03 — mantra anushthan yantra ---------------------------------------

DEFS.MantraAnushthanYantra = {
  w: 100,
  h: 100,
  fill: [
    circle(50, 50, 48),
    ...ring(16, 0, 50, 50, 35, 46, 7),
    ...ring(8, 22.5, 50, 50, 19, 31, 8),
    circle(50, 50, 17),
  ],
  lines: [
    // Outer enclosure
    circle(50, 50, 48),
    circle(50, 50, 45, dotted),
    circle(50, 50, 42),

    // Outer lotus details
    ...ring(16, 11.25, 50, 50, 34, 43, 5),
    ...ring(16, 0, 50, 50, 38, 46, 3),

    // Inner concentric circles
    circle(50, 50, 34),
    circle(50, 50, 32, dotted),

    // Eight-petal lotus
    ...ring(8, 0, 50, 50, 20, 31, 7),
    circle(50, 50, 20),

    // Central interlocking triangles
    tri(50, 50, 18, true),
    tri(50, 50, 18, false),
    tri(50, 50, 13, true),
    tri(50, 50, 13, false),

    // Inner geometric enclosure
    circle(50, 50, 9),
    tri(50, 50, 7, true),
    tri(50, 50, 7, false),

    // Central bindu
    circle(50, 50, 3, {
      fill: "currentColor",
      strokeWidth: 1,
    }),

    // Directional markers
    ...Array.from({ length: 8 }, (_, i) => {
      const a = rad(i * 45);
      const x = 50 + 47 * Math.cos(a);
      const y = 50 + 47 * Math.sin(a);
      return circle(x, y, 0.9);
    }),
  ],
};

// 02 — stotra lotus ornament (vertical floral) ------------------------
const floralStem: BezierCurve = [
  [26, 108],
  [12, 94],
  [20, 82],
  [28, 70],
];
DEFS.StotraLotusOrnament = {
  w: 60,
  h: 110,
  fill: [
    // main bloom
    petal(30, 52, 0, 24, 7, -62),
    petal(30, 52, 0, 24, 7, 62),
    petal(30, 52, 0, 28, 8, -34),
    petal(30, 52, 0, 28, 8, 34),
    petal(30, 52, 0, 32, 9, 0),
    // top bud
    petal(47, 24, 0, 13, 4.2, -26),
    petal(47, 24, 0, 13, 4.2, 26),
    petal(47, 24, 0, 16, 4.6, 0),
    // lower bud
    petal(50, 80, 0, 11, 3.6, 40),
    petal(50, 80, 0, 11, 3.6, 100),
    petal(50, 80, 0, 14, 4, 70),
    // leaves
    leaf(18, 88, 16, -120),
    leaf(14, 100, 14, 150),
    leaf(32, 64, 14, 25),
  ],
  lines: [
    path(`${bezD(floralStem)} C34 62 32 60 30 54`),
    path("M30 56 C40 50 52 42 47 26"),
    path("M27 74 C38 74 46 72 50 82"),
    path("M16 98 C8 96 7 87 13 86 C18 85 19 91 15 92", { ...faint }),
    path("M30 20 V24", faint),
  ],
};

// 04 — stotra anushthan ornament (two vine flourishes) ----------------
const vineMain: BezierCurve = [
  [2, 24],
  [26, 6],
  [40, 34],
  [66, 18],
];

const vineTail: BezierCurve = [
  [66, 18],
  [84, 8],
  [100, 16],
  [118, 4],
];
const vine = () => ({
  fill: [
    ...branchLeaves(vineMain, [0.14, 0.28, 0.42, 0.56, 0.7, 0.86], 16, 40),
    ...branchLeaves(vineTail, [0.2, 0.45, 0.7], 14, 40),
    ...ring(5, 0, 102, 11, 0, 8, 3.4),
  ],
  lines: [
    path(bezD(vineMain)),
    path(bezD(vineTail)),
    path("M54 24 C56 33 66 34 67 28 C68 24 63 23 62 26", faint),
    path("M30 21 C28 28 22 30 20 26", faint),
  ],
});
DEFS.StotraAnushthanOrnament = {
  w: 120,
  h: 76,
  fill: [...vine().fill, ...flipY(76, vine().fill)],
  lines: [...vine().lines, ...flipY(76, vine().lines)],
};

// 05 — journey motif (sunrise lotus) ---------------------------------
const rays: SvgNode[] = [];
for (let k = -8; k <= 8; k++) {
  const a = rad(-90 + k * 10.5);
  const r0 = 36;
  const r1 = k % 2 === 0 ? 58 : 48;
  rays.push(
    path(
      `M${f(60 + r0 * Math.cos(a))} ${f(64 + r0 * Math.sin(a))} L${f(60 + r1 * Math.cos(a))} ${f(64 + r1 * Math.sin(a))}`,
      k % 2 ? faint : {},
    ),
  );
}
DEFS.JourneyMotif = {
  w: 120,
  h: 80,
  fill: [path("M30 64 A30 30 0 0 1 90 64Z")],
  lines: [
    ...rays,
    path("M30 64 A30 30 0 0 1 90 64"),
    [
      "g",
      { transform: "translate(38 38) scale(0.44)" },
      [...lotusFill(), ...lotusLines()],
    ],
    path("M4 64 H116", faint),
    path(
      "M12 64 C22 64 24 70 34 70 C44 70 48 74 60 78 C72 74 76 70 86 70 C96 70 98 64 108 64",
    ),
    path("M12 64 C6 64 5 70 9 71 C12 72 14 68 11 67", faint),
    path("M108 64 C114 64 115 70 111 71 C108 72 106 68 109 67", faint),
    path("M60 70 L56 74 L60 78 L64 74Z"),
  ],
};

// shree yantra
// --------------------------------------

const shreeTriangleLayers: SvgNode[] = [
  tri(50, 50, 34, true),
  tri(50, 50, 34, false),

  tri(50, 50, 29, true),
  tri(50, 50, 29, false),

  tri(50, 50, 24, true),
  tri(50, 50, 24, false),

  tri(50, 50, 19, true),
  tri(50, 50, 19, false),
];

DEFS.ShreeYantra = {
  w: 100,
  h: 100,
  fill: [...ring(16, 0, 50, 50, 35, 47, 6), circle(50, 50, 32)],
  lines: [
    // Outer boundary
    circle(50, 50, 48),
    circle(50, 50, 45, dotted),

    // Sixteen-petal lotus
    ...ring(16, 11.25, 50, 50, 35, 44, 5),

    // Eight-petal inner lotus
    ...ring(8, 22.5, 50, 50, 27, 33, 5),

    // Triangle enclosure
    circle(50, 50, 27),
    ...shreeTriangleLayers,

    // Inner bindu enclosure
    circle(50, 50, 8),
    circle(50, 50, 4),
    circle(50, 50, 1.8, {
      fill: "currentColor",
    }),
  ],
};

DEFS.GanpatiYantra = {
  w: 100,
  h: 100,
  fill: [...ring(12, 0, 50, 50, 35, 46, 7), circle(50, 50, 27)],
  lines: [
    // Outer enclosure
    circle(50, 50, 48),
    circle(50, 50, 44, dotted),

    // Twelve-petal lotus
    ...ring(12, 15, 50, 50, 35, 43, 6),

    // Inner enclosure
    circle(50, 50, 32),
    ...ring(8, 0, 50, 50, 24, 30, 5),

    // Central geometric triangles
    tri(50, 50, 21, true),
    tri(50, 50, 21, false),

    // Stylized Ganesha-inspired central motif
    path(
      "M39 39 C39 30 44 25 50 25 C56 25 61 30 61 39 " +
        "C61 46 57 51 52 53 " +
        "C49 56 49 62 54 65 " +
        "C60 68 65 62 63 57 " +
        "M50 37 C47 43 46 49 50 53",
    ),

    // Central bindu
    circle(50, 50, 3, {
      fill: "currentColor",
    }),

    // Directional dots
    ...ring(8, 0, 50, 50, 13, 14, 1.2),
  ],
};

DEFS.YantraDivider = {
  w: 180,
  h: 50,
  fill: [
    // Central floral mandala
    ...ring(8, 0, 90, 25, 7, 19, 5),
    ...ring(8, 22.5, 90, 25, 4, 10, 3),
    circle(90, 25, 5),

    // Side floral ornaments
    ...ring(4, 45, 30, 25, 3, 9, 3),
    ...ring(4, 45, 150, 25, 3, 9, 3),
  ],
  lines: [
    // Main horizontal lines
    path("M2 25 H65"),
    path("M115 25 H178"),

    // Secondary decorative lines
    path("M10 20 H65", faint),
    path("M10 30 H65", faint),
    path("M115 20 H170", faint),
    path("M115 30 H170", faint),

    // Central mandala borders
    circle(90, 25, 21),
    circle(90, 25, 23, dotted),

    // Central lotus
    ...ring(8, 0, 90, 25, 9, 18, 4),

    // Left and right scrollwork
    path("M4 25 C10 12 22 12 30 25 C38 38 50 38 60 25"),
    path("M176 25 C170 12 158 12 150 25 C142 38 130 38 120 25"),

    // Terminal ornaments
    circle(4, 25, 2),
    circle(176, 25, 2),
    circle(12, 25, 1),
    circle(168, 25, 1),

    // Central bindu
    circle(90, 25, 2, {
      fill: "currentColor",
    }),
  ],
};

// 06 — reflection motif (diya + laurel) --------------------------------
const laurel: BezierCurve = [
  [56, 64],
  [28, 60],
  [8, 38],
  [14, 8],
];
DEFS.ReflectionMotif = {
  w: 120,
  h: 70,
  fill: [
    path("M36 40 H84 C84 56 74 62 60 62 C46 62 36 56 36 40Z"),
    path("M60 8 C50 20 48 30 60 40 C72 30 70 20 60 8Z"),
  ],
  lines: [
    path("M36 40 C44 45 76 45 84 40", {}),
    path("M60 20 C56 27 56 32 60 36 C64 32 64 27 60 20Z", faint),
    path("M50 62 H70", faint),
    path(bezD(laurel)),
    ...branchLeaves(laurel, [0.14, 0.28, 0.42, 0.56, 0.7, 0.84], 12, 40),
    ...mirrorX(120, [
      path(bezD(laurel)),
      ...branchLeaves(laurel, [0.14, 0.28, 0.42, 0.56, 0.7, 0.84], 12, 40),
    ]),
  ],
};

// 07 — section lotus ------------------------------------------------------
DEFS.SectionLotus = {
  w: 100,
  h: 70,
  fill: lotusFill(),
  lines: lotusLines(),
};

// 08 — ornamental divider ---------------------------------------------------
const scroll = [
  path("M62 15 C66 7 73 7 75 12 C76 15 72 16 71 14"),
  path("M62 15 C66 23 73 23 75 18 C76 15 72 14 71 16"),
  path("M54 15 C56 11 59 11 60 13", faint),
  path("M54 15 C56 19 59 19 60 17", faint),
];
DEFS.OrnamentalDivider = {
  w: 160,
  h: 30,
  fill: [
    petal(80, 15, 0, 13, 4.5, 0),
    petal(80, 15, 0, 13, 4.5, 180),
    petal(80, 15, 0, 9, 3.6, 90),
    petal(80, 15, 0, 9, 3.6, 270),
  ],
  lines: [
    path("M10 15 H52"),
    path("M108 15 H150"),
    circle(4, 15, 1.6),
    circle(156, 15, 1.6),
    circle(16, 15, 1, { strokeWidth: 1.4 }),
    circle(44, 15, 1, { strokeWidth: 1.4 }),
    circle(116, 15, 1, { strokeWidth: 1.4 }),
    circle(144, 15, 1, { strokeWidth: 1.4 }),
    ...scroll,
    ...mirrorX(160, scroll),
    circle(80, 15, 2.2),
    circle(80, 3, 1, { strokeWidth: 1.2 }),
    circle(80, 27, 1, { strokeWidth: 1.2 }),
  ],
};

/* ------------------------------------------------------------------ */
/* renderer                                                             */
/* ------------------------------------------------------------------ */
const renderNodes = (nodes: SvgNode[], prefix: string): ReactElement[] =>
  nodes
    .filter(Boolean)
    .map(([tag, attrs, children], i) =>
      createElement(
        tag,
        { key: `${prefix}${i}`, ...attrs },
        children ? renderNodes(children, `${prefix}${i}-`) : undefined,
      ),
    );

export const createSadhanaIcon = (
  displayName: string,
  def: IconDefinition,
): SadhanaIconComponent => {
  const Icon = forwardRef<SVGSVGElement, SadhanaIconProps>(function SadhanaIcon(
    {
      size = 48,
      color = "currentColor",
      strokeWidth = 1.8,
      absoluteStrokeWidth = false,
      fillImage,
      fillColor,
      fillOpacity = 1,
      imageFit = "cover",
      imageScale = 1,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
    const clipId = `sad-${displayName}-${uid}`;

    const px = typeof size === "number" ? size : parseFloat(size) || 48;

    const sw = absoluteStrokeWidth
      ? (Number(strokeWidth) * def.w) / px
      : strokeWidth;

    const hasFill = Boolean(fillImage || fillColor);
    const cx = def.w / 2;
    const cy = def.h / 2;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={typeof size === "number" ? (size * def.h) / def.w : undefined}
        viewBox={`0 0 ${def.w} ${def.h}`}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={["sadhana-icon", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {/* Clip path for image and background fill */}
        {hasFill && (
          <defs>
            <clipPath id={clipId}>{renderNodes(def.fill, "clip")}</clipPath>
          </defs>
        )}

        {/* Image and background fill */}
        {hasFill && (
          <g clipPath={`url(#${clipId})`} opacity={fillOpacity} stroke="none">
            {fillColor && (
              <rect width={def.w} height={def.h} fill={fillColor} />
            )}

            {fillImage && (
              <g
                transform={`translate(${cx} ${cy}) scale(${imageScale}) translate(${-cx} ${-cy})`}
              >
                <image
                  href={fillImage}
                  x={0}
                  y={0}
                  width={def.w}
                  height={def.h}
                  preserveAspectRatio={
                    imageFit === "contain" ? "xMidYMid meet" : "xMidYMid slice"
                  }
                />
              </g>
            )}
          </g>
        )}

        {/* Shape outlines */}
        <g>{renderNodes(def.fill, "outline")}</g>

        {/* Decorative linework */}
        <g>{renderNodes(def.lines, "line")}</g>

        {/* Additional SVG children */}
        {children}
      </svg>
    );
  });

  Icon.displayName = displayName;

  return Icon;
};

/* ------------------------------------------------------------------ */
/* exports                                                              */
/* ------------------------------------------------------------------ */
export const MantraMandala = createSadhanaIcon(
  "MantraMandala",
  DEFS.MantraMandala,
);
export const StotraLotusOrnament = createSadhanaIcon(
  "StotraLotusOrnament",
  DEFS.StotraLotusOrnament,
);
export const MantraAnushthanYantra = createSadhanaIcon(
  "MantraAnushthanYantra",
  DEFS.MantraAnushthanYantra,
);
export const StotraAnushthanOrnament = createSadhanaIcon(
  "StotraAnushthanOrnament",
  DEFS.StotraAnushthanOrnament,
);
export const JourneyMotif = createSadhanaIcon(
  "JourneyMotif",
  DEFS.JourneyMotif,
);
export const ReflectionMotif = createSadhanaIcon(
  "ReflectionMotif",
  DEFS.ReflectionMotif,
);
export const SectionLotus = createSadhanaIcon(
  "SectionLotus",
  DEFS.SectionLotus,
);
export const OrnamentalDivider = createSadhanaIcon(
  "OrnamentalDivider",
  DEFS.OrnamentalDivider,
);
export const ShreeYantra = createSadhanaIcon("ShreeYantra", DEFS.ShreeYantra);

export const GanpatiYantra = createSadhanaIcon(
  "GanpatiYantra",
  DEFS.GanpatiYantra,
);

export const YantraDivider = createSadhanaIcon(
  "YantraDivider",
  DEFS.YantraDivider,
);

export const sadhanaIcons = {
  "mantra-mandala": MantraMandala,
  "stotra-lotus-ornament": StotraLotusOrnament,
  "mantra-anushthan-yantra": MantraAnushthanYantra,
  "stotra-anushthan-ornament": StotraAnushthanOrnament,
  "journey-motif": JourneyMotif,
  "reflection-motif": ReflectionMotif,
  "section-lotus": SectionLotus,
  "ornamental-divider": OrnamentalDivider,

  "shree-yantra": ShreeYantra,
  "ganpati-yantra": GanpatiYantra,
  "yantra-divider": YantraDivider,
};

// <SadhanaIcon name="section-lotus" fillImage={...} />

interface SadhanaIconLookupProps extends SadhanaIconProps {
  name: IconName;
}

export const SadhanaIcon = ({
  name,
  ...props
}: SadhanaIconLookupProps): ReactElement | null => {
  const Cmp = sadhanaIcons[name];

  return Cmp ? createElement(Cmp, props) : null;
};

export default sadhanaIcons;
