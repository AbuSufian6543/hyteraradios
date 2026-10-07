/**
 * Converts the supplied Hytera photos to WebP and writes them to
 * public/products/{slug}.webp. Only products with a clear model match
 * are included. Re-run locally when the source folders change.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const accessories = "C:\\Users\\abu\\Desktop\\MouseWithoutBorders\\HYTERA ACCESSORIES";
const radios = "C:\\Users\\abu\\Desktop\\MouseWithoutBorders\\HYTERAWEBSITEP IMAGES";

/** @type {{ src: string, slugs: string[] }[]} */
const photos = [
  { src: path.join(radios, "BD502i DMR.png"), slugs: ["hytera-bd502i-business-radio"] },
  { src: path.join(radios, "BD552i.png"), slugs: ["hytera-bd552i-business-radio"] },
  { src: path.join(radios, "BD612i.png"), slugs: ["hytera-bd612i-business-radio"] },
  {
    src: path.join(radios, "BP2403.png"),
    slugs: ["hytera-bp2403-battery", "bp2403-li-po-battery-pack"],
  },
  { src: path.join(radios, "BP512.png"), slugs: ["hytera-bp512-business-radio"] },
  { src: path.join(radios, "BP562.png"), slugs: ["hytera-bp562-business-radio"] },
  { src: path.join(radios, "CH10L30.png"), slugs: ["hytera-ch10l30-charger"] },
  { src: path.join(radios, "EHW08.png"), slugs: ["hytera-ehw08-bluetooth-earpiece"] },
  { src: path.join(radios, "HM682.png"), slugs: ["hytera-hm682-mobile-radio"] },
  { src: path.join(radios, "HM782.png"), slugs: ["hytera-hm782-mobile-radio"] },
  { src: path.join(radios, "HP50X.png"), slugs: ["hytera-hp50x-digital-radio"] },
  { src: path.join(radios, "HP56X.png"), slugs: ["hytera-hp56x-digital-radio"] },
  { src: path.join(radios, "HP602.png"), slugs: ["hytera-hp602-digital-radio"] },
  { src: path.join(radios, "HP682.png"), slugs: ["hytera-hp682-digital-radio"] },
  { src: path.join(radios, "HP702.png"), slugs: ["hytera-hp702-digital-radio"] },
  { src: path.join(radios, "HP712.png"), slugs: ["hytera-hp712ex-iia-radio"] },
  { src: path.join(radios, "HP782.png"), slugs: ["hytera-hp782-digital-radio"] },
  { src: path.join(radios, "HP792Ex.png"), slugs: ["hytera-hp792ex-iia-radio"] },
  { src: path.join(radios, "HR1062.png"), slugs: ["hytera-hr1062-repeater"] },
  { src: path.join(radios, "HR652.png"), slugs: ["hytera-hr652-repeater"] },
  { src: path.join(radios, "HYTERA S1 REGULAR.webp"), slugs: ["hytera-s1-two-way-business-analog-radio"] },
  { src: path.join(radios, "MD622i.png"), slugs: ["hytera-md622i-mobile-radio"] },
  { src: path.join(radios, "PD362i.png"), slugs: ["hytera-pd362i-digital-radio"] },
  { src: path.join(radios, "PD402i.png"), slugs: ["hytera-pd402i-digital-radio"] },
  { src: path.join(radios, "PD482i.png"), slugs: ["hytera-pd482i-digital-radio"] },
  { src: path.join(radios, "PDC680.png"), slugs: ["hytera-pdc680-dual-mode-radio"] },
  { src: path.join(radios, "S1 MINI.png"), slugs: ["hytera-s1-mini-tiny-lf-business-two-way-radio"] },
  { src: path.join(radios, "S1 PRO.png"), slugs: ["hytera-s1-pro-business-point-of-sales-radio"] },
  { src: path.join(radios, "SM16A1.png"), slugs: ["hytera-sm16a1-palm-microphone"] },
  { src: path.join(radios, "SM27W2.png"), slugs: ["hytera-sm27w2-bluetooth-rsm"] },
  { src: path.join(accessories, "BC39.jfif"), slugs: ["hytera-bc39-belt-clip"] },
  { src: path.join(accessories, "BC48A.webp"), slugs: ["hytera-bc48-belt-clip"] },
  { src: path.join(accessories, "BRK20.jfif"), slugs: ["brk20"] },
  { src: path.join(accessories, "CHV09_main.png_n.webp"), slugs: ["chv09-vehicle-adapter"] },
  { src: path.join(accessories, "EAN33.jfif"), slugs: ["hytera-ean33-p-surveillance-earpiece"] },
  { src: path.join(accessories, "ECN49-Pa.webp"), slugs: ["hytera-ecn49-p-hearing-protection-headset"] },
  { src: path.join(accessories, "ECN50-Pa.webp"), slugs: ["hytera-ecn50-p-hearing-protection-headset"] },
  {
    src: path.join(accessories, "hytera-acn-02-microphone-cable-with-ptt-used-with-receive-only-earpiece-346927.webp"),
    slugs: ["hytera-acn-02p-microphone-cable"],
  },
  {
    src: path.join(accessories, "hytera-ean21-3-wire-surveillance-earpiece-with-transparent-acoustic-tube-beige-919372.webp"),
    slugs: ["hytera-ean21-p-transparent-acoustic-tube"],
  },
  {
    src: path.join(accessories, "hytera-ean24-2-wire-surveillance-earpiece-with-transparent-acoustic-tube-546193.webp"),
    slugs: ["hytera-ean24-p-acoustic-tube"],
  },
  {
    src: path.join(accessories, "hytera-eas03-receive-only-transparent-acoustic-tube-earpiece-25mm-390896.webp"),
    slugs: ["hytera-eas03-receive-only-acoustic-tube-earpiece"],
  },
  {
    src: path.join(accessories, "Hytera-EH01__57167.1642704467.1280.1280.webp"),
    slugs: ["hytera-eh-01-receive-only-earpiece"],
  },
  {
    src: path.join(accessories, "Hytera-POA59__03543.1630438330.1280.1280.webp"),
    slugs: ["hytera-poa59-charging-unit"],
  },
  {
    src: path.join(accessories, "SM16A2_main.png_n.webp"),
    slugs: ["hytera-sm16a2-palm-microphone"],
  },
  {
    src: path.join(accessories, "lcy025-hytera-leather-case-for-hp702-or-hp782-789542.webp"),
    slugs: ["hytera-lcy025-leather-carrying-case"],
  },
  { src: path.join(accessories, "MCA16.jfif"), slugs: ["mca16-multi-unit-charger"] },
  { src: path.join(accessories, "MCL39a.webp"), slugs: ["mcl39-multi-charging-unit"] },
  { src: path.join(accessories, "PS1014d.webp"), slugs: ["hytera-ps1014-switching-power-adapter"] },
  { src: path.join(accessories, "PS15002.webp"), slugs: ["hytera-ps15002-power-adapter"] },
  { src: path.join(accessories, "PS7501a.webp"), slugs: ["hytera-ps7501-power-adapter"] },
  { src: path.join(accessories, "images.jfif"), slugs: ["hytera-ro03-nylon-wrist-strap"] },
  { src: path.join(accessories, "images (1).jfif"), slugs: ["hytera-eca02-heavy-duty-noise-cancelling-headset"] },
  { src: path.join(accessories, "48.jfif"), slugs: ["hytera-ecn48-p-hearing-protection-headset"] },
  { src: path.join(accessories, "images (2).jfif"), slugs: ["hytera-sm09d1-external-speaker"] },
  { src: path.join(accessories, "images (3).jfif"), slugs: ["hytera-ncn019-chest-pack"] },
  { src: path.join(accessories, "images (4).jfif"), slugs: ["hytera-pcn006-ip67-waterproof-pvc-bag"] },
  { src: path.join(accessories, "images (5).jfif"), slugs: ["hytera-ncn011-nylon-carrying-case"] },
  { src: path.join(accessories, "images (8).jfif"), slugs: ["hytera-poa121-bluetooth-push-to-talk-ring"] },
  { src: path.join(accessories, "fd.jfif"), slugs: ["hytera-sm10a1-desktop-microphone"] },
];

const outDir = path.join(process.cwd(), "public", "products");
await mkdir(outDir, { recursive: true });

let count = 0;
for (const photo of photos) {
  const image = sharp(photo.src).rotate().resize(1200, 1200, {
    fit: "inside",
    withoutEnlargement: true,
  });
  for (const slug of photo.slugs) {
    const dest = path.join(outDir, `${slug}.webp`);
    await image.clone().webp({ quality: 82 }).toFile(dest);
    count += 1;
    console.log(slug);
  }
}

console.log(`Wrote ${count} webp files`);
