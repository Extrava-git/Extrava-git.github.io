import Link from "next/link";
import CTASection from "@/components/CTASection";
import HeroScroll from "@/components/HeroScroll";
import Industries from "@/components/Industries";
import ProductScrollNarrative from "@/components/ProductScrollNarrative";

export const metadata = {
  title: "Extrava",
  description:
    "extrava is a continuous, wearable extravasation sensor combining thermal and pressure sensing. Designed for chemotherapy infusion safety.",
};

const features = [
  {
    title: "Multi-modal sensing",
    body:
      "Skin temperature and tissue pressure, fused on-device. Either signal alone can produce false positives — together they're robust.",
  },
  {
    title: "Per-patient baseline",
    body:
      "The first 10–15 minutes of wear establish a personal baseline. Alerts trigger on deviation, not absolute thresholds.",
  },
  {
    title: "Bluetooth Low Energy",
    body:
      "Streams to a nurse-station tablet or a clinician phone. No clinical Wi-Fi setup, no new infrastructure.",
  },
  {
    title: "Designed for sterile workflows",
    body:
      "Adheres 1–2 cm from the IV site. Doesn't interfere with the cannula, dressing, or line.",
  },
  {
    title: "Up to 8 hours per charge",
    body:
      "A rechargeable LiPo cell powers a full infusion session, with safe charging via standard USB-C.",
  },
  {
    title: "Built to be reusable",
    body:
      "The sensor module is reusable across patients with a fresh, disposable adhesive backing — keeping per-infusion cost low.",
  },
];

const faqs = [
  {
    q: "Is extrava FDA-cleared?",
    a: "extrava is an investigational device, currently in pre-clinical bench testing and early clinical validation. We will pursue 510(k) clearance with our clinical partners.",
  },
  {
    q: "What drugs is extrava designed for?",
    a: "Initially: chemotherapeutic vesicants and irritants used in oncology infusion (e.g., anthracyclines, vinca alkaloids). The same sensing approach generalizes to vasopressors, contrast agents, and other high-risk IV drugs.",
  },
  {
    q: "How does it know what's a real alert?",
    a: "On-device signal fusion correlates thermal and pressure trajectories against the patient's own baseline. Pure pressure changes from patient movement, or thermal drift from ambient cooling, are filtered out.",
  },
  {
    q: "Where does the data live?",
    a: "Patient data stays on the bedside device by default. Clinical pilots can integrate with EHR systems on request, with full HIPAA documentation.",
  },
];

export default function ProductPage() {
  return (
    <>
      <div className="quantum-page">
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-line">
          <div className="mx-auto max-w-site px-6">
            <div className="max-w-4xl">
              <p className="eyebrow">Product</p>
              <h1 className="mt-5 text-display-2xl font-semibold leading-[1.0]">
                <span className="text-ink">extrava</span>
                <span className="text-ink-muted"> A continuous safety net for every infusion.</span>
              </h1>
              <p className="mt-7 text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl">
                A wearable sensor that watches every IV in real time, so a nurse who can't be in the room is never the bottleneck between a leak and an intervention.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-start gap-3">
                <Link href="/contact" className="btn-primary">
                  Request a pilot
                </Link>
                <Link href="/technology" className="btn-secondary">
                  Technology deep dive
                </Link>
              </div>
            </div>
          </div>
        </section>

        <HeroScroll />
        <ProductScrollNarrative />
        <Industries />

        <section id="capabilities" className="py-24 md:py-32 border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-site px-6">
          <div className="max-w-3xl">
            <p className="eyebrow">Capabilities</p>
            <h2 className="mt-5 text-display-xl font-semibold text-ink">
              Engineered for the bedside.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-ink-900/70 border border-line rounded-2xl p-7 h-full"
              >
                <div className="text-xs font-mono text-ink-subtle">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink tracking-tightish">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>

        <section className="py-24 md:py-32 border-b border-line">
        <div className="mx-auto max-w-site px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <p className="eyebrow">Inside the device</p>
              <h2 className="mt-5 text-display-lg font-semibold text-ink">
                Specifications.
              </h2>
              <p className="mt-6 text-ink-muted leading-relaxed">
                Targeted specifications for the clinical configuration. Subject to change as validation continues.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl className="border-t border-line">
                <SpecRow label="Microcontroller" value="ESP32-class, BLE 5.0 + Wi-Fi" />
                <SpecRow label="Thermal sensor" value="Digital, ±0.1 °C resolution" />
                <SpecRow label="Pressure sensor" value="Force-sensitive resistor" />
                <SpecRow label="Battery" value="3.7 V LiPo, ~600 mAh, USB-C" />
                <SpecRow label="Wear time" value="8 hr continuous" />
                <SpecRow label="Skin contact" value="Tegaderm-class breathable film" />
                <SpecRow label="Form factor" value="44 × 44 × 6 mm flexible housing" />
              </dl>
            </div>
          </div>
        </div>
        </section>

        <section id="faq" className="py-24 md:py-32 border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-4xl px-6">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-5 text-display-lg font-semibold text-ink">
            Common questions.
          </h2>
          <div className="mt-12 border-t border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-lg text-ink font-medium tracking-tightish pr-6">
                    {f.q}
                  </span>
                  <span className="text-ink-subtle group-open:rotate-45 transition-transform text-2xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-ink-muted leading-relaxed max-w-prose">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
        </section>
      </div>

      <CTASection />
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-line py-5">
      <dt className="text-sm text-ink-subtle col-span-1">{label}</dt>
      <dd className="text-sm text-ink font-mono col-span-2">{value}</dd>
    </div>
  );
}
