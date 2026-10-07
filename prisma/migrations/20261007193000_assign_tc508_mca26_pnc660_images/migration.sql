-- Attach official product photos for TC-508, MCA26, and PNC660.
-- Only the images column is updated. Prices, stock, orders, and other products are unchanged.

UPDATE "Product" SET images = ARRAY['/products/tc-508-basic-portable-analog-radio.webp'] WHERE slug = 'tc-508-basic-portable-analog-radio';
UPDATE "Product" SET images = ARRAY['/products/mca26-multi-unit-charger.webp'] WHERE slug = 'mca26-multi-unit-charger';
UPDATE "Product" SET images = ARRAY['/products/hytera-pnc660-mission-critical-ruggedized-poc-device.webp'] WHERE slug = 'hytera-pnc660-mission-critical-ruggedized-poc-device';
