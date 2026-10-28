const MODULE_ID = "gm-tile-hover";
const FLAG_SCOPE = "gm-notes";
const FLAG_KEY = "notes";
let tooltip = null;
let activeTileKey = null;

function hide() {
  if (tooltip) tooltip.hidden = true;
  activeTileKey = null;
}

function getCanvasElement() {
  return canvas?.app?.renderer?.canvas ?? canvas?.app?.view ?? null;
}

function hoveredTile() {
  if (!canvas?.ready) return null;
  const pos = canvas.mousePosition;
  if (!pos) return null;
  const tiles = [...(canvas.tiles?.placeables ?? [])].reverse();
  for (const tile of tiles) {
    const doc = tile.document;
    const notes = doc?.getFlag(FLAG_SCOPE, FLAG_KEY);
    if (typeof notes !== "string" || !notes.trim()) continue;
    // Matches the original working macro: rectangular, unrotated tiles.
    if (pos.x >= doc.x && pos.x <= doc.x + doc.width &&
        pos.y >= doc.y && pos.y <= doc.y + doc.height) {
      return {tile, notes};
    }
  }
  return null;
}

function onPointerMove(ev) {
  if (!game.user?.isGM || !game.settings.get(MODULE_ID, "enabled")) return hide();
  const view = getCanvasElement();
  if (!view?.contains(ev.target)) return hide();
  const match = hoveredTile();
  if (!match) return hide();

  const key = `${canvas.scene?.id}:${match.tile.id}`;
  if (activeTileKey !== key) {
    tooltip.replaceChildren();
    const heading = document.createElement("strong");
    heading.textContent = match.tile.document.name || "GM Notes";
    tooltip.appendChild(heading);
    tooltip.appendChild(document.createElement("hr"));
    const body = document.createElement("div");
    body.className = "gm-tile-hover-body";
    // GM-authored HTML stored by GM Notes, as in the proven macro.
    body.innerHTML = match.notes;
    tooltip.appendChild(body);
    activeTileKey = key;
    tooltip.hidden = false;
  }

  const rect = tooltip.getBoundingClientRect();
  const margin = 8;
  const offset = 18;
  let left = ev.clientX + offset;
  let top = ev.clientY + offset;
  if (left + rect.width > window.innerWidth - margin) left = ev.clientX - rect.width - offset;
  if (top + rect.height > window.innerHeight - margin) top = ev.clientY - rect.height - offset;
  tooltip.style.left = `${Math.max(margin, left)}px`;
  tooltip.style.top = `${Math.max(margin, top)}px`;
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "enabled", {
    name: "Enable GM tile hover",
    hint: "Display HTML from GM Notes when the GM hovers over a tile.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => hide()
  });
});

Hooks.once("ready", () => {
  if (!game.user.isGM) return;
  tooltip = document.createElement("div");
  tooltip.id = "gm-tile-hover-tooltip";
  tooltip.hidden = true;
  document.body.appendChild(tooltip);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("blur", hide);
  Hooks.on("canvasReady", hide);
  Hooks.on("canvasTearDown", hide);
});
