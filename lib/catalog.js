import { forestCategory } from "./forest-market-data.js";

const images = {
  craft: [
    "/product-images/bamboo-tokari.jpg",
    "/product-images/dhokra-craft.jpg",
    "/product-images/kosa-saree.jpg",
    "/product-images/bamboo-lamp.jpg",
    "/product-images/clay-relief.jpg",
    "/product-images/wood-carving.jpg",
    "/product-images/tribal-jewellery.jpg",
    "/product-images/terracotta-pot.jpg",
    "/product-images/agarbatti-holder.jpg",
    "/product-images/tribal-decor.jpg",
  ],
  forest: [
    "photo-1587049352851-8d4e89133924",
    "photo-1615485500704-8e990f9900f5",
    "photo-1615485500704-8e990f9900f5",
    "photo-1615485500704-8e990f9900f5",
    "photo-1615485500704-8e990f9900f5",
    "photo-1540420773420-3366772f4999",
    "photo-1615485500704-8e990f9900f5",
    "photo-1500382017468-9049fed747ef",
    "photo-1590736969955-71cc94901144",
    "photo-1500382017468-9049fed747ef",
    "photo-1540420773420-3366772f4999",
    "photo-1615485500704-8e990f9900f5",
    "photo-1590736969955-71cc94901144",
  ],
  rural: [
    "/product-images/cotton-fabric.jpg",
    "/product-images/decor-box.jpg",
    "/product-images/clay-figurines.jpg",
    "/product-images/farm-produce.jpg",
  ],
};

const craftNames = [
  ["bamboo-tokari", "Bamboo Tokari Basket", "बाँस की टोकरी", "Handicrafts", 399, "Each", "Handwoven from locally sourced bamboo by artisan groups."],
  ["dhokra-craft", "Dhokra Metal Craft", "ढोकरा धातु शिल्प", "Dhokra", 899, "Each", "A traditional lost-wax metal craft, made in small batches."],
  ["kosa-saree", "Kosa Silk Saree", "कोसा रेशम साड़ी", "Handloom", 3499, "Each", "Handloom-woven Kosa silk textile from a rural weaving collective."],
  ["bamboo-lamp", "Bamboo Handcrafted Lamp", "बाँस का हस्तनिर्मित लैम्प", "Bamboo", 599, "Each", "Natural bamboo lamp shade, hand-finished by local makers."],
  ["clay-relief", "Clay Relief Art", "मिट्टी की उभरी कला", "Clay art", 799, "Each", "Hand-shaped decorative clay relief panel."],
  ["wood-carving", "Wooden Carving", "लकड़ी की नक्काशी", "Wood carving", 999, "Each", "Hand-carved decorative piece made by rural artisans."],
  ["tribal-jewellery", "Chhattisgarhi Jewellery", "छत्तीसगढ़ी आभूषण", "Jewellery", 599, "Set", "Traditional-inspired handmade jewellery set."],
  ["terracotta-pot", "Terracotta Pottery", "टेराकोटा मिट्टी के बर्तन", "Clay art", 299, "Each", "Wheel-formed terracotta pottery, finished by hand."],
  ["agarbatti-holder", "Handmade Agarbatti Holder", "हस्तनिर्मित अगरबत्ती होल्डर", "Clay art", 199, "Each", "Small handmade holder for home use."],
  ["tribal-decor", "Tribal Jewellery & Handmade Decor", "जनजातीय आभूषण और सजावट", "Jewellery", 499, "Each", "Artisan-made accessory and decor from a community collective."],
];

