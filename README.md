# Collapse Aware AI™ — Decision Lab

Buyer-safe interactive demonstrator of Governed Retained-State Selection.

Decision Lab demonstrates:

- Same present condition.
- Same permitted candidate actions.
- Different retained history.
- Governed selection difference.
- Retained-state influence disabled.
- Reference comparison.
- Deterministic replay.
- Buyer-safe Decision Record.

This repository contains controlled demonstration fixtures only. It does not contain or execute the proprietary Collapse Aware AI™ Core Gold runtime, private scoring logic, production thresholds or protected schemas.

## LOCAL

1. Clone or download the repository.
2. Open index.html in a modern browser.
3. No server or API key is required.

## GITHUB PAGES

1. Push the files to the repository's main branch.
2. Open GitHub repository Settings.
3. Select Pages.
4. Under Build and deployment choose "Deploy from a branch".
5. Select branch: main.
6. Select folder: / (root).
7. Save.
8. Wait for GitHub Pages to deploy.
9. Open the HTTPS address GitHub provides.

## UPDATES

1. Edit the files.
2. Commit changes to main.
3. GitHub Pages automatically republishes the latest version.

## Explore the lab

Choose a scenario and run History A. Switch to History B and run again. Expand the comparison to see both governed conditions together. Turn retained-state influence OFF to return to the fixed reference action. Replay preserves the original decision, run identifier and timestamp, and reports whether every deterministic result field matches.

Changing any input clears the previous selection and record. Changing the scenario also restores History A, influence ON and a collapsed comparison. Comparison always shows both influence-ON fixtures alongside their shared influence-OFF reference. When influence is OFF, the central governed result is explicitly labelled as comparison only; it is not applied to the selected result.

| Scenario | History A / ON | History B / ON | Either history / OFF |
| --- | --- | --- | --- |
| Collections / Customer Vulnerability | A — Send standard reminder | D — Escalate for human review | B — Offer payment arrangement |
| Insurance / Claims Review | A — Continue normal processing | C — Refer for specialist review | B — Request supporting evidence |
| Stateful AI Agent | A — Respond directly | C — Ask for clarification | B — Use authorised tool |

## Implementation and privacy

The published application is HTML, CSS and vanilla JavaScript. Fixture data is embedded in `app.js`; no local JSON loading or network connection is required. There are no external scripts, fonts, analytics, cookies, telemetry, browser storage, forms or provider calls. The site does not identify visitors. Demo fingerprints are static public fixture labels, not cryptographic attestations. A sequential run ID and local browser timestamp describe the current page session only and do not affect selection.

All asset paths are relative, supporting both `file://` and GitHub Pages project subdirectories. No build step, package installation or runtime dependencies are required. JavaScript must be enabled for the lab controls.

## Accessibility

Scenario tabs support Left/Right Arrow, Home and End keys. History buttons, influence switch, run/replay controls and the disclosure work with a keyboard. Changes announce through live status regions. Focus rings, semantic landmarks, text labels and responsive layouts are provided. Decorative motion follows `prefers-reduced-motion`. Native print styling supports the current Decision Record and expanded comparison.

## Contact

The CTA opens the visitor's mail application with the fixed subject **Retained-State Decision Review** and the supplied introductory body. The selectable address and Copy Email control offer a fallback. If clipboard access is unavailable, a local copy fallback is attempted; if it is also unavailable, the address is selected and manual-copy guidance appears. No message is sent by the page.

## Scope of the demonstration

Decision Lab uses controlled deterministic demonstration cases to explain the CAAI selection boundary. It is not a Core Gold execution environment and should not be treated as runtime evidence.

The demonstrator illustrates product behaviour and evaluation concepts. Buyer-specific technical evaluation is performed separately under an agreed scope.
