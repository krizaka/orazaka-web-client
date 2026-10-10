# Media credits

Every image under `public/media/` and every illustration of the public pages is our own work. No stock photo, no
third-party image, no generated image of a real product.

| File | What it is | Source | Author | Licence |
| :-- | :-- | :-- | :-- | :-- |
| `home/dashboard-{dark,light}.webp` | The workspace dashboard | Screenshot of this application (seed workspace, local stack), 1440×900 → 960 px WebP q55 | Krizaka | Apache-2.0, as this repository |
| `home/studios-{dark,light}.webp` | The Studios catalogue | Screenshot of this application, same process | Krizaka | Apache-2.0 |
| `home/packs-{dark,light}.webp` | The Packs page | Screenshot of this application, same process | Krizaka | Apache-2.0 |
| Isometric scenes (`src/features/landing/iso/`) | Servers, dome, nodes, cards | Original SVG drawn in code | Krizaka | Apache-2.0 |
| Icons | `@krizaka/icons` | npm, Krizaka | Krizaka | Apache-2.0 |
| `favicon.svg`, `logo.svg` | The Orazaka mark | Rendered from `OrazakaLogo` of `@krizaka/ui` | Krizaka | Apache-2.0 |

To refresh the captures: run the stack, sign in with the seed account, capture the three pages at 1440×900 in each
theme, and encode them at 960 px wide (WebP, quality 55). Each file stays under 20 kB: the pages show them blurred.
