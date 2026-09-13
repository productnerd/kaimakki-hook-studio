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
