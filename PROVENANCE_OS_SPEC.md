# PROVENANCE OS — PHASE 2: THE ANDAMOOKA PROOF
## FROM THEORY TO BUILD SPECIFICATION

==================================================
PART 1 — DEFINE THE DEMONSTRATOR
==================================================
**The First Screen (Initial Load):**
- **Screen Composition:** A cinematic, edge-to-edge dark canvas (Illuminated Grit aesthetic).
- **Anchor:** The Fire of the Basin (Andamooka Opal) sits dead center, softly illuminated, casting a faint volumetric shadow. It appears physical, tangible, and high-value.
- **Orbit:** Minimalist UI chrome hugging the absolute edges of the screen. No visible bounding boxes.
- **Typography Hierarchy:** 
  - H1 (Serif): "The Fire of the Basin" (Elegant, authoritative)
  - H2 (Sans): "Andamooka Matrix Opal / 24.5ct"
  - Microcopy (Mono): Coordinates, extraction date.
- **Available Actions:** The five primitives exist as subtle, non-intrusive interactive zones or minimal icons around the perimeter.
- **Persistent Commerce:** The ACQUIRE primitive ($45,000) is persistently visible but aesthetically integrated (e.g., bottom right corner), never obscuring the stone.
- **Provenance Indicators:** A subtle timeline hashmark at the bottom (TRACE), a minimalist relationship node map icon (PIVOT), an evidence shield (VERIFY).

*Objective:* The user feels they are in a secure viewing room examining a world-class artifact, not browsing an e-commerce grid.

==================================================
PART 2 — THE SINGLE ANCHOR
==================================================
**THE FIRE OF THE BASIN**

*OBJECT*
- **Name:** The Fire of the Basin
- **Type:** Treated Andamooka Matrix Opal
- **Carat:** 24.5ct
- **Dimensions:** 22mm x 18mm x 8mm
- **Treatment:** Traditional Sugar/Acid Carbonization
- **Condition:** Polished Cabochon, pristine
- **Current State:** Finished Gem
- **Asking Price:** $45,000 AUD

*PROVENANCE*
- **Miner:** Cozza (Colin)
- **Claim:** Hard Hill, Andamooka
- **Location:** 30°26'S 137°09'E
- **Extraction Date:** 14 June 2023
- **Extraction Event:** Blasting Event #402

*GEMMOLOGY*
- **Base Tone:** N1 (Black)
- **Brightness:** B4 (Very Bright)
- **Play-of-Colour:** Harlequin pattern, dominant red/orange, secondary green/blue
- **Matrix Characteristics:** Dense limestone matrix, complete carbon penetration

*MEDIA*
- **Hero Photograph:** High-res studio shot, dark background.
- **Macro Photograph:** 10x magnification showing carbon pores and color flash.
- **Natural-Light Video:** 360-degree rotation (simulated via image sequence).
- **Rough-State Photograph:** Chalky, pale matrix before treatment.
- **Extraction Photograph:** Cozza holding the rough dirt clod in the mine.

*EVIDENCE*
- **Mining Record:** Signed claim ledger extract.
- **Treatment Record:** Lapidary log book entry.
- **Gemmological Report:** Independent grading certificate.

==================================================
PART 3 — DEFINE THE GRAPH
==================================================
*NODES*
- `obj_01`: [Type: Opal] "The Fire of the Basin"
- `per_01`: [Type: Person] "Cozza"
- `loc_01`: [Type: Place] "Hard Hill, Andamooka"
- `evt_01`: [Type: Event] "Extraction #402"
- `stt_01`: [Type: State] "Rough Matrix" (Temporal)
- `doc_01`: [Type: Evidence] "Lapidary Log"
- `doc_02`: [Type: Evidence] "Claim Ledger"

*EDGES*
- `obj_01` --[EXTRACTED_BY]--> `per_01` (Pivot)
- `obj_01` --[EXTRACTED_AT]--> `loc_01` (Pivot)
- `obj_01` --[RESULT_OF]--> `evt_01` (Pivot)
- `obj_01` --[PREVIOUS_STATE]--> `stt_01` (Trace)
- `evt_01` --[EVIDENCED_BY]--> `doc_02` (Verify)
- `stt_01` --[EVIDENCED_BY]--> `doc_01` (Verify)

==================================================
PART 4 — DESIGN FOCUS
==================================================
*Interaction:* Scrolling down (desktop) or dragging up (mobile) physically brings the stone closer to the lens.
*Levels:*
- **FOCUS 0 (SURFACE):** 
  - Visual: The whole stone, perfectly lit.
  - Info: Name, carat, price, basic origin.
- **FOCUS 1 (INSPECT):** 
  - Visual: The stone scales up 150%. 
  - Info: Gemological data appears (Brightness B4, Tone N1). Text locks to the sides.
- **FOCUS 2 (MICRO):** 
  - Visual: The stone scales to 300%. We see the macro texture (carbon pores).
  - Info: Deep scientific grading, matrix density, treatment specifics.