const forestNames = [
  ["forest-honey", "Forest Honey", "वन शहद", 299, "500 g jar", "Raw honey collected and packed by a producer collective."],
  ["amla", "Dried Amla", "सूखा आँवला", 199, "250 g pack", "Cleaned and naturally dried amla pieces."],
  ["harad", "Harad Fruit", "हरड़", 199, "250 g pack", "Dried harad fruit, packed at source."],
  ["baheda", "Baheda Fruit", "बहेड़ा", 179, "250 g pack", "Dried baheda fruit, packed at source."],
  ["shikakai", "Shikakai Pods", "शिकाकाई", 149, "250 g pack", "Dried shikakai pods. External-use labelling and handling information required."],
  ["neem-leaves", "Dried Neem Leaves", "सूखे नीम के पत्ते", 99, "100 g pack", "Dried leaves for permitted non-food uses; not a medical product."],
  ["mahua-flowers", "Dried Mahua Flowers", "सूखे महुआ फूल", 249, "250 g pack", "Sorted dried flowers; food use requires applicable safety and labelling approvals."],
  ["tamarind", "Forest Tamarind", "इमली", 149, "500 g pack", "Cleaned tamarind sourced from a community producer."],
  ["bamboo-shoots", "Bamboo Shoots", "बाँस की कोपलें", 199, "250 g pack", "Food-grade processing, packaging and applicable FSSAI compliance required."],
  ["sal-seeds", "Sal Seeds", "साल बीज", 199, "500 g pack", "Community-collected sal seeds, subject to local collection permissions."],
  ["giloy", "Giloy Stems", "गिलोय की बेल", 149, "100 g pack", "Tinospora cordifolia; no therapeutic claims. Sale requires applicable permissions and compliant labelling."],
  ["herbal-powder", "Traditional Plant Powder", "पारंपरिक वनस्पति पाउडर", 199, "100 g pack", "Plant identity, ingredients, processing and safety label must be verified before sale."],
  ["forest-bamboo-decor", "Forest Bamboo Home Decor", "वन बाँस की गृह सजावट", 499, "Each", "Forest-based bamboo decor made from permitted, traceable sources."],
];

const forestDescriptionsHi = {
  "forest-honey": "उत्पादक समूह द्वारा संग्रहित और पैक किया गया कच्चा वन शहद।",
  amla: "साफ़ किए हुए और प्राकृतिक रूप से सुखाए गए आँवले के टुकड़े।",
  harad: "स्रोत पर पैक किए गए सूखे हरड़ फल।",
  baheda: "स्रोत पर पैक किए गए सूखे बहेड़ा फल।",
  shikakai: "सूखी शिकाकाई फलियाँ। उपयोग और संभाल की जानकारी उत्पाद के लेबल पर सत्यापित होनी चाहिए।",
  "neem-leaves": "अनुमत गैर-खाद्य उपयोगों के लिए सूखे नीम के पत्ते। यह चिकित्सा उत्पाद नहीं है।",
  "mahua-flowers": "छाँटे और सुखाए गए महुआ फूल। खाद्य उपयोग से पहले लागू सुरक्षा और लेबल आवश्यकताओं की जाँच ज़रूरी है।",
  tamarind: "समुदाय के उत्पादक से प्राप्त और साफ़ की गई इमली।",
  "bamboo-shoots": "बाँस की कोपलें। खाद्य-स्तर प्रसंस्करण, पैकेजिंग और लागू FSSAI अनुपालन की जाँच ज़रूरी है।",
  "sal-seeds": "समुदाय द्वारा एकत्र किए गए साल बीज; स्थानीय संग्रह अनुमतियों की जाँच ज़रूरी है।",
  giloy: "गिलोय के तने। कोई चिकित्सीय लाभ का दावा नहीं है; बिक्री के लिए लागू अनुमतियाँ और सही लेबल आवश्यक हैं।",
  "herbal-powder": "पौधे की पहचान, सामग्री, प्रसंस्करण और सुरक्षा लेबल बिक्री से पहले सत्यापित होने चाहिए।",
  "forest-bamboo-decor": "अनुमत और स्रोत-योग्य सामग्री से बना वन बाँस का सजावटी सामान।",
};

const otherDescriptionsHi = {
  "bamboo-tokari": "स्थानीय बाँस से कारीगर समूहों द्वारा हाथ से बुनी टोकरी।",
  "dhokra-craft": "पारंपरिक मोम-ढलाई तकनीक से छोटे बैच में बना धातु शिल्प।",
  "kosa-saree": "ग्रामीण बुनकर समूह द्वारा हथकरघे पर बुनी कोसा रेशम साड़ी।",
  "bamboo-lamp": "स्थानीय कारीगरों द्वारा हाथ से तैयार बाँस का लैम्प शेड।",
  "clay-relief": "हाथ से आकार दिया गया मिट्टी का सजावटी उभरा पैनल।",
  "wood-carving": "ग्रामीण कारीगरों द्वारा हाथ से तराशी गई सजावटी वस्तु।",
  "tribal-jewellery": "पारंपरिक शैली से प्रेरित हस्तनिर्मित आभूषणों का सेट।",
  "terracotta-pot": "चाक पर बनाया और हाथ से तैयार किया गया टेराकोटा पात्र।",
  "agarbatti-holder": "घर में उपयोग के लिए छोटा हस्तनिर्मित अगरबत्ती स्टैंड।",
  "tribal-decor": "समुदाय के कारीगर समूह द्वारा बनाया गया आभूषण और सजावटी सामान।",
  "cotton-fabric": "ग्रामीण बुनकर समूह द्वारा हाथ से बुना सूती कपड़ा।",
  "decor-box": "हाथ से तैयार किया गया सजावटी भंडारण डिब्बा।",
  "clay-figurines": "गाँव के कारीगर द्वारा हाथ से बनाई गई छोटी मिट्टी की मूर्तियाँ।",
  "farm-produce": "नमूना सूची। उत्पादक मूल्य, मात्रा और कटाई की उपलब्धता तय करता है।",
};

