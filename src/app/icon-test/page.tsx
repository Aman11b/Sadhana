import {
  MantraMandala,
  StotraLotusOrnament,
  MantraAnushthanYantra,
  StotraAnushthanOrnament,
  JourneyMotif,
  ReflectionMotif,
  SectionLotus,
  OrnamentalDivider,
  ShreeYantra,
  GanpatiYantra,
  YantraDivider,
} from "@/components/icons/sadhana-icons";

const icons = [
  { name: "Mantra Mandala", Component: MantraMandala, category: "Mantra" },
  {
    name: "Stotra Lotus Ornament",
    Component: StotraLotusOrnament,
    category: "Stotra",
  },
  {
    name: "Mantra Anushthan Yantra",
    Component: MantraAnushthanYantra,
    category: "Anushthan",
  },
  {
    name: "Stotra Anushthan Ornament",
    Component: StotraAnushthanOrnament,
    category: "Anushthan",
  },
  { name: "Journey Motif", Component: JourneyMotif, category: "Decorative" },
  {
    name: "Reflection Motif",
    Component: ReflectionMotif,
    category: "Decorative",
  },
  { name: "Section Lotus", Component: SectionLotus, category: "Section" },
  {
    name: "Ornamental Divider",
    Component: OrnamentalDivider,
    category: "Divider",
  },
  { name: "Shree Yantra", Component: ShreeYantra, category: "Yantra" },
  { name: "Ganpati Yantra", Component: GanpatiYantra, category: "Yantra" },
  { name: "Yantra Divider", Component: YantraDivider, category: "Divider" },
];

const strokeWidths = [0.8, 1.2, 1.6, 2, 2.4, 3];

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="font-semibold text-xl">{title}</h2>
      {description && <p className="text-[#82796E] text-sm">{description}</p>}
    </div>
  );
}