*Rule:* The Anchor (The Opal) never changes. Information fades in/out based on proximity.

==================================================
PART 5 — DESIGN PIVOT
==================================================
*Interaction:* Tapping a relationship node in the Orbit (e.g., "Mined by Cozza").
*Action:*
1. The Opal smoothly slides to the left periphery, reducing in opacity but remaining visible (preserving state).
2. The new Anchor (e.g., Portrait of Cozza) slides in from the right to take center stage.
3. The Orbit UI updates to show Cozza's context (his history, other stones he's found).
*Return:* A "Back to The Fire of the Basin" indicator remains persistently attached to the left-side faded Opal. Tapping it reverses the animation perfectly.

==================================================
PART 6 — DESIGN TRACE
==================================================
*Interaction:* A horizontal timeline scrubber or lateral swipe.
*Action:*
- **State 3 (Current):** Polished Cabochon.
- **State 2 (Rough/Extracted):** Sweeping left crossfades the image to the pale, chalky rough matrix. The metadata instantly updates to reflect its pre-treatment state.
- **State 1 (In-Situ):** Sweeping left again reveals the stone embedded in the dirt wall.
*Rule:* The spatial position of the object does not change. We are looking at the exact same Anchor, just at a different point in time. 

==================================================
PART 7 — DESIGN VERIFY
==================================================
*Interaction:* Tapping the "Shield/Evidence" icon attached to a specific claim.
*Action:*
- The Anchor (Opal) dims and scales down slightly.
- A high-resolution scan of documentary evidence (e.g., the Lapidary Log) slides up over the lower half of the screen, like laying a physical certificate on a glass table.
- A cryptographic hash or verification badge is stamped in the corner.
*Rule:* VERIFY does not navigate away. It temporarily overlays evidence on top of the current Anchor.

==================================================
PART 8 — DESIGN ACQUIRE
==================================================
*Interaction:* Tapping the persistent Price/Acquire button.
*Action:*
- Available at any FOCUS, TRACE, or PIVOT level (if the Anchor is for sale).
- When tapped, the Anchor shifts to the left, and a minimalist, high-trust checkout pane slides in from the right. 
- The provenance graph is explicitly summarized in the checkout: "You are acquiring [Opal] + [Provenance Record] + [Digital Certificate]".
*Rule:* The checkout is an extension of the viewing room, not a redirect to Shopify.

==================================================
PART 9 — STATE MACHINE
==================================================
```javascript
{
  anchorId: "obj_01",
  anchorType: "OPAL",
  focusLevel: 0, // 0, 1, 2
  temporalState: "CURRENT", // IN_SITU, ROUGH, CURRENT
  verifyActive: null, // doc_id or null
  checkoutActive: false,
  anchorStack: [] // History for PIVOT back
}
```
*Sequence Example:*
1. `OPEN`: State = { anchor: Opal, focus: 0 }
2. `FOCUS`: State = { anchor: Opal, focus: 1 }
3. `TRACE`: State = { anchor: Opal, focus: 1, temporal: ROUGH }
4. `PIVOT(Cozza)`: State = { anchor: Cozza, focus: 0, temporal: CURRENT, anchorStack: [{Opal, focus:1, temporal:ROUGH}] }
5. `BACK`: State pops from stack. Exact previous state (Opal, focus 1, rough) is restored.

