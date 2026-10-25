# THE YARN — DESIGN
Version 0.1. This file owns the visual intentions of the standalone interview app.

## Product thesis
A tiny, friendly mobile-first recording room for real people with real stories. It should feel like a yarn with a mate, never like a SaaS dashboard, formal personality test, or a pretend outback tourist attraction.

## Audience and context
Mat and Cozza, Mooka Boys miners from Andamooka, and Lee as interviewer/editor. Usually on a phone or tablet. One question at a time. Interaction is deliberately turn-based; nobody is rushed.

## Visual signature
A big, compressed, unmistakable THE YARN wordmark in the dark moss/iron panel, counterbalanced by warm paper and a simple bold red-clay microphone button. The only high-energy accent belongs to the actual recording interaction.

## Tokens
- Paper: #f6f0e6
- Deep paper: #eee5d6
- Ink: #2c261f
- Deep moss: #282c24
- Rust red: #cf6539
- Faded ochre: #e8ac54
- Muted copy: #77695d
- Borders: #d7cbb7
- Display type: Barlow Condensed bold/heavy, short and human
- UI copy: DM Sans, legible at practical sizes

CSS in src/styles.css is the current token owner; the variables at :root are normative runtime values.

## Layout
Desktop: editorial left identity panel, quiet right question and recording column. Mobile: the identity compresses into a short banner; question and microphone remain immediately accessible.

## Interaction rules
- One question visible at a time.
- Clear recording state, large touch targets, pause and stop.
- Never auto-advance while someone is still speaking.
- Show transcript for corrections before sending to the next question.
- Audio is the source of truth; transcript edits never overwrite the original.
- Show thinking and transcription states without large layout shifts.
- Question voice is optional and replayable; autoplay failure is recoverable.
- Text-only answer is a fallback, not a second-class mode.
- Keep finish/export safe when a recording is pending.
- No fake progress percentages, badges, gamification, corporate-looking tiles or confetti.

## Voice and content
Not every headline needs to be funny. The site is light and warm, with restrained humour. Don't fabricate Mat's or Cozza's actual catchphrases. The interviewer is transparent about being AI and a borrowed authorised voice.

## Accessibility
Readable contrast, semantic controls, visible focus, reduced motion, a microphone permission fallback and audio transcript correction. Mobile target >=44px, no horizontal scrolling.

## Privacy
A passcode-protected server API, no browser-exposed provider keys, no permanent audio storage. Interviewees review and export recordings before closing the tab.