const botanicalDetails = {
  amla: ["Phyllanthus emblica", "Fruit", "Community orchard / permitted collection", "Washed, sliced and dried", "Store sealed in a cool, dry place"],
  harad: ["Terminalia chebula", "Fruit", "Permitted community collection", "Cleaned and dried", "Store sealed in a cool, dry place"],
  baheda: ["Terminalia bellirica", "Fruit", "Permitted community collection", "Cleaned and dried", "Store sealed in a cool, dry place"],
  shikakai: ["Senegalia rugata", "Pod", "Permitted community collection", "Cleaned and dried", "Store sealed and dry; external-use labelling required"],
  "neem-leaves": ["Azadirachta indica", "Leaf", "Permitted cultivation / collection", "Cleaned and dried", "Store sealed and dry; not labelled for consumption"],
  "mahua-flowers": ["Madhuca longifolia", "Flower", "Permitted community collection", "Sorted and dried", "Store sealed in a cool, dry place"],
  "sal-seeds": ["Shorea robusta", "Seed", "Permitted community collection", "Sorted and dried", "Store sealed in a cool, dry place"],
  giloy: ["Tinospora cordifolia", "Stem", "Cultivated or legally permitted source", "Identity verified, cleaned and dried", "Store sealed and dry; no medical claims; safety label required"],
  "herbal-powder": ["Must be supplied by seller", "Seller must declare", "Traceable, permitted source required", "Seller must disclose method", "Ingredient and safety labels required"],
};

const categories = [forestCategory, "Forest produce", "Medicinal plants", "Handicrafts", "Handloom", "Bamboo", "Dhokra", "Jewellery", "Clay art", "Wood carving", "Agriculture", "Rural products", "Rentals"];

const unavailablePhotos = new Set(["photo-1590736969955-71cc94901144"]);

export function isUnavailableProductPhoto(source) {
  const match = /^https:\/\/images\.unsplash\.com\/([^?]+)(?:\?.*)?$/.exec(source || "");
  return Boolean(match && unavailablePhotos.has(match[1]));
}

function photoUrl(photo) {
  if (unavailablePhotos.has(photo)) return "/placeholder.svg";
  return `https://images.unsplash.com/${photo}?auto=format&fit=clip&w=1400&q=85`;
}

