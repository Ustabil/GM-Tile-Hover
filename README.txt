GM Tile Hover (local test module, Foundry VTT v14)

Installation:
1. Stop Foundry.
2. Extract gm-tile-hover/ into <Foundry User Data>/Data/modules/.
3. Restart Foundry; in your world, enable 'GM Tile Hover' under Manage Modules.
4. Disable the older GM Tile Hover hotbar macro to avoid duplicate tooltips.
5. Hover a tile with GM Notes on a GM client. Use Configure Settings > Module Settings > GM Tile Hover to toggle it.

Notes:
- Requires GM Notes to populate the gm-notes.notes flag on tiles.
- Does not depend on Monk's or Token Note Hover.
- Uses rectangular bounds and does not account for rotated tiles.
- HTML is read from your own GM-authored notes; don't paste untrusted HTML.
- This module hasn't been tested against a live Foundry v14 instance. Try it on a test scene first.