==================================================
PART 10 — VISUAL SYSTEM
==================================================
*Aesthetic:* ILLUMINATED GRIT.
*Typography:* 
- Headings: Playfair Display or similar high-contrast serif.
- Data/Micro: JetBrains Mono or similar technical monospace.
*Color Philosophy:* True black backgrounds (#050505). Text is off-white (#EAEAEA). Accent colors are drawn directly from the opal's play-of-color (e.g., subtle neon red or cyan for interactive highlights).
*Imagery:* Hyper-sharp. No clipping paths; deep shadows should melt into the background.
*Negative Space:* Massive. 70% of the screen should be empty to force focus on the object.

==================================================
PART 11 — MOTION LANGUAGE
==================================================
- **FOCUS:** Z-axis scaling. Cubic bezier easing (0.25, 1, 0.5, 1). Slow, deliberate.
- **PIVOT:** X-axis translation. The current Anchor moves -30vw, the new Anchor enters from +30vw.
- **TRACE:** Crossfade / Opacity blend. Instantaneous data swap, 400ms image fade.
- **VERIFY:** Y-axis translation. Slides up from the bottom (like a physical drawer).
- **ACQUIRE:** Right-side drawer slide.

==================================================
PART 12 — MOBILE
==================================================
- **FOCUS:** Vertical scroll. (Scroll down = zoom in).
- **TRACE:** Horizontal swipe on the object itself.
- **PIVOT:** Tapping contextual pills below the object.
- **VERIFY:** Bottom sheet modal.
- **ACQUIRE:** Sticky bottom bar.
*Rule:* One hand, thumb-only navigation. No pinch-to-zoom required for semantic Focus (pinch can be reserved for native image zooming, separate from semantic focus).

==================================================
PART 13 — TECHNICAL IMPLEMENTATION
==================================================
*Stack:* React, Vite, Tailwind CSS, Framer Motion, Zustand.
*Architecture:*
- No backend required for V1.
- All graph data and state represented in a static `graph.json`.
- `Zustand` manages the global state machine (Anchor, Focus, Time, Stack).
- `Framer Motion` handles the physical transitions (AnimatePresence for Pivot, layout animations for Focus).
- Use high-res images and CSS `mix-blend-mode: screen` or `lighten` to blend opal photos into the dark background.

==================================================
PART 14 — FILE STRUCTURE
==================================================
```text
/src
  /assets
    /media (opal images, cozza, docs)
  /data
    graph.json (The exact nodes and edges)
  /store
    useProvenanceStore.ts (Zustand state machine)
  /components
    /primitives
      Focus.tsx
      Pivot.tsx
      Trace.tsx
      Verify.tsx
      Acquire.tsx
    /canvas
      AnchorRenderer.tsx (Renders the current anchor)
      OrbitRenderer.tsx (Renders UI around it)
    App.tsx
```

==================================================
PART 15 — THE DEMONSTRATION SCRIPT (180s)
==================================================
1. **[0:00] BEAUTY:** Screen loads. Dead center is the glowing opal. (Founder: "This is the Fire of the Basin. Look at it.")
2. **[0:30] FOCUS:** User scrolls. The opal physically enlarges. Scientific data fades in. (Founder: "As we look closer, the gemmology reveals itself. It's a B4 brightness.")
3. **[1:00] TRACE:** User swipes the timeline. The stone turns to white chalky rough. (Founder: "But this is what it looked like the day it was found.")
4. **[1:20] PIVOT:** User taps "Mined by Cozza". Opal slides left, Cozza's portrait slides center. (Founder: "Who found it? Cozza. Hard Hill claim.")
5. **[1:40] VERIFY:** User taps the mining ledger. A scan slides up. (Founder: "And here is the exact ledger entry from that day.")
6. **[2:10] BACK:** User hits back. We are instantly back at the rough opal.
7. **[2:30] ACQUIRE:** User taps Acquire. (Founder: "When you buy this, you don't just buy a stone. You acquire the entire cryptographic history. You own the provenance.")

==================================================
PART 16 — SUCCESS / FAILURE TEST
==================================================
*Pass Thresholds (High-Value Buyers):*
- 90% can naturally discover FOCUS (by scrolling).
- 80% successfully PIVOT to the miner and return without asking how.
- 100% understand that the rough stone and polished stone are the same object.
- Perceived Value increases: The user guesses the price is *higher* than $45,000 after exploring the provenance.

==================================================
PART 17 — ADVERSARIAL FAILURE TEST
==================================================
- **Risk:** Motion Sickness / Fatigue.
  - *Signal:* Users complaining about too much sliding.
  - *Mitigation:* Keep transitions under 500ms. Ensure easing is extremely smooth.
- **Risk:** Missing the Shop.
  - *Signal:* Users think it's a museum exhibit and don't realize they can buy it.
  - *Mitigation:* ACQUIRE must look actionable and persist across all states.
- **Risk:** Data Overload.
  - *Signal:* Users ignore the text.
  - *Mitigation:* Ruthlessly cull text. Rely on visual evidence.

==================================================
PART 18 — WHAT WE SHOULD NOT BUILD (V1)
==================================================
- NO WebGL 3D models of the opal (high-res 2D is better for V1 than a bad 3D scan).
- NO user authentication or accounts.
- NO shopping cart (Acquire = direct checkout for a single high-value item).
- NO blockchain integration (simulate the cryptographic proof visually).
- NO backend database (hardcode the JSON graph).

==================================================
PART 19 — THE INVESTOR QUESTION
==================================================
*Question:* "If this is just React + graph data + animation, why should I care?"
*Honest Answer:* "Technically, it is a UI layer over a graph database. Commercially, it is a trust engine."
*Powerful Answer:* "E-commerce commoditizes objects by placing them in grids. Provenance OS singularizes them. By changing the interaction model from 'browsing a catalogue' to 'interrogating an artifact', we mathematically increase the perceived value and trust of the asset. The software is the moat because we define the standard for how high-value provenance is experienced."

==================================================
PART 20 — FINAL BUILD BLUEPRINT
==================================================
**A.** Product: Provenance OS Andamooka Demonstrator.
**B-E.** Ontology, Graph, Primitives, State Machine as defined above.
**F.** Architecture: Single-page React application, no routing (all state is managed via Zustand store reflecting graph traversal).
**G-J.** Interaction, Visual, Motion, Mobile as defined above.
**K.** Stack: React + Vite + Tailwind + Framer Motion + Zustand.
**L-M.** File/Data structure mapping directly to the 5 primitives.
**N-R.** Scope: Build ONLY the Andamooka Proof. One opal, one graph. Validate the interaction grammar before building the platform.