export const demoProducts = [
  ...craftNames.map(([id, name, nameHi, category, price, unit, description], index) => ({
    id, name, nameHi, category, price, unit, description, descriptionHi: otherDescriptionsHi[id],
    discount: ["bamboo-tokari", "dhokra-craft"].includes(id) ? 10 : 0,
    priceDisplay: id === "bamboo-lamp" ? "₹499–₹699" : "",
    image: images.craft[index],
    imageAlt: `${name} product photo`,
    imageAltHi: `${nameHi} उत्पाद की फोटो`,
    seller: "Setu Nova artisan collective",
    sellerHi: "सेतु नोवा कारीगर समूह",
    location: ["Kutch, Gujarat", "Bastar, Chhattisgarh", "Chanderi, Madhya Pradesh", "Koraput, Odisha"][index % 4],
    stock: 18 + (index % 11),
    rating: null,
    popularity: 90 - index,
    label: "Illustrative demo price",
    details: { materials: category === "Handloom" ? "Kosa silk" : category === "Bamboo" ? "Bamboo" : "Natural and locally sourced materials" },
  })),
  ...forestNames.map(([id, name, nameHi, price, unit, description], index) => {
    const botanical = botanicalDetails[id];
    const detailsHi = botanical ? {
      botanicalName: ({
        amla: "आँवला",
        harad: "हरड़",
        baheda: "बहेड़ा",
        shikakai: "शिकाकाई",
        "neem-leaves": "नीम",
        "mahua-flowers": "महुआ",
        "sal-seeds": "साल",
        giloy: "गिलोय",
        "herbal-powder": "विक्रेता द्वारा सत्यापित किया जाना है",
      })[id],
      plantPart: ({ amla: "फल", harad: "फल", baheda: "फल", shikakai: "फली", "neem-leaves": "पत्ती", "mahua-flowers": "फूल", "sal-seeds": "बीज", giloy: "तना", "herbal-powder": "विक्रेता द्वारा बताना आवश्यक" })[id],
      source: ({ amla: "समुदाय का बाग़ / अनुमत संग्रह", harad: "अनुमत सामुदायिक संग्रह", baheda: "अनुमत सामुदायिक संग्रह", shikakai: "अनुमत सामुदायिक संग्रह", "neem-leaves": "अनुमत खेती / संग्रह", "mahua-flowers": "अनुमत सामुदायिक संग्रह", "sal-seeds": "अनुमत सामुदायिक संग्रह", giloy: "खेती या कानूनी रूप से अनुमत स्रोत", "herbal-powder": "स्रोत का पता लगाने योग्य और अनुमत होना आवश्यक" })[id],
      processing: ({ amla: "धोया, काटा और सुखाया गया", harad: "साफ़ करके सुखाया गया", baheda: "साफ़ करके सुखाया गया", shikakai: "साफ़ करके सुखाया गया", "neem-leaves": "साफ़ करके सुखाया गया", "mahua-flowers": "छाँटकर सुखाया गया", "sal-seeds": "छाँटकर सुखाया गया", giloy: "पहचान सत्यापित, साफ़ और सुखाया गया", "herbal-powder": "विधि विक्रेता द्वारा बताना आवश्यक" })[id],
      storage: ({ amla: "बंद पैक में ठंडी और सूखी जगह रखें", harad: "बंद पैक में ठंडी और सूखी जगह रखें", baheda: "बंद पैक में ठंडी और सूखी जगह रखें", shikakai: "बंद और सूखी जगह रखें; बाहरी उपयोग का लेबल आवश्यक", "neem-leaves": "बंद और सूखी जगह रखें; खाने के लिए लेबल न करें", "mahua-flowers": "बंद पैक में ठंडी और सूखी जगह रखें", "sal-seeds": "बंद पैक में ठंडी और सूखी जगह रखें", giloy: "बंद और सूखी जगह रखें; कोई चिकित्सीय दावा नहीं; सुरक्षा लेबल आवश्यक", "herbal-powder": "सामग्री और सुरक्षा लेबल आवश्यक" })[id],
    } : {
      source: "सामुदायिक उत्पादक; संग्रह अधिकार और स्रोत की पुष्टि आवश्यक",
      processing: "विक्रेता को बैच संभाल और पैकिंग की जानकारी देनी होगी",
      storage: "साफ़, सूखी जगह पर बंद रखें; उत्पाद लेबल देखें",
    };
    detailsHi.safety = "कोई औषधीय लाभ या इलाज का दावा नहीं। पहचान, अनुमतियाँ, खाद्य सुरक्षा और लागू उत्पाद लेबल सत्यापित नहीं हैं।";
    const subcategory = id === "amla" || id === "harad" || id === "baheda" ? "Amla, Harad, Baheda & Reetha"
      : id === "mahua-flowers" ? "Mahua flowers & seeds"
        : id === "tamarind" || id === "sal-seeds" ? "Tamarind, Chironji & Sal seeds"
          : id === "forest-honey" ? "Forest honey & permitted natural produce"
            : id === "shikakai" || id === "giloy" ? "Shikakai, Kalmegh & botanical products"
              : id.includes("bamboo") || id === "neem-leaves" ? "Bamboo, leaves, fibres, gums & handicrafts"
                : "Permitted medicinal plant raw materials";
    return {
      id, name, nameHi, category: forestCategory, subcategory,
      price: 0, unit, description, discount: 0,
      descriptionHi: forestDescriptionsHi[id],
      priceDisplay: "Price verification pending",
      image: "/placeholder.svg",
      imageAlt: `No verified product photo supplied for ${name}; placeholder shown`,
      imageAltHi: `${nameHi} की सत्यापित उत्पाद फोटो उपलब्ध नहीं है; प्लेसहोल्डर दिखाया गया है`,
      images: ["/placeholder.svg"],
      seller: "Setu Nova forest producer group",
      location: ["Gadchiroli, Maharashtra", "Dantewada, Chhattisgarh", "Koraput, Odisha", "Jhabua, Madhya Pradesh"][index % 4],
      stock: 12 + (index % 13), rating: null, popularity: 82 - index,
      label: "Unpublished demo listing · compliance review required",
      isForestProduce: true,
      complianceStatus: "PENDING_REVIEW",
      priceType: "PRICE_PENDING",
      priceVerification: "PENDING",
      details: {
        ...(botanical ? {
        botanicalName: botanical[0], plantPart: botanical[1], source: botanical[2],
        processing: botanical[3], quantity: unit, storage: botanical[4],
        safety: "No medicinal benefits or cures are claimed. Identity, permissions, food-safety requirements and applicable product labels have not been verified.",
        complianceRequired: true,
      } : {
        source: "Community producer; collection rights and traceability must be verified",
        processing: "Seller to disclose batch handling and packing details",
        quantity: unit,
        storage: "Store sealed in a clean, dry place; check product label",
        safety: "Food-safety and applicable collection, ownership and product compliance have not been verified.",
      }),
        detailsHi,
        complianceStatus: "PENDING_REVIEW",
        documentReferences: "",
        harvestDate: "",
        packedDate: "",
        bestBefore: "",
      },
    };
  }),
  ...[
    ["cotton-fabric", "Handwoven Cotton Fabric", "हाथ से बुना सूती कपड़ा", "Handloom", 799, "meter", "Handwoven cotton fabric from an independent weaving group."],
    ["decor-box", "Handmade Decorative Box", "हस्तनिर्मित सजावटी डिब्बा", "Handicrafts", 449, "Each", "A hand-finished decorative storage box."],
    ["clay-figurines", "Clay Figurines", "मिट्टी की मूर्तियाँ", "Clay art", 349, "Set", "Small hand-moulded clay figurines, made in a village studio."],
    ["farm-produce", "Seasonal Farm Produce", "मौसमी कृषि उपज", "Agriculture", 0, "Seller-defined", "Demo listing. The producer sets the price, quantity, and harvest availability."],
  ].map(([id, name, nameHi, category, price, unit, description], index) => ({
    id, name, nameHi, category, price, unit, description, descriptionHi: otherDescriptionsHi[id],
    image: images.rural[index],
    imageAlt: `${name} product photo`,
    imageAltHi: `${nameHi} उत्पाद की फोटो`,
    seller: "Independent rural producer", location: ["Wardha, Maharashtra", "Chanderi, Madhya Pradesh", "Kutch, Gujarat", "Pan India"][index],
    stock: 20, rating: null, popularity: 65 - index,
    label: "Illustrative demo price",
    details: { materials: category === "Agriculture" ? "Seasonal produce; seller-defined details" : "Locally sourced materials" },
  })),
];

export const demoRentals = [
  { id: "rental-power-tiller", name: "Power tiller", category: "Agricultural equipment", price: 850, unit: "per day", location: "Nagpur, Maharashtra", owner: "Kisan Seva Group", available: "Available dates confirmed by owner", image: photoUrl("photo-1592982537447-7440770cbfc9"), imageAlt: "Demo agricultural tiller available for local rental", status: "AVAILABLE" },
  { id: "rental-seed-drill", name: "Seed drill", category: "Farm tools", price: 450, unit: "per day", location: "Raipur, Chhattisgarh", owner: "Gram Yantra Collective", available: "Available dates confirmed by owner", image: photoUrl("photo-1500382017468-9049fed747ef"), imageAlt: "Demo farm equipment rental listing", status: "AVAILABLE" },
  { id: "rental-weaving-loom", name: "Portable handloom", category: "Artisan tools", price: 300, unit: "per day", location: "Varanasi, Uttar Pradesh", owner: "Bunkar Sahayata Group", available: "Available dates confirmed by owner", image: photoUrl("photo-1610030469983-98e550d6193c"), imageAlt: "Demo weaving equipment available for rental", status: "AVAILABLE" },
];

export { categories };
