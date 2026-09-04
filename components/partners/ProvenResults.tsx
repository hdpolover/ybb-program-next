// components/partners/ProvenResults.tsx
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

// Section: Proven Results — impact angka.
//
// The figure comes from the platform `impact_stats` row (total_participants),
// carried on the /partners payload. It used to be a hardcoded "630,000+ people
// directly impacted by funded initiatives" — two orders of magnitude above the
// entire users table, describing an outcome the schema does not model at all.
//
// This section also used to carry a card of ten sponsor logos, and every one of
// them was invented: iys-global, kys-education, meys-media-group,
// wys-technology, yaf-foundation, kys-learning-hub, meys-broadcasting,
// wys-digital-studio and friends, each reusing a YBB brand logo and each linking
// to /partners/<slug>, which returns 200 and renders a generic partnership page.
// So a visitor could click a fabricated organisation and land somewhere that
// looked like its profile. Its own comment said "using existing assets to
// simulate real sponsors".
//
// Real sponsor and partner data already renders on this page through
// SponsorTiersSection and CommunityPartnersSection (app/partners/page.tsx), fed
// by the sponsors_grid / partners_grid payload sections. Those are the honest
// surface. Production currently has 0 rows in `sponsors` and 0 in
// `program_partners`, so there is nothing to show — which is exactly why the
// placeholder existed, and exactly why it had to go rather than be wired up.
//
// With the logos gone the impact figure is the only content here, so the whole
// section is suppressed when no curated figure exists rather than rendering a
// heading over nothing.
export default function ProvenResultsSection({ impactValue }: { impactValue?: string }) {
  if (!impactValue) return null;

  return (
    <section className={componentsTheme.partnersProven.sectionWrapper}>
      <div className={componentsTheme.partnersProven.container}>
        <SectionHeader eyebrow="Impact" title="Proven Results" />
        <p className={componentsTheme.partnersProven.subtitle}>
          Tangible outcomes powered by our partners and sponsors across programs and regions.
        </p>

        <div className="mt-10">
          <div className={componentsTheme.partnersProven.impactCol}>
            <p className={componentsTheme.partnersProven.impactValue}>{impactValue}</p>
            <p className={componentsTheme.partnersProven.impactLabel}>participants across our programs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
