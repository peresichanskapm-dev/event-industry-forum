# Playbook: building sites like this one

Distilled from building EIF27 (event-industry-forum). Applies to any similar one-page
marketing/event site: Next.js + TypeScript + SCSS Modules, content-heavy, Figma-driven,
deployed to a shared VPS via PM2 + nginx.

## Stack

- Next.js (App Router) + React + TypeScript
- SCSS Modules (`Component.module.scss`), no CSS-in-JS, no Tailwind
- `next/image` for all raster images
- No global state library — `sessionStorage` + `CustomEvent` for cross-component signals
  (see `lib/leadSource.ts`) is enough for a page this size

## File structure per section

Every home-page section is a folder under `components/home/<Name>/`:

```
<Name>.tsx           — component, thin, maps over data
<Name>.module.scss    — styles, mobile-first
<Name>.data.ts         — copy + content, exported as a typed const
```

Keep copy and structural data OUT of the component. If a marketer needs to change a
sentence or add a card, they should only ever touch `.data.ts`.

## Styling rules

- **rem base is 10px**, not 16px. `1.6rem = 16px`. Every size in this codebase assumes that.
- **Mobile-first.** Base rule = mobile. Override inside `@media (min-width: 992px)` for
  desktop. Never the reverse — it inverts the cascade and causes exactly the kind of
  "why did desktop break" bugs we hit repeatedly.
- **Brand gradient is centralized.** One `--brand-gradient` var built from
  `--brand-gradient-stops` + local `--brand-gradient-angle/size/position` overrides declared
  per-element. Any new gradient text/element reuses the same stops, just retunes
  angle/size/position locally. Don't hardcode new gradient color values.
- **Don't add comments explaining what a rule does.** Only note *why*, and only when it's
  non-obvious (see the `data-reveal` warning below — that comment earns its place).

## Hard-won gotchas (don't rediscover these)

1. **`position: fixed` breaks inside any ancestor with `backdrop-filter`, `transform`, or
   `filter`.** Both create a new containing block, so the "fixed" element becomes relative
   to that ancestor instead of the viewport. This bit us twice: once with a blurred header
   background breaking a fixed mobile menu, once with `ScrollReveal`'s inline `transform`
   breaking a fixed edit-mode overlay. Fix: `createPortal(node, document.body)` for anything
   that must be truly viewport-fixed and might end up under a blurred/transformed ancestor.

2. **`ScrollReveal` (`components/ui/ScrollReveal/`) permanently sets `element.style.transform`
   and `element.style.opacity` on any `[data-reveal]` element**, once, when it scrolls into
   view, and never removes it. Two consequences:
   - Never put `data-reveal` on an element that is also an *ancestor* of something you need
     to keep truly `position: fixed` (see #1) — move the attribute down to the leaf, or split
     into an outer element (gets `data-reveal`) and an inner element (gets your own
     `transform`, e.g. rotation) so the two systems don't fight over the same CSS property.
   - If you need to animate opacity/transform on a `data-reveal` element yourself later,
     you're fighting inline styles set by React/JS elsewhere — inline always wins, so don't
     rely on a stylesheet rule to override it.

3. **`next/image`'s optimizer caches by URL, not by file content.** If you regenerate an
   image and re-save it under the *same* filename, the browser (and Next's own
   `.next/cache/images`) will keep serving the old bytes indefinitely — no amount of
   `Ctrl+Shift+R` reliably fixes it once poisoned. **Always bump the filename** (`photo.webp`
   → `photo-v2.webp`) when replacing an image during iteration, and update the data file to
   match. Cheap, always works, no cache-busting query strings needed.

4. **Don't `Image.open(...).convert('RGB')` blindly on a PNG that has alpha.** Figma exports
   routinely have transparent padding/rounded corners with `(0,0,0,0)` underneath — dropping
   alpha without compositing turns that transparency into a solid black bar. Check the mode
   first; either keep RGBA (webp supports alpha) or crop the transparent region off before
   converting.

5. **Figma card exports often bake in a decorative badge/icon at a size that has nothing to
   do with the site's real CSS icon.** Don't assume the site's small `.icon` overlay will
   visually cover a badge baked into the source photo — measure it. If a source image has
   junk you don't want (an oversized preview badge, a rounded-corner mask strip), the
   reliable fix is almost always to **crop it out at the source**, not to patch over it with
   `cv2.inpaint` or a mirrored patch — inpainting a large area over a detailed photo (crowd,
   text, logos) reads as visible smudging or duplicated content no matter how careful the mask.

6. **`?edit=1` visual tuning tool** (`components/ui/DevEditablePhoto/`): wraps any element,
   lets you drag/resize/rotate it live in the browser, and a **Copy CSS** button gives you
   `top/left/width/height/transform: rotate()` in rem, ready to paste into the SCSS rule. Use
   this instead of guessing pixel values by eye when a client wants to hand-place a photo or
   video. It positions `position: absolute` relative to the element's own `offsetParent` (not
   viewport-fixed) — that's what makes it work correctly for elements anywhere on a long page,
   not just near the top.

