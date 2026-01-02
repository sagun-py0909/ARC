import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedBiotasticData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const regionModuleService = container.resolve(Modules.REGION);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_locales: [
          { locale_code: "fr-FR" },
          { locale_code: "es-ES" }
        ]
      },
    },
  });

  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "eur", is_default: true },
        { currency_code: "usd" },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_sales_channel_id: defaultSalesChannel[0].id },
    },
  });

  // --- DELETE OLD DATA (Best Effort) ---
  logger.info("Cleaning up old product data...");
  try {
    const oldProducts = await productModuleService.listProducts({
      handle: ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
    });
    if (oldProducts.length) {
      await productModuleService.softDeleteProducts(oldProducts.map(p => p.id));
      logger.info(`Deleted ${oldProducts.length} old products.`);
    }
  } catch (e) {
    logger.warn("Could not cleanup old data (ignoring): " + e.message);
  }
  // -------------------------------------

  logger.info("Seeding region data...");
  let region;
  const regions = await regionModuleService.listRegions({ name: "Europe" });
  if (regions.length > 0) {
      region = regions[0];
      logger.info("Region 'Europe' already exists, reusing.");
  } else {
      const { result: regionResult } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name: "Europe",
              currency_code: "eur",
              countries,
              payment_providers: ["pp_system_default"],
            },
          ],
        },
      });
      region = regionResult[0];
  }

  logger.info("Seeding tax regions...");
  try {
      await createTaxRegionsWorkflow(container).run({
        input: countries.map((country_code) => ({
          country_code,
          provider_id: "tp_system",
        })),
      });
  } catch (e) {
      logger.warn("Skipping Tax Regions (likely exist or partial failure): " + e.message);
  }

  logger.info("Seeding stock location data...");
  let stockLocation;
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const locations = await stockLocationModuleService.listStockLocations({ name: "European Warehouse" });

  if (locations.length > 0) {
      stockLocation = locations[0];
      logger.info("Stock Location already exists, reusing.");
  } else {
      const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
        input: {
          locations: [
            {
              name: "European Warehouse",
              address: { city: "Copenhagen", country_code: "DK", address_1: "" },
            },
          ],
        },
      });
      stockLocation = stockLocationResult[0];
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: stockLocation.id },
    },
  });

  try {
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
        [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
      });
  } catch(e) {}

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({ type: "default" });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    });
    shippingProfile = shippingProfileResult[0];
  }

  let fulfillmentSet;
  const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({ name: "European Warehouse delivery" });
  if (fulfillmentSets.length > 0) {
      fulfillmentSet = fulfillmentSets[0];
  } else {
      fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "European Warehouse delivery",
        type: "shipping",
        service_zones: [
          {
            name: "Europe",
            geo_zones: [
              { country_code: "gb", type: "country" },
              { country_code: "de", type: "country" },
              { country_code: "fr", type: "country" },
            ],
          },
        ],
      });
  }

  try {
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
        [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
      });
  } catch(e) {}

  const existingOptions = await fulfillmentModuleService.listShippingOptions({ name: ["Standard Shipping"] });
  if (existingOptions.length === 0) {
      await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: "Standard Shipping",
            price_type: "flat",
            provider_id: "manual_manual",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            type: { label: "Standard", description: "Ship in 2-3 days.", code: "standard" },
            prices: [
              { currency_code: "usd", amount: 10 },
              { currency_code: "eur", amount: 10 },
              { region_id: region.id, amount: 10 },
            ],
            rules: [
                { attribute: "enabled_in_store", value: "true", operator: "eq" },
                { attribute: "is_return", value: "false", operator: "eq" },
            ],
          },
        ],
      });
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
  });

  logger.info("Seeding publishable API key...");
  let pubKeyToken = "";
  try {
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(container).run({
        input: {
        api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }],
        },
    });
    const publishableApiKey = publishableApiKeyResult[0];
    await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
    });
    pubKeyToken = publishableApiKey.token;
  } catch(e) {
      logger.info("API Key creation skipped or failed (likely duplicate). Fetching existing...");
      const apiKeyModuleService = container.resolve(Modules.API_KEY);
      const apiKeys = await apiKeyModuleService.listApiKeys({ title: "Webshop", type: "publishable" });
      if (apiKeys.length > 0) pubKeyToken = apiKeys[0].token;
  }

  // --- NEW CATEGORIES ---
  logger.info("Seeding Categories...");
  const categoriesData = [
    { name: "Cold Therapy (Active Cooling)", handle: "active-cooling" },
    { name: "Cold Therapy (Tubs & Pods)", handle: "tubs-pods" },
    { name: "Heat Therapy (Saunas)", handle: "saunas" },
    { name: "Red Light Therapy", handle: "red-light" }
  ];

  for (const catData of categoriesData) {
      try {
          const existing = await productModuleService.listProductCategories({ handle: [catData.handle] });
          if (existing.length === 0) {
              await createProductCategoriesWorkflow(container).run({
                  input: { product_categories: [{ name: catData.name, is_active: true, handle: catData.handle }] },
              });
              logger.info(`Created category: ${catData.name}`);
          } else {
              logger.info(`Category exists: ${catData.name}`);
          }
      } catch (e) {
          logger.warn(`Failed to create category ${catData.name} (ignoring): ${e.message}`);
      }
  }

  logger.info("Seeding Products...");

  const productsData = [
    {
      title: "IceCode Chiller Pro (1.5HP)",
      handle: "icecode-chiller-pro",
      categoryName: "Cold Therapy (Active Cooling)",
      categoryHandle: "active-cooling",
      description: `
        <p><strong>Tagline:</strong> The Future of Ice Bathing – No Ice Required.</p>
        <p>Eliminate the hassle of buying ice. The IceCode Chiller Pro is a powerhouse 1.5HP unit that cools water to a piercing 3°C (recommended 3-5°C) and heats up to 42°C, offering total control over your recovery protocol.</p>
        <p>Designed for commercial gyms, wellness centers, and serious biohackers, the IceCode Chiller Pro is engineered for speed and efficiency. With a robust 1.5HP compressor, it chills water rapidly, eliminating the need for constant ice refills. It features a built-in ozone disinfection system and 20-micron filtration to ensure your water remains crystal clear and safe. Whether you need an ice-cold plunge or a warm recovery bath, the WiFi-enabled control allows you to set your temperature from anywhere.</p>
        <h3>Key Features:</h3>
        <ul>
            <li><strong>Powerful Performance:</strong> 1.5HP compressor cools 350–550L of water rapidly.</li>
            <li><strong>Dual Function:</strong> Cools down to 3°C and heats up to 42°C.</li>
            <li><strong>Hygiene First:</strong> Integrated Ozone disinfection and 20-micron filtration.</li>
            <li><strong>Smart Control:</strong> WiFi and remote control enabled.</li>
            <li><strong>Plug & Play:</strong> Easy installation with no tools required.</li>
        </ul>
        <h3>Technical Specifications:</h3>
        <ul>
            <li><strong>Power:</strong> 1.5 HP (Cooling: 3500W / Heating: 5000W)</li>
            <li><strong>Water Pump Flow:</strong> 2400 L/H</li>
            <li><strong>Refrigerant:</strong> R410A (Eco-friendly)</li>
        </ul>
      `,
      images: ["https://placehold.co/600x600?text=IceCode+Chiller"],
      options: [{ title: "Model", values: ["1.5HP"] }],
      variants: [
        {
          title: "1.5HP",
          sku: "CHILLER-1.5HP",
          options: { "Model": "1.5HP" },
          prices: [{ amount: 1499, currency_code: "usd" }, { amount: 1399, currency_code: "eur" }]
        }
      ]
    },
    {
      title: "Neo Pod",
      handle: "neo-pod",
      categoryName: "Cold Therapy (Tubs & Pods)",
      categoryHandle: "tubs-pods",
      description: `
        <p><strong>Tagline:</strong> Indestructible. Insulated. The Commercial Standard.</p>
        <p>Built for high-volume commercial use and extreme durability, the Neo Pod is a rigid, hard-shell ice bath made from ultra-strong Polyethylene. It features a deep immersion design and non-slip safety steps.</p>
        <p>The Neo Pod is the ultimate recovery partner for athletes and gyms. Unlike inflatable options, this solid-body pod is virtually indestructible, resistant to cracking, warping, and impact. It features a double-wall thermal insulation design to keep water cold for longer.</p>
        <h3>Key Features:</h3>
        <ul>
            <li><strong>Commercial Grade:</strong> Rotomolded Polyethylene construction.</li>
            <li><strong>Spacious:</strong> 550L capacity, fits users up to 6'7".</li>
            <li><strong>Thermal Insulation:</strong> Double-wall design.</li>
            <li><strong>Safety:</strong> Coated non-slip standing surface and steps.</li>
        </ul>
        <h3>Technical Specifications:</h3>
        <ul>
            <li><strong>Weight:</strong> 45 kg (Empty)</li>
            <li><strong>Capacity:</strong> 550 Liters</li>
            <li><strong>Material:</strong> High-Density Polyethylene (HDPE)</li>
        </ul>
      `,
      images: ["https://placehold.co/600x600?text=Neo+Pod"],
      options: [{ title: "Type", values: ["Standard"] }],
      variants: [
        {
          title: "Standard",
          sku: "NEO-POD-STD",
          options: { "Type": "Standard" },
          prices: [{ amount: 1199, currency_code: "usd" }, { amount: 1099, currency_code: "eur" }]
        }
      ]
    },
    {
      title: "IcePod 3.0",
      handle: "icepod-3-0",
      categoryName: "Cold Therapy (Tubs & Pods)",
      categoryHandle: "tubs-pods",
      description: `
        <p><strong>Tagline:</strong> Portable Recovery. Anywhere, Anytime.</p>
        <p>The IcePod 3.0 is a portable, inflatable recovery solution featuring 5-layer insulation technology. Available in Lite and Pro sizes, it is perfect for home use, travel, or entry-level biohacking.</p>
        <p>Don't let space define your recovery. The IcePod 3.0 packs down into a carrying bag but inflates in minutes to provide a full-body immersion experience.</p>
        <h3>Key Features:</h3>
        <ul>
            <li><strong>5-Layer Insulation:</strong> Includes UV-resistant PVC and 10mm reflective foil.</li>
            <li><strong>Portable:</strong> Lightweight and packs into a carry bag.</li>
            <li><strong>Chiller Compatible:</strong> Standard ports to connect with IceCode Chillers.</li>
        </ul>
        <h3>Technical Specifications:</h3>
        <ul>
            <li><strong>Capacity:</strong> ~300 Liters (Pro)</li>
            <li><strong>User Height:</strong> Fits users up to 6'7" (Pro)</li>
        </ul>
      `,
      images: ["https://placehold.co/600x600?text=IcePod+3.0"],
      options: [{ title: "Size", values: ["Lite", "Pro"] }],
      variants: [
        {
          title: "Lite",
          sku: "ICEPOD-LITE",
          options: { "Size": "Lite" },
          prices: [{ amount: 149, currency_code: "usd" }, { amount: 139, currency_code: "eur" }]
        },
        {
          title: "Pro",
          sku: "ICEPOD-PRO",
          options: { "Size": "Pro" },
          prices: [{ amount: 199, currency_code: "usd" }, { amount: 189, currency_code: "eur" }]
        }
      ]
    },
    {
      title: "Aura Sauna Series",
      handle: "aura-sauna",
      categoryName: "Heat Therapy (Saunas)",
      categoryHandle: "saunas",
      description: `
        <p><strong>Tagline:</strong> Upgrade Your Biology with Precision Heat.</p>
        <p>The Aura Series offers a sanctuary of wellness with premium Canadian Hemlock wood construction. Choose the Solo for pure Infrared therapy, or the Duo/Trio for a hybrid experience combining Infrared depth with traditional intense heat.</p>
        <h3>Key Features:</h3>
        <ul>
            <li><strong>Hybrid Heating (Duo/Trio):</strong> Combines Far Infrared + Traditional Stove.</li>
            <li><strong>Premium Build:</strong> High-quality Canadian Hemlock wood.</li>
            <li><strong>Smart Biofeedback:</strong> Bluetooth audio and LED Chromotherapy lighting.</li>
        </ul>
        <h3>Technical Specifications:</h3>
        <ul>
            <li><strong>Aura Solo:</strong> 1 Person, Infrared Only.</li>
            <li><strong>Aura Duo:</strong> 2 Person, Hybrid.</li>
            <li><strong>Aura Trio:</strong> 3 Person, Hybrid.</li>
        </ul>
      `,
      images: ["https://placehold.co/600x600?text=Aura+Sauna"],
      options: [{ title: "Model", values: ["Solo", "Duo", "Trio"] }],
      variants: [
        {
          title: "Solo",
          sku: "AURA-SOLO",
          options: { "Model": "Solo" },
          prices: [{ amount: 1999, currency_code: "usd" }, { amount: 1899, currency_code: "eur" }]
        },
        {
          title: "Duo",
          sku: "AURA-DUO",
          options: { "Model": "Duo" },
          prices: [{ amount: 2999, currency_code: "usd" }, { amount: 2899, currency_code: "eur" }]
        },
        {
          title: "Trio",
          sku: "AURA-TRIO",
          options: { "Model": "Trio" },
          prices: [{ amount: 3999, currency_code: "usd" }, { amount: 3899, currency_code: "eur" }]
        }
      ]
    },
    {
      title: "HealLite Modular Panels",
      handle: "heallite-panels",
      categoryName: "Red Light Therapy",
      categoryHandle: "red-light",
      description: `
        <p><strong>Tagline:</strong> Clinical-Grade Light Therapy at Home.</p>
        <p>HealLite panels deliver high-irradiance Red (660nm) and Near-Infrared (850nm) light to drive cellular regeneration. The modular design allows you to start with a Mini or Solo panel and stack them into a full-body Quad array.</p>
        <h3>Key Features:</h3>
        <ul>
            <li><strong>Dual Wavelengths:</strong> 660nm (Red) & 850nm (NIR).</li>
            <li><strong>High Power:</strong> High irradiance for effective penetration.</li>
            <li><strong>Modular:</strong> Connect multiple panels.</li>
            <li><strong>No Flicker:</strong> Smart controller ensures consistent light output.</li>
        </ul>
      `,
      images: ["https://placehold.co/600x600?text=HealLite"],
      options: [{ title: "Size", values: ["Mini", "Solo", "Quad"] }],
      variants: [
        {
          title: "Mini",
          sku: "HEALLITE-MINI",
          options: { "Size": "Mini" },
          prices: [{ amount: 299, currency_code: "usd" }, { amount: 279, currency_code: "eur" }]
        },
        {
          title: "Solo",
          sku: "HEALLITE-SOLO",
          options: { "Size": "Solo" },
          prices: [{ amount: 599, currency_code: "usd" }, { amount: 549, currency_code: "eur" }]
        },
        {
          title: "Quad",
          sku: "HEALLITE-QUAD",
          options: { "Size": "Quad" },
          prices: [{ amount: 1199, currency_code: "usd" }, { amount: 1099, currency_code: "eur" }]
        }
      ]
    }
  ];

  // Async mapping to ensure we get category IDs
  const productsToCreate = [];
  for (const p of productsData) {
      const cats = await productModuleService.listProductCategories({ handle: [p.categoryHandle] });
      if (cats.length > 0) {
          productsToCreate.push({
            title: p.title,
            handle: p.handle,
            category_ids: [cats[0].id],
            description: p.description,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: p.images.map(url => ({ url })),
            options: p.options,
            variants: p.variants,
            sales_channels: [{ id: defaultSalesChannel[0].id }]
          });
      } else {
          logger.warn(`Skipping product ${p.title} - Category ${p.categoryHandle} not found via individual lookup.`);
      }
  }

  if (productsToCreate.length > 0) {
      const existingProducts = await productModuleService.listProducts({
          handle: productsToCreate.map(p => p.handle)
      });

      const uniqueProductsToCreate = productsToCreate.filter(p => !existingProducts.find(ep => ep.handle === p.handle));

      if (uniqueProductsToCreate.length > 0) {
          await createProductsWorkflow(container).run({
            input: {
              products: uniqueProductsToCreate
            },
          });
          logger.info(`Created ${uniqueProductsToCreate.length} products.`);
      } else {
          logger.info("All products already exist.");
      }
  }

  logger.info("Finished seeding products.");

  // Inventory Levels
  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    inventoryLevels.push({
      location_id: stockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    });
  }

  try {
      if (inventoryLevels.length > 0) {
        await createInventoryLevelsWorkflow(container).run({
            input: { inventory_levels: inventoryLevels },
        });
      }
  } catch (e) {
      logger.info("Inventory levels already exist or partial failure (ignoring): " + e.message);
  }

  logger.info("Finished seeding inventory levels.");
  logger.info("------------------------------------------------");
  logger.info(`PUBLISHABLE_API_KEY for frontend: ${pubKeyToken}`);
  logger.info("------------------------------------------------");
}
