# vform

Одностраничный сайт DTF-студии. Первый экран использует статичное фото худи с референса.

## Локальный запуск

Требуется Node.js 22 или новее.

```sh
npm ci
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Для проверки и запуска production-сборки остановите dev-сервер и выполните:

```sh
npm run typecheck
npm run lint
npm run build
npm run start
```

## Где менять данные

| Файл | Назначение |
| --- | --- |
| `config/text.ts` | Заголовки, подписи, пункты меню |
| `config/portfolio.ts` | Фотографии с альтернативным текстом и подписи. `demo: true` включает пометку о демонстрационных образцах |
| `config/pricing.ts` | Цены изделий, печати и доставки, пороги скидок. Тариф доставки `null` означает, что его нужно уточнить |
| `config/contacts.ts` | Каналы связи и ссылка для CTA. Укажите `label`, `value` и реальный `href` для каждого канала. `primaryHref` переопределяет первый канал для кнопки заказа |
| `public/media/hoodie-hero.webp` | Фото худи на первом экране |
| `app/globals.css` | Цвета, типографика, композиция и адаптивность |

### Ассеты

- `tools/vform-hoodie.glb` — архивная 3D-модель vform.
- `tools/print-art.webp` — плоская графика для принта. Запрос ImageGen — серое лицо античной скульптуры в растре, два оранжевых штриха и логотип vform на чёрном.
- `public/media/fabric-macro.webp` — ImageGen. Запрос — макрофото складок чёрного трикотажа с оранжевым контровым светом и логотипом vform.
- `public/media/dtf-detail-black.webp` и `public/media/dtf-detail-canvas.webp` — иллюстрации деталей печати, созданные во встроенном ImageGen. Запросы приведены ниже.
- `public/media/work-shirt.webp` и `public/media/work-tote.webp` — демонстрационные фотографии ImageGen. Запрос — чёрная футболка с растровым принтом и светлая холщовая сумка с чёрно-оранжевой графикой.
- `public/media/hoodie-hero.webp` — вырезанная из предоставленного референса композиция худи. Запрос ImageGen — изолировать предмет, сохранив ракурс, принт и свет.

Скрипт сборки GLB нужен только для изменения геометрии или встроенного принта. Для него потребуются Python, Pillow и NumPy. После сборки можно снова сжать модель.

```sh
python tools/build_hoodie.py tools/print-art.webp
npx @gltf-transform/cli@4.5.1 meshopt tools/vform-hoodie.glb tools/vform-hoodie-opt.glb --level high
```

При необходимости замените архивную модель оптимизированным файлом.

<details>
<summary>Исходные запросы к встроенному ImageGen</summary>

**Макросъёмка ткани**

> Generate one landscape 3:2 photograph for a premium Russian DTF print studio website asset, no website UI. Extreme macro fashion campaign photography, soft rolling folds of heavyweight matte black cotton fleece lying diagonally. Deep blacks #080808, narrow dramatic soft saturated orange #FF5A1F raking light running diagonally along bottom and right edges of fabric ridges, dim neutral grey grazing highlight revealing microscopic knit texture. Top 35 percent nearly black with a very gradual fade to absolute black to blend into a dark webpage. In lower right, naturally printed on the fabric angled and distorted by its shape, a light gray bold italic modern grotesk wordmark reading exactly 'vform®', small enough to leave much fabric visible. Low camera angle, luxury moody studio commercial photography, subtle film grain, physically real fabric and depth, horizontal flowing landscape. No other text, no props, no colored accents other than orange, no framing.

**Графика принта**

> Create a flat isolated UV artwork for the back of this exact black hoodie in the reference image. Use the supplied screenshot only as visual reference for the design printed ON the back. Unwarp, reconstruct and reproduce it faithfully as a straight-on clean print layout on pure black with no garment, no folds, no lighting. Recreate placement, size and shapes: small silver grey italic 'vform®' at top center, distressed charcoal/grey coarse-halftone image of an antique stone man's head at a dramatic very low angle, his head turned slightly toward image right, the eye toward top left in shadow and the nose, open hollow nostril and lips on right, face and very heavily broken up vertical torn streaks melting into black, grayscale graphic. Large sharp burnt vivid orange starburst with a long point flying left from forehead above eye and tall thorn, one smaller point amidst the grayscale shadows on the left, big curved blade arch slash from center left below face to a sharp orange flare to the lower right of the mouth, a few tiny distressed orange lines. Black strongly dominates the image especially lower parts and left, grey halftone should be graphic textured, avoid the bright white full face and full head of hair look. No extra words. Portrait 2:3, the print should occupy most of this portrait with clear black around its irregular shape and faded sparse marks below.

**Примеры для портфолио**

> Generate one wide horizontal 3:2 editorial DTF printing sample contact sheet, a diptych with precisely two edge-to-edge independent photographs separated at the vertical center with no gap. Left half a close, almost full overhead shot of a folded very dark charcoal oversized black t-shirt on a near black concrete studio table, off-white grayscale halftone ornamental brutalist skater print with a few sharp orange accents centered on the garment, dramatic silver studio top lighting. Right half a close side-on oblique shot of a draped natural beige canvas tote, its dense visible fibers and a dark black and molten orange big abstract comb-stroke print prominent, near-black table, moody single light. Keep the visual contrast sophisticated and rich and make each half its own photographic composition. Deep near blacks, cream, silver, restrained saturated orange. No words, no logos, no captions or card borders. Premium contemporary fashion magazine photographs, real materials and textures.

**Фото худи**

> Edit the FIRST white/orange typographic Russian vform website reference screenshot (992x1586, ПЕЧАТАЕМ ИДЕИ): isolate ONLY the black floating hoodie with gray sculptural face graphic and orange rim lighting from the hero, preserving its exact orientation, diagonal pose, sculptural black fabric folds, print layout and silhouette. Remove the entire website around it including every text element outside the garment, orbit wire, hairlines, plus, background, and lower fabric photo. Tight but unclipped composition around the complete garment. Output as transparent RGBA subject for a web fallback, no backdrop or shadows outside the garment, no new objects or logos.

**Архивные образцы для портфолио**

Файлы: `public/media/work-eclipse-hoodie.webp` и `public/media/work-moth-longsleeve.webp`.

> Landscape 5:4 editorial product photograph for vform DTF printing studio portfolio, premium realistic macro fashion photography. Show the rear of a washed charcoal pullover hoodie, lying in soft irregular folds on black concrete; neckline and hood partly visible in top left, print centered and fully legible in central 58% of the image. Bold warm off-white and burnt orange distressed DTF graphic of two orbital paths around a large stippled eclipse, rough experimental screenprint texture with no text. Dramatic soft studio light and subtle orange rim light, visible dense brushed cotton, deep near blacks, off-white, accent #FF5A1F. No people, borders or watermarks.

> Portrait 4:5 editorial product photograph for vform DTF printing studio portfolio, same dark independent fashion studio lighting. Oblique detail shot of the back of an ivory heavyweight cotton long-sleeve laid on black concrete, softly rolled sleeve at the lower right, visible seams and natural fabric texture. Large black-and-burnt-orange DTF print featuring a geometric black moth formed with black xerox halftone and fine angular flight lines with restrained saturated orange. Center the artwork with room for cropping. Dramatic soft side light, cream cloth, deep charcoal background, accent #FF5A1F. Photorealistic, no people, no lettering, borders or watermarks.

**Футболки в карусели**

Первые два слайда используют оригиналы фото 1 и 2. Контуры футболок заданы через CSS. Файлы — `public/media/portfolio-tyson.jpg` и `public/media/portfolio-sorry-girls.jpg`.

Исходники — фото 3, 4 и 5. Фото 1 и 2 задали ракурс и освещение. Результаты встроенного ImageGen хранятся в `public/media/portfolio-camry.webp`, `public/media/portfolio-internet.webp` и `public/media/portfolio-love-you.webp`.

> undefined

> undefined

> undefined

**Иллюстрации для блока о DTF**

> Use case: photorealistic-product asset for vform DTF-print website. Landscape 3:2 macro photograph, frame filled by a real black heavyweight cotton T-shirt with a flat DTF print, crisp thin warm-white lines and a limited vivid burnt orange halftone fading through tiny discrete dots into black. Tight detail of ink/film boundary and cotton weave, one gentle fold to reveal surface, raking light from upper left, subtle orange rim light. A contemporary abstract orbital graphic partly cropped, no words, no numbers, no logos, no people, no borders. The print must look like a thin smooth bonded ink layer, no embroidery, no engraved texture. Near-black editorial color grade, realistic commercial textile photography. Composition centered for responsive crops.

> Use case: photorealistic-product asset for vform DTF-print website. Landscape 4:3 macro photograph, close detail of light cream tightly woven canvas tote cotton, only part of the bag and a neat stitched seam visible in foreground. A rich saturated orange and dense charcoal abstract sweeping DTF graphic crosses a shallow natural fold, print sharp and matte, no lettering or branding. Dark charcoal studio background on the edge of frame, white key and subtle orange edge light, textile fibers visible, realistic closeup print edge. Charcoal, ecru and burnt orange only. No hands, no objects, no borders, no watermark. Center the meeting of canvas and printed edges.

</details>