## Fonts

- Verify Cyrillic glyph coverage (Ukrainian needs Ґ/Є/І/Ї specifically) with `fontTools`
  before committing to a custom font:
  ```python
  from fontTools.ttLib import TTFont
  cmap = TTFont(path).getBestCmap()
  ```
- Always stack a real, fully-loaded fallback behind a custom font
  (`--font-heading: var(--font-custom), var(--font-fallback), sans-serif`), and declare the
  alias on `body` — `next/font` variables are scoped to whatever element carries the
  `.variable` className, and CSS vars don't cascade upward from child to ancestor.

## Deploy (VPS, shared box, PM2 + nginx)

This box hosts many unrelated sites. Standard layout:

- Code lives in `/var/www/<project>/`
- Process manager is **PM2** (`pm2 list` to see everything running, ports are usually baked
  into the `pm2 start` command as `next start -p <port>`)
- **`node`/`npm`/`pm2` are installed via `nvm`, not on the default `PATH`** for a fresh SSH
  shell. Every remote command needs `source ~/.nvm/nvm.sh &&` first.
- Firewall is `ufw`, default-deny — a new port needs an explicit
  `ufw allow <port>/tcp` (and the nginx site needs `Nginx Full` if fronted by nginx).
- nginx reverse-proxies a domain to `127.0.0.1:<port>`. SSL certs are Certbot-managed
  (`/etc/letsencrypt/live/<domain>/`), independent of the backend port — pointing a domain at
  a new app is just editing `proxy_pass` in `/etc/nginx/sites-available/<domain>` and
  `systemctl reload nginx`. **Always back up the config file before editing it** and leave the
  old backend process running untouched — switching a domain over should be a one-line,
  instantly-revertible change, never a delete.

Standard update cycle once a project is git-tracked on the server:

```bash
cd /var/www/<project> && git pull origin main
source ~/.nvm/nvm.sh && nvm use 20
npm install       # only needed if package.json changed
npm run build
pm2 restart <pm2-process-name>
```

`.env` on the server is never committed — it's created once by hand (or SFTP'd up) and
survives `git pull` because it's gitignored and untracked.

## Content/asset pipeline notes

- Figma exports are reference mockups more often than they're final assets — check whether a
  PNG is meant to be dropped in as-is or is just showing you a layout/spec to replicate in
  code (this comes up constantly: card structure SVGs, icon badges, gradient panels).
- Convert everything to **WebP** on the way in (quality ~85 is indistinguishable from PNG at
  these dimensions and is a fraction of the size).
- When given several similarly-named source files with no identifying names, **view each one
  before assigning it to a named person/place/thing** — never guess identity from a filename
  alone, especially for photos of real people.
