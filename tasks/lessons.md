# Lessons

Corrections from Maria, and the rule I take from each.

## 2026-09-13: captions are a single block, not a sequence
Maria defined a caption as "a piece of text that is on top of a video edit". I built 5-8 line sequences.
The PDFs agreed with her (4-9 word blocks, 1-3 lines, on a box).
Rule: when the user defines a unit in one plain sentence, build exactly that unit. Do not upgrade it into a richer structure without asking. Re-read the definition before designing the output shape.

## 2026-09-13: no Cyprus / Greek assumptions in prompts or examples
I wrote "a Cyprus agency" into every prompt, added "if the brief is in Greek, write Greek", and used Limassol/Nicosia in every example brief. Clients are international.
Rule: the agency's location and language never go in a generation prompt or a demo brief. Only specifics the brief gives. Every prompt carries the line: never invent a location, currency, language, dialect or cultural reference not in the brief.

## 2026-09-13: apply the humanizer rules to all generated copy
Rule: every generator prompt (hooks, scripts, captions) carries the HUMANIZE block distilled from the humanizer skill. When writing copy by hand in chat, run the same rules before sending.

## 2026-09-14: "use these templates" means follow their format, and enforce it in code
The caption writer tagged each caption with a template and then ignored its shape ("Bro, (place) is not real" became "no chain could ever replicate this counter"). Asking nicely in the prompt was not enough.
Rule: when output must follow a user-supplied format, make the model return its structured choice (template id + blank fills), check fidelity in code (fixed words in order, calibrated against the source's own examples), and rebuild or drop anything that drifts. Template words override style rules like the humanizer.