export default function IconTestPage() {
  return (
    <main className="bg-[#FAF8F3] px-6 py-12 min-h-screen text-[#40372D]">
      <div className="space-y-14 mx-auto max-w-6xl">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-[#A18455] text-sm uppercase tracking-[0.25em]">
            Sadhana Design System
          </p>
          <h1 className="font-semibold text-3xl">Icon Preview</h1>
          <p className="text-[#82796E] text-sm">
            Custom sacred geometry, decorative motifs and section icons.
          </p>
          <p className="text-[#A18455] text-xs">
            {icons.length} icons in the collection
          </p>
        </header>

        {/* Complete icon gallery */}
        <section className="space-y-6">
          <SectionHeading
            title="All icons"
            description="Default appearance at 120px."
          />

          <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {icons.map(({ name, Component, category }) => (
              <article
                key={name}
                className="flex flex-col justify-center items-center gap-5 bg-white p-6 border border-[#E8E0D3] rounded-xl min-h-60"
              >
                <Component size={120} color="#B8945A" />
                <div className="space-y-1 text-center">
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-[#A18455] text-xs">{category}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Size comparison */}
        <section className="space-y-6">
          <SectionHeading
            title="Size comparison"
            description="Check how details behave at different dimensions."
          />

          <div className="flex flex-wrap items-end gap-8 bg-white p-6 border border-[#E8E0D3] rounded-xl">
            {[32, 48, 64, 80, 100, 120, 160, 200].map((size) => (
              <div key={size} className="space-y-2 text-center">
                <MantraMandala size={size} color="#B8945A" />
                <p className="text-[#82796E] text-xs">{size}px</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stroke comparison */}
        <section className="space-y-6">
          <SectionHeading
            title="Stroke-width comparison"
            description="Compare line clarity and visual weight."
          />

          {[
            { name: "Mantra Mandala", Component: MantraMandala },
            {
              name: "Mantra Anushthan Yantra",
              Component: MantraAnushthanYantra,
            },
            { name: "Shree Yantra", Component: ShreeYantra },
            { name: "Ganpati Yantra", Component: GanpatiYantra },
            { name: "Section Lotus", Component: SectionLotus },
          ].map(({ name, Component }) => (
            <div
              key={name}
              className="space-y-5 bg-white p-6 border border-[#E8E0D3] rounded-xl"
            >
              <h3 className="font-medium text-sm">{name}</h3>

              <div className="gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {strokeWidths.map((stroke) => (
                  <div
                    key={stroke}
                    className="flex flex-col items-center gap-3"
                  >
                    <Component size={90} color="#B8945A" strokeWidth={stroke} />
                    <span className="text-[#82796E] text-xs">{stroke}px</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Color comparison */}
        <section className="space-y-6">
          <SectionHeading title="Color comparison" />

          <div className="flex flex-wrap justify-around items-center gap-8 bg-white p-8 border border-[#E8E0D3] rounded-xl">
            {[
              { color: "#B8945A", label: "Antique Gold" },
              { color: "#9B4D36", label: "Terracotta" },
              { color: "#40372D", label: "Deep Brown" },
              { color: "#7B8060", label: "Muted Sage" },
              { color: "#C5A5A0", label: "Dusty Rose" },
            ].map(({ color, label }) => (
              <div key={label} className="space-y-2 text-center">
                <ShreeYantra size={90} color={color} />
                <p className="text-xs">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Image and fill comparison */}
        <section className="space-y-6">
          <SectionHeading
            title="Image and fill test"
            description="Check clipping, image scaling and background fills."
          />

          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-4 bg-white p-6 border border-[#E8E0D3] rounded-xl">
              <MantraMandala size={140} color="#B8945A" fillColor="#E8D9B9" />
              <p className="text-xs">Solid fill</p>
            </div>

            <div className="flex flex-col items-center gap-4 bg-white p-6 border border-[#E8E0D3] rounded-xl">
              <MantraMandala
                size={140}
                color="#B8945A"
                fillImage="/pattern-icon/test-texture.jpg"
              />
              <p className="text-xs">Image fill</p>
            </div>

            <div className="flex flex-col items-center gap-4 bg-white p-6 border border-[#E8E0D3] rounded-xl">
              <ShreeYantra
                size={140}
                color="#9B4D36"
                fillImage="/pattern-icon/test-texture.jpg"
                fillColor="#E8D9B9"
                fillOpacity={0.8}
                imageScale={1.2}
              />
              <p className="text-xs">Combined fill and image zoom</p>
            </div>
          </div>
        </section>

        {/* Divider preview */}
        <section className="space-y-6">
          <SectionHeading
            title="Divider preview"
            description="Test decorative motifs at different widths."
          />

          <div className="space-y-10 bg-white p-8 border border-[#E8E0D3] rounded-xl">
            <div className="space-y-3">
              <p className="text-xs text-center">Ornamental Divider</p>
              <OrnamentalDivider
                size="100%"
                color="#B8945A"
                strokeWidth={1.3}
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs text-center">Yantra Divider</p>
              <YantraDivider size="100%" color="#B8945A" strokeWidth={1.3} />
            </div>

            <div className="space-y-3">
              <p className="text-xs text-center">Journey Motif</p>
              <JourneyMotif size={240} color="#B8945A" strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* Section icon preview */}
        <section className="space-y-6">
          <SectionHeading
            title="Section icon preview"
            description="Smaller, stronger icons for interface headings."
          />

          <div className="flex flex-wrap items-center gap-10 bg-white p-8 border border-[#E8E0D3] rounded-xl">
            <div className="space-y-2 text-center">
              <SectionLotus size={28} color="#B8945A" strokeWidth={2.2} />
              <p className="text-xs">28px</p>
            </div>

            <div className="space-y-2 text-center">
              <SectionLotus size={36} color="#B8945A" strokeWidth={2.2} />
              <p className="text-xs">36px</p>
            </div>

            <div className="space-y-2 text-center">
              <SectionLotus size={48} color="#B8945A" strokeWidth={2.2} />
              <p className="text-xs">48px</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
