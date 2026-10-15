export const forestCategory = "Forest Produce & Natural Products";

export const forestSubcategories = [
  "Amla, Harad, Baheda & Reetha",
  "Mahua flowers & seeds",
  "Tamarind, Chironji & Sal seeds",
  "Forest honey & permitted natural produce",
  "Shikakai, Kalmegh & botanical products",
  "Bamboo, leaves, fibres, gums & handicrafts",
  "Permitted medicinal plant raw materials",
];

const cgmfpfedSource = "https://www.cgmfpfed.org/new/msp_scheme.php";
const accessedOn = "2026-10-14";

const governmentMspRows = [
  ["amla-dry-seedless", "Amla (seedless)", "Phyllanthus emblica", "Fruit", "Seedless; dry", 52],
  ["harra-sabut-dry", "Harra Sabut", "Terminalia chebula", "Fruit", "Whole; dry", 15],
  ["baheda-sabut-dry", "Baheda Sabut", "Terminalia bellirica", "Fruit", "Whole; dry", 17],
  ["reetha-fruit-dry", "Reetha Fruit", null, "Fruit", "Dry; form as named by source", 14],
  ["mahua-flower-dry", "Mahua flower", "Madhuca longifolia", "Flower", "Dry", 30],
  ["mahua-seed", "Mahua Seed", "Madhuca longifolia", "Seed", "Form as named by source", 29],
  ["tamarind-with-seeds", "Tamarind", "Tamarindus indica", "Fruit", "With seeds", 36],
  ["tamarind-seedless", "Tamarind", "Tamarindus indica", "Fruit pulp", "Seedless", 69],
  ["tamarind-seed", "Tamarind Seed", "Tamarindus indica", "Seed", "Form as named by source", 11],
  ["chironji-guthli", "Chironji Guthli", "Buchanania lanzan", "Seed/kernel", "Guthli; source does not specify processing grade", 126],
  ["sal-seed", "Saal Seed", "Shorea robusta", "Seed", "Form as named by source", 20],
  ["honey", "Honey", null, null, "Source lists Honey; grade and processing are not specified", 225],
  ["kalmegh-dry", "Kalmegh / Bhuineem", "Andrographis paniculata", "Whole plant (source does not specify part)", "Dry", 35],
  ["giloy-dry", "Giloy", "Tinospora cordifolia", "Source does not specify part", "Dry", 40],
  ["shikakai-pod-dry", "Shikakai Phalli", "Senegalia rugata", "Pod", "Dry", 50],
];

export const forestPriceReferences = governmentMspRows
  .filter(([, , , , , price]) => price > 0)
  .map(([id, productName, botanicalName, plantPart, productForm, price]) => ({
    id,
    productName,
    productNameHi: ({
      "amla-dry-seedless": "आँवला (बीजरहित, सूखा)",
      "harra-sabut-dry": "हर्रा साबुत (सूखा)",
      "baheda-sabut-dry": "बहेड़ा साबुत (सूखा)",
      "reetha-fruit-dry": "रीठा फल (सूखा)",
      "mahua-flower-dry": "महुआ फूल (सूखा)",
      "mahua-seed": "महुआ बीज",
      "tamarind-with-seeds": "इमली (बीज सहित)",
      "tamarind-seedless": "इमली (बीजरहित)",
      "tamarind-seed": "इमली बीज",
      "chironji-guthli": "चिरौंजी गुठली",
      "sal-seed": "साल बीज",
      honey: "शहद",
      "kalmegh-dry": "कालमेघ / भुईनीम (सूखा)",
      "giloy-dry": "गिलोय (सूखा)",
      "shikakai-pod-dry": "शिकाकाई फली (सूखी)",
    })[id],
    botanicalName,
    plantPart,
    productForm,
    grade: "Not specified by source",
    processingState: productForm.toLowerCase().includes("dry") ? "Dry (as stated)" : "Not specified by source",
    amount: price,
    currency: "INR",
    unit: "kg",
    priceType: "GOVERNMENT_MSP",
    stateOrMarket: "Chhattisgarh",
    collectionYear: "2024-25",
    sourceName: "Chhattisgarh State Minor Forest Produce Federation",
    sourceUrl: cgmfpfedSource,
    sourcePublishedPeriod: "Collection year 2024-25; page does not establish that this is the current rate",
    accessedOn,
    currentPrice: false,
  }));

export const forestResearchSources = [
  {
    name: "Chhattisgarh State Minor Forest Produce Federation — MSP information",
    url: cgmfpfedSource,
    note: "Published Chhattisgarh collection-year 2024-25 government MSP figures. Historical procurement reference only; not a retail asking price or guaranteed current procurement.",
  },
  {
    name: "Ministry of AYUSH — e-Charak market prices",
    url: "https://echarak.ayush.gov.in/marketprice",
    note: "Fortnightly market-price portal; current product rows could not be independently retrieved from its interactive page during this review. No current observed price is asserted.",
  },
  {
    name: "TRIFED — MFP marketing guidelines",
    url: "https://trifed.tribal.gov.in/en/guidelines-0",
    note: "Guidelines for the MFP Minimum Support Price mechanism and value-chain development.",
  },
  {
    name: "PIB — advisory on online sale of certain ASU drugs",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1841493&lang=2&reg=48",
    note: "The page returned HTTP 403 during review. Applicable drug-sale controls require jurisdiction-specific legal verification; this site does not claim to implement prescription or licence checks.",
  },
];

export function isForestProduct(product) {
  const identifyingText = `${product?.name || ""} ${product?.nameHi || ""} ${product?.description || ""} ${product?.botanicalName || ""} ${product?.subcategory || ""}`;
  const forestTerms = /\b(amla|harad|harra|baheda|reetha|mahua|tamarind|chironji|sal seed|saal seed|honey|shikakai|kalmegh|giloy|neem leaves|medicinal plant|botanical raw material|minor forest produce|bamboo|forest leaves|natural fibre|forest gum)\b/i;
  return product?.isForestProduce === true ||
    product?.category === forestCategory ||
    product?.category === "Forest produce" ||
    product?.category === "Medicinal plants" ||
    forestSubcategories.includes(product?.subcategory) ||
    forestTerms.test(identifyingText);
}
