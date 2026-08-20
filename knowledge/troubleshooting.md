# Basic Troubleshooting

Sources: VONROC VPower 20V product pages (see `products/`) — general
battery/motor troubleshooting logic is standard cordless-tool practice
applied to the confirmed specs of the CD510DC, CD511DC and RH501DC.
Retrieved: 2026-08-20

This demo's knowledge base covers three products in detail:
`products/CD510DC.md` (cordless drill), `products/CD511DC.md` (PRO
cordless drill, brushless), and `products/RH501DC.md` (rotary hammer). For
any other VONROC product, do not guess — say the specific manual isn't in
this demo's knowledge base and offer to escalate.

## "It's not suitable for concrete" is not a defect

The CD510DC and CD511DC are explicitly **not suitable for drilling
concrete**. If a customer says their cordless drill "won't drill into
concrete/brick" or "the bit just bounces off the wall", this is expected
behavior, not a fault — recommend the RH501DC rotary hammer, which is
rated for up to 10 mm in concrete via its SDS-plus chuck and hammer
function. Do not treat this as a warranty issue.

## Tool stops running shortly after starting

1. Check the battery is fully charged — try charging it fully before
   testing again.
2. If available, test with a different, known-good VPower 20V battery
   (2.0Ah or 4.0Ah — they are interchangeable across VPower 20V tools) to
   isolate whether the battery or the tool is at fault.
3. Check whether the tool becomes unusually hot during the short period it
   runs — this can indicate overload or a fault.
4. Check for visible damage, unusual smells, or debris blocking
   ventilation slots.
5. Confirm the tool is being used within its rated capacity — see the
   relevant product file in `products/` for max drilling capacity in
   wood/metal/concrete. Using a drill beyond its rated capacity (e.g.
   forcing a CD510DC through material that needs the RH501DC) can trip
   overload protection or damage the tool; this is a usage mismatch, not
   automatically a defect.

If the issue continues after these checks and the tool is being used
within its rated capacity, this may indicate a product defect and should
be escalated to a human colleague for assessment.

## Tool does not turn on at all

1. Confirm the battery is inserted fully and charged.
2. Check the on/off switch (and any safety lock button on the model) are
   being operated as described in the product's manual.
3. Try a different VPower 20V battery if one is available.

If the tool still does not turn on, escalate for assessment.

## Reduced runtime or power

1. Confirm the battery is fully charged and not old/heavily used —
   batteries degrade over time with normal use, this alone is not a
   defect.
2. Check the application isn't more demanding than the tool/battery combo
   is rated for (see the relevant `products/*.md` spec table).

## Safety-related symptoms — stop immediately

If a customer reports **smoke, sparks, a burning smell, visible melting,
or electric shock**, advise them to stop using the product immediately,
and remove the battery if it is safe to do so. Do not suggest opening,
disassembling, or repairing the tool — per `warranty.md`, opening the
product also voids the warranty. Escalate immediately with high urgency.
