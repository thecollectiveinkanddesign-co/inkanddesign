# Collective Designs — Free Storefront Setup

This package adds the first store layer to the existing GitHub Pages website without changing the Night Garden HTML design.

## What it adds
- A floating shopping bag
- Product detail popups
- Size/colour selection
- Cart stored in the visitor's browser
- Midnight Dragon Hoodie added to the shop
- Printful marked as the intended POD fulfiller
- No API keys or payment secrets in browser code

## Install
1. In the GitHub repository, open `script.js`.
2. Replace its contents with the `script.js` in this package.
3. Commit the change to your branch.
4. Refresh the GitHub Pages site.

## Important
The product prices are intentionally unset. We should choose the exact Printful blank/product and calculate retail prices from the real Printful costs before accepting money.

The current checkout button is intentionally not connected to payment yet. GitHub Pages is static, so a Printful private API token must NOT be placed in `script.js`. Printful's own documentation recommends a server-side/custom integration for this setup.

## Next stage
After the storefront is visible, we can connect:
- Stripe Checkout (no monthly fee; transaction fees only)
- a free Cloudflare Worker as the secure server endpoint
- the Printful API using a private token stored as a secret
- Printful product/variant IDs for the tee, hoodie, stickers, stationery and prints

That will turn the bag into an automatic paid checkout and send paid orders to Printful for fulfillment.
