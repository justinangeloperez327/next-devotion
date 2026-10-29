# Next Devotion interface

The interface follows a calm Scripture journal direction with familiar community interactions. All public and authenticated screens use the same semantic color tokens and compact rectangular controls.

## Appearance

- Light: neutral off-white page, white cards, charcoal text, bronze accents.
- Dark: charcoal page, distinct raised surfaces, soft-white text, muted gold accents.
- System is the initial preference. Light and Dark override the device preference.
- The selected preference is stored under `next-devotion-theme` in this browser, not in the account or database. Changing it synchronizes other tabs on the same origin.
- A small fixed script in the document head applies the saved theme before client hydration. The provider follows operating-system changes when System is selected.
- If browser storage is blocked, switching works for the current document; persistence cannot be guaranteed.
- Without JavaScript, the interface uses the default light palette and registration remains usable.

Theme controls appear in public, authentication, and app headers, with an additional appearance control in Settings. The mobile control uses a native select over an icon; keyboard focus remains visible.

## Reading and interactions

Scripture uses a restrained serif stack. Body text and controls use system sans-serif fonts, with no font download dependency. Body reading text is 16px with comfortable line spacing. Common buttons have 44px targets and small corners.

Feed, journal, saved, and profile cards show bounded text previews with an explicit Read devotion link. Detail pages render complete Scripture, observation, application, and prayer. Author text wraps rather than overflowing. Amen, Comments, and Save keep labels on small screens. Failed Amen/Save interactions restore their previous state and show retry guidance.

The SOAP editor keeps writing and visibility controls together; its secondary preview appears on wide screens. Comments have a visible label, retain text on an error, clear on success, and report pending/success/error states. Deletion remains behind explicit confirmation. Existing authentication, authorization, and privacy rules are unchanged.

Contact has an honest unavailable state with working navigation, rather than an unusable form. No contact delivery service is implied.

## Verification

Unit checks cover bootstrap fallback, preference parsing, Unicode preview bounds, and WCAG AA contrast for the main text/accent/status combinations in both palettes. Browser checks cover saved/system themes, blocked storage, cross-tab changes, pre-hydration theme application, 320px layout, public pages, and authenticated routes in both themes. The authentication lifecycle creates a long devotion, verifies full text versus feed excerpts, posts and deletes a comment, and deletes the test devotion.

Successful browser runs upload homepage, registration, and devotion screenshots in both themes; failures include traces and screenshots. Automatic Vercel deployment remains disabled. Manual Vercel builds still apply committed migrations before building.
