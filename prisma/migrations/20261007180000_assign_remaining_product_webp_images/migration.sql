-- Attach official product photos for the pages that were still missing images.
-- Only the images column is updated. Prices, stock, orders, and other products are unchanged.

UPDATE "Product" SET images = ARRAY['/products/hytera-hm652-mobile-radio.webp'] WHERE slug = 'hytera-hm652-mobile-radio';
UPDATE "Product" SET images = ARRAY['/products/hytera-md612i-commercial-digital-mobile-radio.webp'] WHERE slug = 'hytera-md612i-commercial-digital-mobile-radio';
UPDATE "Product" SET images = ARRAY['/products/hytera-md622a-commercial-analog-mobile-radio.webp'] WHERE slug = 'hytera-md622a-commercial-analog-mobile-radio';
UPDATE "Product" SET images = ARRAY['/products/hytera-mnc360-poc-mobile-radio.webp'] WHERE slug = 'hytera-mnc360-poc-mobile-radio';
UPDATE "Product" SET images = ARRAY['/products/hytera-p50-performance-poc-radio.webp'] WHERE slug = 'hytera-p50-performance-poc-radio';
UPDATE "Product" SET images = ARRAY['/products/hytera-pc143-1-metre-usb-a-to-type-c-cable.webp'] WHERE slug = 'hytera-pc143-1-metre-usb-a-to-type-c-cable';
UPDATE "Product" SET images = ARRAY['/products/pmc360s-poc-handheld-radio.webp'] WHERE slug = 'pmc360s-poc-handheld-radio';
UPDATE "Product" SET images = ARRAY['/products/pnc360s-poc-handheld-device.webp'] WHERE slug = 'pnc360s-poc-handheld-device';
UPDATE "Product" SET images = ARRAY['/products/pnc460-poc-smartphone.webp'] WHERE slug = 'pnc460-poc-smartphone';
UPDATE "Product" SET images = ARRAY['/products/pnc460-ul913-poc-smartphone.webp'] WHERE slug = 'pnc460-ul913-poc-smartphone';
UPDATE "Product" SET images = ARRAY['/products/hytera-pnc560-5g-xsecure-rugged-device.webp'] WHERE slug = 'hytera-pnc560-5g-xsecure-rugged-device';
UPDATE "Product" SET images = ARRAY['/products/hytera-tc-320-basic-portable-analog-radio.webp'] WHERE slug = 'hytera-tc-320-basic-portable-analog-radio';
