# Design Guidelines

This document captures the UI patterns already established across the YBB web apps and should be used as the default reference when adding or updating interface work.

## Core Principles

### If it hovers, it clicks
- Only apply hover elevation, shadow, scale, or translate treatments to interactive elements.
- Static cards should stay visually stable.
- Clickable cards should use a real navigation target (`<Link>` or `<a>`) instead of a decorative hover-only wrapper.

### Prefer established section structure
- Most landing sections follow: **SectionHeader → short supporting sentence → content grid/carousel**.
- Keep section widths centered with `max-w-7xl` containers and generous vertical spacing.
- Reuse existing hero treatments before inventing page-specific banners.

### Use soft surfaces, strong hierarchy
- Primary information should sit on white cards with subtle rings/shadows.
- Titles use bold, high-contrast text.
- Supporting copy should stay in muted slate/gray tones.
- Brand-accent color should be used for emphasis, actions, and small metadata highlights rather than full-page overload.

## Cards

### Clickable cards
- Wrap the card in `<Link>` when the whole card opens a destination.
- Use `rounded-2xl` or `rounded-3xl`, white background, subtle border/ring, and `hover:shadow-md` or the equivalent established shadow step.
- Media areas should use fixed aspect ratios and `object-cover`.

### Static cards
- Do not add hover motion to informational cards that are not clickable.
- Keep shadows lighter than interactive cards.

### Locked/unavailable cards
- Use reduced emphasis: `opacity-60`, muted background, `cursor-not-allowed`, and a dashed or softer border treatment.

## Buttons and CTAs

- Primary CTAs should use the filled brand style already used across hero/application flows.
- Secondary CTAs should use outlined brand styling.
- CTA copy should describe the action directly (`Register Now`, `View Previous Programs`, `Read archived program`).
- Avoid button-looking elements that do not navigate or submit anything.

## Empty and Missing States

- Prefer graceful fallback content over raw placeholders like `Data not added`.
- Missing images should fall back to an existing brand/program image treatment before showing blank placeholders.
- Missing text fields should use user-friendly copy such as `Location to be announced` or `TBA`.
- Empty sections should explain what will appear there and provide a sensible next action when possible.

## Program Pages

- Active programs and archived programs should not share the same CTA language blindly.
- Archived pages should use archive-oriented copy and avoid pushing registration actions that no longer exist.
- Program archive/list pages should link clearly to the underlying detail pages.

## Consistency Rules

- Reuse existing theme tokens, spacing rhythm, and typography before introducing new one-off utility combinations.
- Match existing icon sizing and badge patterns in adjacent sections.
- Keep interactive behavior accessible: real links for navigation, real buttons for in-place actions.
