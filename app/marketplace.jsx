"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categories, demoProducts, demoRentals, isUnavailableProductPhoto } from "../lib/catalog.js";
import { forestCategory, forestSubcategories, forestResearchSources } from "../lib/forest-market-data.js";

const menuItems = [
  ["home", "Home", "⌂"], ["sell-products", "Sell Products", "＋"], ["buy-products", "Buy Products", "⌕"],
  ["buyer-requests", "Buyer Requests", "↗"], ["products", "Products", "▦"], ["marketplace", "Marketplace", "◈"],
  ["categories", "Categories", "▤"], ["forest-products", "Forest Produce", "♧"], ["my-basket", "My Basket", "▱"], ["my-orders", "My Orders", "▣"],
  ["track-my-order", "Track My Order", "↝"], ["wishlist", "Wishlist", "♡"], ["rental-marketplace", "Rental Marketplace", "⌁"],
  ["become-a-seller", "Become a Seller", "♧"], ["my-store", "My Store", "▣"], ["seller-dashboard", "Seller Dashboard", "◫"],
  ["messages-enquiries", "Messages / Enquiries", "✉"], ["notifications", "Notifications", "♢"], ["profile-account", "Profile & Account", "◉"],
  ["help-support", "Help & Support", "?"], ["settings", "Settings", "⚙"], ["forest-review", "Forest Review (Demo)", "✓"], ["logout", "Logout", "↪"],
];

const hiLabels = {
  home: "होम", "sell-products": "उत्पाद बेचें", "buy-products": "उत्पाद खरीदें", "buyer-requests": "खरीदार की माँग",
  products: "उत्पाद", marketplace: "बाज़ार", categories: "श्रेणियाँ", "forest-products": "वन उत्पाद", "forest-review": "वन समीक्षा (डेमो)", "my-basket": "मेरी टोकरी",
  "my-orders": "मेरे ऑर्डर", "track-my-order": "ऑर्डर ट्रैक करें", wishlist: "पसंदीदा",
  "rental-marketplace": "किराया बाज़ार", "become-a-seller": "विक्रेता बनें", "my-store": "मेरी दुकान",
  "seller-dashboard": "विक्रेता डैशबोर्ड", "messages-enquiries": "संदेश / पूछताछ", notifications: "सूचनाएँ",
  "profile-account": "प्रोफ़ाइल और खाता", "help-support": "सहायता", settings: "सेटिंग", logout: "लॉग आउट",
};

const categoryHi = {
  "All products": "सभी उत्पाद", [forestCategory]: "वन उपज और प्राकृतिक उत्पाद", "Forest produce": "वन उपज", Handicrafts: "हस्तशिल्प", Handloom: "हथकरघा",
  Bamboo: "बाँस", Dhokra: "ढोकरा", Jewellery: "आभूषण", "Clay art": "मिट्टी कला",
  "Wood carving": "लकड़ी की नक्काशी", Agriculture: "कृषि", "Rural products": "ग्रामीण उत्पाद", Rentals: "किराया",
  "Medicinal plants": "औषधीय पौधे",
};

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const currentPrice = (product) => Math.round(Number(product.price) * (100 - Number(product.discount || 0)) / 100);
const productImageSource = (source, productId) => {
  if (productId) {
    const catalogProduct = demoProducts.find((product) => product.id === productId);
    if (catalogProduct) return catalogProduct.image;
  }
  return !source || isUnavailableProductPhoto(source) ? "/placeholder.svg" : source;
};
const productImageSrcSet = (source) => {
  const match = /^https:\/\/images\.unsplash\.com\/([^?]+)(?:\?.*)?$/.exec(source || "");
  if (!match || isUnavailableProductPhoto(source)) return undefined;
  return [480, 900, 1400]
    .map((width) => `https://images.unsplash.com/${match[1]}?auto=format&fit=clip&w=${width}&q=85 ${width}w`)
    .join(", ");
};
function handleProductImageError(event) {
  const image = event.currentTarget;
  image.onerror = null;
  image.removeAttribute("srcset");
  image.src = "/placeholder.svg";
}
const safeRead = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from this browser.`, error);
    return fallback;
  }
};
const safeWrite = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save ${key} in this browser.`, error);
    return false;
  }
};

const labels = {
  en: {
    tagline: "LOCAL ROOTS. WIDER MARKETS.", search: "Search products, crafts, sellers…", location: "Delivering across India",
    signIn: "Sign in", basket: "Basket", demo: "DEMO MARKETPLACE · SAMPLE PRICES ARE ILLUSTRATIVE",
    browse: "Shop local. Discover more.", browseText: "Thoughtfully made goods, traceable producers, and a marketplace built for rural India.",
    explore: "Explore products", become: "Become a seller", featured: "Featured finds", newArrivals: "New arrivals",
    bestsellers: "Popular with buyers", sellers: "Popular producer groups", browseCategories: "Shop by category",
    requests: "Buyer requests", requestsText: "See what buyers are looking for and send a quotation.",
    products: "Products from across India", productSearch: "Find something local", filter: "Category",
    sort: "Sort by", newest: "Newest", popularity: "Popularity", priceLow: "Price: low to high", priceHigh: "Price: high to low",
    priceUpTo: "Maximum price", availability: "In stock only", allCategories: "All categories",
    add: "Add to basket", added: "Added", buyNow: "Buy now", wishlist: "Add to wishlist", wishlisted: "Saved",
    details: "View details", seller: "Seller", available: "in stock", unavailable: "out of stock",
    illustrative: "Illustrative demo price · not a verified market rate", empty: "No matching products. Try a different search or filter.",
    open: "Open request", quote: "Send quotation", postRequest: "Post a buyer request", title: "Request title",
    description: "Description", category: "Category", quantity: "Quantity needed", budget: "Total budget (₹)",
    locationLabel: "Delivery location (city / state)", requiredDate: "Required by", publishRequest: "Publish request",
    quotePrice: "Your total quote (₹)", deliveryDays: "Delivery estimate (days)", message: "Message to buyer",
    submitQuote: "Submit quotation", openRequests: "Open requests", quoteCount: "quotations",
    sellTitle: "List a product", sellIntro: "Share your work with buyers across India. Demo listings are saved to this local app database.",
    productName: "Product name", price: "Price (₹)", discount: "Discount (%)", unit: "Price unit", stock: "Available quantity",
    materials: "Materials", dimensions: "Dimensions", source: "Source / collection rights", processing: "Processing details",
    botanical: "Botanical name (if relevant)", plantPart: "Plant part", storage: "Storage details", safety: "Safety / label details",
    sellerName: "Seller / collective name", pickup: "Pickup city and state", upload: "Upload product photo (JPEG, PNG, WebP, max 5 MB)",
    compliance: "I confirm source rights, species permissions, applicable food safety and product labelling requirements have been checked.",
    saveDraft: "Save draft on this device", publish: "Publish listing", drafts: "Saved drafts", myListings: "My listings",
    edit: "Edit", pause: "Pause", remove: "Remove", republish: "Republish", status: "Status", orders: "Orders",
    noListings: "No seller listings yet. Publish a product to start your demo store.",
    basketTitle: "Your basket", subtotal: "Subtotal", shipping: "Estimated shipping", total: "Estimated total",
    freeShipping: "Free demo shipping over ₹999", deliveryRegion: "Delivery state / region", checkout: "Place demo order",
    checkoutDisclaimer: "Demo checkout only. No payment is collected, no real shipment is created, and no street address is stored.",
    emptyBasket: "Your basket is empty.", removeItem: "Remove", demoUnpaid: "Demo only · unpaid",
    order: "Order", orderPlaced: "Order placed", cancel: "Cancel order", track: "Track order",
    noOrders: "No orders yet. Orders you place in this demo will appear here.",
    trackingDisclaimer: "Demo tracking shows only events recorded in this app. No courier or real shipment is connected.",
    orderPlacedEvent: "Order placed", confirmed: "Confirmed", processing: "Processing", packed: "Packed",
    shipped: "Shipped", outForDelivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled",
    rentalTitle: "Rental marketplace", rentalIntro: "Request equipment from local owners. Every booking needs owner approval.",
    rentalFrom: "per day", startDate: "Rental start", endDate: "Rental end", requestBooking: "Request booking",
    bookings: "My booking requests", noBookings: "No demo rental requests yet.", rentalDisclaimer: "Availability and price must be confirmed by the owner. No payment is taken.",
    checkoutSuccess: "Demo order placed. No payment was taken.", saved: "Saved successfully.", requestSuccess: "Buyer request published.",
    quoteSuccess: "Quotation submitted.", uploadSuccess: "Photo uploaded.", draftsSaved: "Draft saved on this device.",
    loginDemo: "Demo profile only", loginNote: "Real sign-in, OTP, user roles and protected accounts are not configured.",
    personalData: "Do not enter payment details or sensitive personal information in this demo.",
    emptyWishlist: "Save products with the heart button and they will appear here.",
    sellerDashboard: "Seller dashboard", sales: "Demo sales total", pendingOrders: "Orders awaiting seller workflow",
    requestStatus: "Request status", noRequests: "No buyer requests yet.", emptyCategory: "Browse this category",
    helpText: "This is a local demo marketplace. For real orders, delivery, payments or seller support, contact the Setu Nova team.",
    allIndia: "Pan India",
    forestTitle: "Forest Produce & Natural Products",
    photoPending: "Verified seller product photo pending",
    forestSubtitle: "Traceable, seller-defined listings are shown only after review. Government MSP references are historical procurement figures, not retail prices.",
    forestPending: "Price verification pending",
    forestMsp: "Historical government MSP reference",
    forestMspDisclaimer: "These are Chhattisgarh government Minimum Support Prices for collection year 2024–25, not current rates, market observations, retail prices or a guaranteed procurement offer. Product form and grade are shown only as published; verify current applicable rates independently.",
    forestSources: "Research sources and limitations",
    forestReview: "Forest listing review",
    forestReviewDisclaimer: "Local demo workflow only: this project has no authenticated seller/admin identities or private compliance-document storage. Reviewers must inspect source documents offline and verify jurisdiction-specific requirements before approval. Demo review is not government, legal, FSSAI or AYUSH approval.",
    forestEvidence: "Document reference IDs (reviewed offline)",
    forestReviewNote: "Reviewer note: identify evidence checked and requirements verified",
    forestApprove: "Approve after evidence review",
    forestCorrections: "Request corrections",
    forestReject: "Reject listing",
    forestSuspend: "Suspend listing",
    forestNoReview: "No seller forest listings are waiting for review.",
    harvestDate: "Harvest / collection date (if applicable)",
    packedDate: "Packing date",
    bestBefore: "Best before / expiry date (if applicable)",
    medicinal: "This is a medicinal plant raw material",
    productSubcategory: "Forest product subcategory",
    reviewedBadge: "Reviewed listing · seller-defined price (not market verified)",
  },
  hi: {
    tagline: "स्थानीय जड़ें। बड़ा बाज़ार।", search: "उत्पाद, हस्तशिल्प, विक्रेता खोजें…", location: "पूरे भारत में डिलीवरी",
    signIn: "साइन इन", basket: "टोकरी", demo: "डेमो बाज़ार · नमूना कीमतें केवल उदाहरण हैं",
    browse: "स्थानीय खरीदें। नया खोजें।", browseText: "सोच-समझकर बने उत्पाद, विश्वसनीय उत्पादक और ग्रामीण भारत के लिए बाज़ार।",
    explore: "उत्पाद देखें", become: "विक्रेता बनें", featured: "चुनिंदा उत्पाद", newArrivals: "नए उत्पाद",
    bestsellers: "लोकप्रिय उत्पाद", sellers: "लोकप्रिय उत्पादक समूह", browseCategories: "श्रेणी के अनुसार खरीदें",
    requests: "खरीदार की माँग", requestsText: "खरीदार की ज़रूरत देखें और अपना भाव भेजें।",
    products: "पूरे भारत के उत्पाद", productSearch: "स्थानीय उत्पाद खोजें", filter: "श्रेणी",
    sort: "क्रम", newest: "नए पहले", popularity: "लोकप्रियता", priceLow: "कीमत: कम से अधिक", priceHigh: "कीमत: अधिक से कम",
    priceUpTo: "अधिकतम कीमत", availability: "केवल उपलब्ध", allCategories: "सभी श्रेणियाँ",
    add: "टोकरी में डालें", added: "जुड़ गया", buyNow: "अभी खरीदें", wishlist: "पसंदीदा में जोड़ें", wishlisted: "सहेजा",
    details: "विवरण देखें", seller: "विक्रेता", available: "उपलब्ध", unavailable: "स्टॉक नहीं",
    illustrative: "केवल उदाहरण की कीमत · सत्यापित बाज़ार दर नहीं", empty: "उत्पाद नहीं मिले। खोज या फ़िल्टर बदलें।",
    open: "खुला अनुरोध", quote: "भाव भेजें", postRequest: "खरीदार की माँग पोस्ट करें", title: "अनुरोध का नाम",
    description: "विवरण", category: "श्रेणी", quantity: "माँगी गई मात्रा", budget: "कुल बजट (₹)",
    locationLabel: "डिलीवरी स्थान (शहर / राज्य)", requiredDate: "कब तक चाहिए", publishRequest: "अनुरोध पोस्ट करें",
    quotePrice: "आपका कुल भाव (₹)", deliveryDays: "डिलीवरी समय (दिन)", message: "खरीदार के लिए संदेश",
    submitQuote: "भाव जमा करें", openRequests: "खुले अनुरोध", quoteCount: "भाव",
    sellTitle: "उत्पाद सूची बनाएँ", sellIntro: "भारत भर के खरीदारों से जुड़ें। डेमो उत्पाद इस ऐप के स्थानीय डेटाबेस में सहेजे जाते हैं।",
    productName: "उत्पाद का नाम", price: "कीमत (₹)", discount: "छूट (%)", unit: "कीमत की इकाई", stock: "उपलब्ध मात्रा",
    materials: "सामग्री", dimensions: "आकार", source: "स्रोत / संग्रह अधिकार", processing: "प्रसंस्करण विवरण",
    botanical: "वनस्पति नाम (यदि लागू)", plantPart: "पौधे का भाग", storage: "भंडारण विवरण", safety: "सुरक्षा / लेबल जानकारी",
    sellerName: "विक्रेता / समूह का नाम", pickup: "पिकअप शहर और राज्य", upload: "उत्पाद फ़ोटो अपलोड करें (JPEG, PNG, WebP, अधिकतम 5 MB)",
    compliance: "मैं पुष्टि करता/करती हूँ कि स्रोत अधिकार, प्रजाति अनुमति, खाद्य सुरक्षा और उत्पाद लेबल की जाँच की गई है।",
    saveDraft: "ड्राफ़्ट इस डिवाइस पर सहेजें", publish: "उत्पाद प्रकाशित करें", drafts: "सहेजे ड्राफ़्ट", myListings: "मेरे उत्पाद",
    edit: "संपादित", pause: "रोकें", remove: "हटाएँ", republish: "फिर प्रकाशित करें", status: "स्थिति", orders: "ऑर्डर",
    noListings: "अभी कोई उत्पाद नहीं। अपनी दुकान शुरू करने के लिए उत्पाद प्रकाशित करें।",
    basketTitle: "आपकी टोकरी", subtotal: "उप-योग", shipping: "अनुमानित डिलीवरी", total: "अनुमानित कुल",
    freeShipping: "₹999 से अधिक पर डेमो डिलीवरी मुफ़्त", deliveryRegion: "डिलीवरी राज्य / क्षेत्र", checkout: "डेमो ऑर्डर करें",
    checkoutDisclaimer: "केवल डेमो चेकआउट। कोई भुगतान या असली शिपमेंट नहीं; घर का पता सहेजा नहीं जाता।",
    emptyBasket: "आपकी टोकरी खाली है।", removeItem: "हटाएँ", demoUnpaid: "केवल डेमो · भुगतान नहीं",
    order: "ऑर्डर", orderPlaced: "ऑर्डर दिया", cancel: "ऑर्डर रद्द करें", track: "ट्रैक करें",
    noOrders: "अभी ऑर्डर नहीं हैं। डेमो ऑर्डर यहाँ दिखेंगे।",
    trackingDisclaimer: "डेमो में सिर्फ़ इस ऐप में दर्ज घटनाएँ दिखती हैं। कोई कूरियर या असली शिपमेंट नहीं जुड़ा।",
    orderPlacedEvent: "ऑर्डर दिया", confirmed: "पुष्टि", processing: "प्रसंस्करण", packed: "पैक", shipped: "भेजा",
    outForDelivery: "डिलीवरी के लिए निकला", delivered: "डिलीवर", cancelled: "रद्द",
    rentalTitle: "किराया बाज़ार", rentalIntro: "स्थानीय मालिकों से उपकरण माँगें। बुकिंग के लिए मालिक की मंज़ूरी ज़रूरी है।",
    rentalFrom: "प्रतिदिन", startDate: "किराया शुरू", endDate: "किराया समाप्त", requestBooking: "बुकिंग अनुरोध",
    bookings: "मेरी बुकिंग", noBookings: "कोई किराया अनुरोध नहीं।", rentalDisclaimer: "उपलब्धता और कीमत मालिक पुष्टि करेंगे। भुगतान नहीं लिया जाता।",
    checkoutSuccess: "डेमो ऑर्डर दिया। कोई भुगतान नहीं हुआ।", saved: "सफलतापूर्वक सहेजा।", requestSuccess: "खरीदार अनुरोध पोस्ट हुआ।",
    quoteSuccess: "भाव जमा हुआ।", uploadSuccess: "फ़ोटो अपलोड हुई।", draftsSaved: "ड्राफ़्ट इस डिवाइस पर सहेजा।",
    loginDemo: "केवल डेमो प्रोफ़ाइल", loginNote: "असली साइन-इन, OTP, भूमिका और सुरक्षित खाते उपलब्ध नहीं हैं।",
    personalData: "इस डेमो में भुगतान विवरण या संवेदनशील निजी जानकारी न डालें।",
    emptyWishlist: "दिल का बटन दबाकर उत्पाद सहेजें। वे यहाँ दिखेंगे।",
    sellerDashboard: "विक्रेता डैशबोर्ड", sales: "डेमो बिक्री कुल", pendingOrders: "विक्रेता कार्य की प्रतीक्षा में",
    requestStatus: "अनुरोध की स्थिति", noRequests: "अभी खरीदार अनुरोध नहीं।", emptyCategory: "इस श्रेणी के उत्पाद देखें",
    helpText: "यह स्थानीय डेमो बाज़ार है। असली ऑर्डर, डिलीवरी, भुगतान या सहायता के लिए Setu Nova टीम से संपर्क करें।",
    allIndia: "पूरे भारत में",
    forestTitle: "वन उपज और प्राकृतिक उत्पाद",
    photoPending: "सत्यापित विक्रेता फोटो की प्रतीक्षा",
    forestSubtitle: "स्रोत-योग्य, विक्रेता द्वारा तय सूची समीक्षा के बाद ही दिखाई जाती हैं। सरकारी MSP संदर्भ ऐतिहासिक खरीद मूल्य हैं, खुदरा मूल्य नहीं।",
    forestPending: "मूल्य सत्यापन लंबित",
    forestMsp: "ऐतिहासिक सरकारी MSP संदर्भ",
    forestMspDisclaimer: "ये छत्तीसगढ़ के 2024–25 संग्रह वर्ष के न्यूनतम समर्थन मूल्य हैं; वर्तमान दर, बाजार भाव, खुदरा मूल्य या सुनिश्चित खरीद प्रस्ताव नहीं। उत्पाद का रूप और ग्रेड स्रोत के अनुसार ही दिया गया है; वर्तमान लागू दर स्वतंत्र रूप से जाँचें।",
    forestSources: "शोध स्रोत और सीमाएँ",
    forestReview: "वन सूची समीक्षा",
    forestReviewDisclaimer: "केवल स्थानीय डेमो कार्यप्रवाह: इस परियोजना में प्रमाणित विक्रेता/प्रशासक पहचान या निजी अनुपालन दस्तावेज़ संग्रहण नहीं है। समीक्षक को मंज़ूरी से पहले मूल दस्तावेज़ ऑफ़लाइन देखकर क्षेत्रानुसार आवश्यकताएँ जाँचनी होंगी। डेमो समीक्षा सरकारी, कानूनी, FSSAI या AYUSH मंज़ूरी नहीं है।",
    forestEvidence: "दस्तावेज़ संदर्भ आईडी (ऑफ़लाइन जाँची गई)",
    forestReviewNote: "समीक्षक टिप्पणी: जाँचे गए प्रमाण और आवश्यकताएँ लिखें",
    forestApprove: "प्रमाण जाँच के बाद मंज़ूर करें",
    forestCorrections: "सुधार माँगें",
    forestReject: "सूची अस्वीकार करें",
    forestSuspend: "सूची निलंबित करें",
    forestNoReview: "समीक्षा के लिए कोई विक्रेता वन सूची लंबित नहीं है।",
    harvestDate: "कटाई / संग्रह तिथि (यदि लागू)",
    packedDate: "पैकिंग तिथि",
    bestBefore: "उपयोग की अंतिम तिथि (यदि लागू)",
    medicinal: "यह औषधीय पौधे का कच्चा माल है",
    productSubcategory: "वन उत्पाद उपश्रेणी",
    reviewedBadge: "समीक्षित सूची · विक्रेता मूल्य (बाजार सत्यापित नहीं)",
  },
};

const actionForSection = {
  home: "Home", "sell-products": "Sell Products", "buy-products": "Buy Products",
  "buyer-requests": "Buyer Requests", products: "Products", marketplace: "Marketplace",
  categories: "Categories", "forest-products": "Forest Produce & Natural Products", "forest-review": "Forest Review (Demo)", "my-basket": "My Basket", "my-orders": "My Orders",
  "track-my-order": "Track My Order", wishlist: "Wishlist", "rental-marketplace": "Rental Marketplace",
  "become-a-seller": "Become a Seller", "my-store": "My Store", "seller-dashboard": "Seller Dashboard",
  "messages-enquiries": "Messages / Enquiries", notifications: "Notifications",
  "profile-account": "Profile & Account", "help-support": "Help & Support", settings: "Settings", logout: "Logout",
};

const detailLabelsHi = {
  materials: "सामग्री",
  dimensions: "आकार",
  packaging: "पैकेजिंग",
  source: "स्रोत / संग्रह अधिकार",
  processing: "प्रसंस्करण विवरण",
  botanicalName: "वनस्पति नाम",
  plantPart: "पौधे का भाग",
  storage: "भंडारण",
  safety: "सुरक्षा / लेबल जानकारी",
  quantity: "मात्रा",
  harvestDate: "कटाई / संग्रह तिथि",
  packedDate: "पैकिंग तिथि",
  bestBefore: "उपयोग की अंतिम तिथि",
  complianceStatus: "अनुपालन स्थिति",
};

const forestSubcategoriesHi = {
  "Amla, Harad, Baheda & Reetha": "आँवला, हरड़, बहेड़ा और रीठा",
  "Mahua flowers & seeds": "महुआ फूल और बीज",
  "Tamarind, Chironji & Sal seeds": "इमली, चिरौंजी और साल बीज",
  "Forest honey & permitted natural produce": "वन शहद और अनुमत प्राकृतिक उपज",
  "Shikakai, Kalmegh & botanical products": "शिकाकाई, कालमेघ और वनस्पति उत्पाद",
  "Bamboo, leaves, fibres, gums & handicrafts": "बाँस, पत्तियाँ, रेशे, गोंद और हस्तशिल्प",
  "Permitted medicinal plant raw materials": "अनुमत औषधीय पौधों का कच्चा माल",
};

function Icon({ children, small = false }) {
  return <span className={`side-icon ${small ? "side-icon-small" : ""}`} aria-hidden="true">{children}</span>;
}

function ProductCard({ product, t, language, wished, onWishlist, onAdd, onBuy, onDetails }) {
  return (
    <article className="market-product-card">
      <div className="market-product-image">
        <a className="product-image-link" href={`/products/${encodeURIComponent(product.id)}`} aria-label={`${t.details}: ${product.name}`}>
        <img src={productImageSource(product.image)} srcSet={productImageSrcSet(product.image)} sizes="(max-width: 560px) 45vw, (max-width: 1200px) 30vw, 25vw" alt={(language === "hi" ? product.imageAltHi : product.imageAlt) || product.imageAlt || `${product.name}, handmade or produced in India`} loading="lazy" decoding="async" onError={handleProductImageError} />
        </a>
        <span className="price-ribbon">{product.priceDisplay || product.label || t.illustrative}</span>
        {product.isForestProduce && product.image === "/placeholder.svg" && <span className="photo-pending-badge">{t.photoPending}</span>}
        <button className={`heart-button ${wished ? "is-wished" : ""}`} type="button" aria-label={wished ? t.wishlisted : t.wishlist} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onWishlist(product.id); }}>{wished ? "♥" : "♡"}</button>
      </div>
      <div className="market-product-body">
        <div className="market-product-overline"><span>{product.subcategory ? language === "hi" ? forestSubcategoriesHi[product.subcategory] || product.subcategory : product.subcategory : language === "hi" ? categoryHi[product.category] || product.category : product.category}</span>{product.rating && <span>★ {product.rating}</span>}</div>
        <a href={`/products/${encodeURIComponent(product.id)}`} className="market-product-name">{language === "hi" ? product.nameHi || product.name : product.name}</a>
        <p className="market-product-seller">{language === "hi" ? product.sellerHi || product.seller : product.seller} · {language === "hi" ? product.locationHi || product.location || "भारत" : product.location || "India"}</p>
        <p className="market-product-desc">{language === "hi" ? product.descriptionHi || product.description : product.description}</p>
        <div className="market-product-price"><strong>{product.priceVerification === "PENDING" ? t.forestPending : product.price > 0 ? money(currentPrice(product)) : "Seller-defined"}</strong>{product.discount > 0 && <del>{money(product.price)}</del>}{product.priceVerification !== "PENDING" && <span> / {product.unit}</span>}<small>{product.stock > 0 ? `${product.stock} ${t.available}` : t.unavailable}</small></div>
        <div className="market-product-actions">
          <button type="button" disabled={product.stock < 1 || product.price <= 0} className="market-add" onClick={() => onAdd(product)}>{t.add}</button>
          <button type="button" disabled={product.stock < 1 || product.price <= 0} className="market-buy" onClick={() => onBuy(product)}>{t.buyNow}</button>
          <button type="button" className="market-view" onClick={() => onDetails(product)}>{t.details}</button>
        </div>
      </div>
    </article>
  );
}

export default function Marketplace({ initialPath = [], initialSearch = "", initialCategory = "", initialOrderFilter = "", initialEditId = "" }) {
  const router = useRouter();
  const section = initialPath[0] || "home";
  const detailId = section === "products" && initialPath.length > 1 ? decodeURIComponent(initialPath[1]) : "";
  const [language, setLanguage] = useState("en");
  const [products, setProducts] = useState(demoProducts);
  const [myListings, setMyListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState(demoRentals);
  const [bookings, setBookings] = useState([]);
  const [forestReviewListings, setForestReviewListings] = useState([]);
  const [forestPriceReferences, setForestPriceReferences] = useState([]);
  const [forestPriceHistory, setForestPriceHistory] = useState([]);
  const [forestAudit, setForestAudit] = useState([]);
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [recent, setRecent] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(section === "forest-products" ? forestCategory : categories.includes(initialCategory) ? initialCategory : "All products");
  const [subcategory, setSubcategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("popularity");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderFilter, setOrderFilter] = useState(initialOrderFilter);
  const [sellerFilter, setSellerFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minimumRating, setMinimumRating] = useState("");
  const [deliveryRegion, setDeliveryRegion] = useState("India");
  const [locationOpen, setLocationOpen] = useState(false);
  const [languageReady, setLanguageReady] = useState(false);
  const copy = labels[language];

  function chooseRegion(region) {
    setDeliveryRegion(region);
    setLocationOpen(false);
    try {
      window.localStorage.setItem("setu-region", region);
    } catch (storageError) {
      console.error("Could not save the selected delivery region.", storageError);
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/marketplace", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Marketplace data could not be loaded.");
      setProducts(result.products);
      setMyListings(result.sellerProducts || []);
      setRequests(result.requests);
      setOrders(result.orders);
      setRentals(result.rentals);
      setBookings(result.bookings);
      setForestReviewListings(result.forestReview || []);
      setForestPriceReferences(result.forestPriceReferences?.records || []);
      setForestPriceHistory(result.forestPriceHistory || []);
      setForestAudit(result.forestAudit || []);
    } catch (loadError) {
      console.error("Marketplace data request failed.", loadError);
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    let savedLanguage;
    let savedRegion;
    try {
      savedLanguage = window.localStorage.getItem("setu-language");
      savedRegion = window.localStorage.getItem("setu-region");
    } catch (storageError) {
      console.error("Could not load saved marketplace preferences.", storageError);
    }
    if (savedLanguage === "hi" || savedLanguage === "en") setLanguage(savedLanguage);
    setCart(safeRead("setu-nova-cart", {}));
    setWishlist(safeRead("setu-nova-wishlist", []));
    setRecent(safeRead("setu-nova-recent", []));
    setDrafts(safeRead("setu-nova-drafts", []));
    setLanguageReady(true);
    if (savedRegion) setDeliveryRegion(savedRegion);
  }, [loadData]);

  useEffect(() => { if (languageReady) safeWrite("setu-nova-cart", cart); }, [cart, languageReady]);
  useEffect(() => { if (languageReady) safeWrite("setu-nova-wishlist", wishlist); }, [wishlist, languageReady]);
  useEffect(() => { if (languageReady) safeWrite("setu-nova-recent", recent); }, [recent, languageReady]);
  useEffect(() => { if (languageReady) safeWrite("setu-nova-drafts", drafts); }, [drafts, languageReady]);

  const currentProduct = detailId ? products.find((product) => product.id === detailId) : null;
  useEffect(() => {
    if (currentProduct) setRecent((current) => [currentProduct.id, ...current.filter((id) => id !== currentProduct.id)].slice(0, 8));
  }, [currentProduct]);
  useEffect(() => {
    if (!initialEditId || !products.length) return;
    const product = [...myListings, ...products].find((item) => item.id === initialEditId);
    if (product) setEditingProduct(product);
  }, [initialEditId, products, myListings]);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchingCategory = category === "All products" || product.category === category || (category === "Forest produce" && product.category === forestCategory);
      const matchingSubcategory = !subcategory || product.subcategory === subcategory;
      const matchingTerm = !term || `${product.name} ${product.nameHi || ""} ${product.description} ${product.descriptionHi || ""} ${product.seller} ${product.sellerHi || ""} ${product.location} ${product.locationHi || ""} ${product.category} ${product.subcategory || ""} ${product.subcategoryHi || ""}`.toLocaleLowerCase().includes(term);
      const matchingPrice = !maxPrice || Number(product.price) <= Number(maxPrice);
      const matchingSeller = !sellerFilter || product.seller === sellerFilter;
      const matchingLocation = !locationFilter || `${product.location || ""} ${product.locationHi || ""}`.toLowerCase().includes(locationFilter.toLowerCase());
      const matchingRating = !minimumRating || (Number(product.rating) || 0) >= Number(minimumRating);
      return matchingCategory && matchingSubcategory && matchingTerm && matchingPrice && matchingSeller && matchingLocation && matchingRating && (!inStockOnly || product.stock > 0);
    });
    const originalOrder = new Map(products.map((product, index) => [product.id, index]));
    return filtered.sort((a, b) => sort === "newest" ? originalOrder.get(a.id) - originalOrder.get(b.id) : sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : (b.popularity || 0) - (a.popularity || 0));
  }, [products, category, subcategory, search, maxPrice, inStockOnly, sort, sellerFilter, locationFilter, minimumRating]);

  const cartProducts = products.filter((product) => Number(cart[product.id]) > 0);
  const cartCount = cartProducts.reduce((sum, product) => sum + Number(cart[product.id]), 0);
  const subtotal = cartProducts.reduce((sum, product) => sum + currentPrice(product) * Number(cart[product.id]), 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;
  const starredProducts = products.filter((product) => wishlist.includes(product.id));
  const recentProducts = recent.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const searchSuggestions = search.trim() ? products.filter((product) => `${product.name} ${product.nameHi || ""} ${product.description} ${product.descriptionHi || ""} ${product.seller} ${product.sellerHi || ""} ${product.category}`.toLowerCase().includes(search.toLowerCase())).slice(0, 5) : [];
  const searchForestReferences = search.trim() ? forestPriceReferences.filter((reference) =>
    `${reference.productName} ${reference.productNameHi || ""} ${reference.botanicalName || ""} ${reference.productForm} ${reference.plantPart || ""} ${reference.stateOrMarket}`.toLowerCase().includes(search.toLowerCase())) : [];
  const activeLabel = actionForSection[section] || "Marketplace";
  const activeTitle = language === "hi" ? hiLabels[section] || activeLabel : activeLabel;

  function changeLanguage() {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
    try {
      window.localStorage.setItem("setu-language", next);
    } catch (storageError) {
      console.error("Could not save the selected language.", storageError);
    }
  }

  function navigateSearch(event) {
    event.preventDefault();
    setSuggestionsOpen(false);
    router.push(`/products?q=${encodeURIComponent(search)}`);
  }

  function addItem(product, goToBasket = false) {
    if (product.stock < 1) return;
    setCart((current) => ({ ...current, [product.id]: Math.min(product.stock, (Number(current[product.id]) || 0) + 1) }));
    setNotice(`${product.name} ${copy.added.toLowerCase()}.`);
    if (goToBasket) router.push("/my-basket");
  }

  function toggleWishlist(id) {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setNotice(copy.saved);
  }

  async function postAction(body, successMessage, afterSuccess) {
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/marketplace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not complete that action.");
      setNotice(successMessage);
      if (afterSuccess) await afterSuccess(result);
      await loadData();
      return result;
    } catch (actionError) {
      console.error("Marketplace action failed.", actionError);
      setError(actionError.message);
      return null;
    }
  }

  async function uploadImage(file) {
    if (!file) return "";
    const form = new FormData();
    form.set("image", file);
    setError("");
    const response = await fetch("/api/uploads", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Image upload failed.");
    return result.url;
  }

  async function submitListing(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setError("");
    try {
      const images = formData.getAll("imageFiles").filter((file) => file instanceof File && file.size);
      if (images.length > 8) throw new Error("Upload no more than 8 product photos.");
      if (images.some((file) => file.size > 5 * 1024 * 1024)) throw new Error("Each product photo must be no larger than 5 MB.");
      const uploadedImages = [];
      for (const imageFile of images) uploadedImages.push(await uploadImage(imageFile));
      let image = uploadedImages[0] || formData.get("imageUrl");
      const product = Object.fromEntries(formData.entries());
      delete product.imageFiles;
      delete product.imageUrl;
      product.image = image || "/placeholder.svg";
      product.images = uploadedImages.length ? uploadedImages : editingProduct?.images || (image ? [image] : []);
      product.stock = Number(product.stock);
      product.price = Number(product.price);
      product.discount = Number(product.discount || 0);
      product.complianceRequired = formData.get("complianceRequired") === "on";
      product.isMedicinal = formData.get("isMedicinal") === "on";
      const action = editingProduct ? { action: "update-listing", id: editingProduct.id, product } : { action: "create-listing", product };
      const result = await postAction(action, product.category === forestCategory ? "Saved as pending review. It is not public or purchasable until approval." : copy.saved);
      if (result) {
        setEditingProduct(null);
        form.reset();
      }
    } catch (uploadError) {
      console.error("Seller image upload failed.", uploadError);
      setError(uploadError.message);
    }
  }

  function saveDraft(event) {
    const form = event.currentTarget.form;
    if (!form) return;
    const formData = new FormData(form);
    const draft = Object.fromEntries(formData.entries());
    draft.id = `draft-${Date.now()}`;
    setDrafts((current) => [draft, ...current]);
    setNotice(copy.draftsSaved);
  }

  async function createOrder(event) {
    event.preventDefault();
    if (!cartCount) return;
    const data = await postAction({
      action: "create-order",
      items: cartProducts.map((product) => ({ id: product.id, quantity: Number(cart[product.id]) })),
      deliveryRegion: new FormData(event.currentTarget).get("deliveryRegion"),
    }, copy.checkoutSuccess);
    if (data) {
      setCart({});
      router.push("/my-orders");
    }
  }

  const onAdd = (product) => addItem(product);
  const onBuy = (product) => addItem(product, true);
  const onDetails = (product) => router.push(`/products/${encodeURIComponent(product.id)}`);

  function productGrid(list, emptyText = copy.empty) {
    if (loading) return <div className="market-empty"><span className="loading-mark">✳</span><p>Loading local listings…</p></div>;
    if (!list.length) return <div className="market-empty"><span>⌕</span><p>{emptyText}</p></div>;
    return <div className="market-product-grid">{list.map((product) => <ProductCard key={product.id} product={product} t={copy} language={language} wished={wishlist.includes(product.id)} onWishlist={toggleWishlist} onAdd={onAdd} onBuy={onBuy} onDetails={onDetails} />)}</div>;
  }

  function sectionHeading(title, subtitle) {
    return <div className="page-heading"><div><p className="eyebrow">{copy.demo}</p><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>;
  }

  function renderFilters() {
    return <div className="catalog-filters">
      <label>{copy.filter}<select value={category} onChange={(event) => { setCategory(event.target.value); if (event.target.value !== forestCategory) setSubcategory(""); }}><option>All products</option>{categories.filter((item) => item !== "Rentals").map((item) => <option key={item} value={item}>{language === "hi" ? categoryHi[item] || item : item}</option>)}</select></label>
      {(category === forestCategory || section === "forest-products") && <label>{copy.productSubcategory}<select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}><option value="">{language === "hi" ? "सभी वन उपश्रेणियाँ" : "All forest subcategories"}</option>{forestSubcategories.map((item) => <option key={item} value={item}>{language === "hi" ? forestSubcategoriesHi[item] : item}</option>)}</select></label>}
      <label>{copy.priceUpTo}<input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="₹ —" /></label>
      <label>{copy.sort}<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popularity">{copy.popularity}</option><option value="newest">{copy.newest}</option><option value="price-low">{copy.priceLow}</option><option value="price-high">{copy.priceHigh}</option></select></label>
      <label>Seller<select value={sellerFilter} onChange={(event) => setSellerFilter(event.target.value)}><option value="">All sellers</option>{Array.from(new Set(products.map((product) => product.seller))).sort().map((seller) => <option key={seller}>{seller}</option>)}</select></label>
      <label>Location<input value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} placeholder="City / State" /></label>
      <label>Minimum rating<select value={minimumRating} onChange={(event) => setMinimumRating(event.target.value)}><option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option></select></label>
      <label className="stock-filter"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />{copy.availability}</label>
    </div>;
  }

  function forestPricingPanel(references = search.trim() ? searchForestReferences : forestPriceReferences) {
    return <section className="forest-research">
      <div className="forest-research-heading"><span>PRICE TRANSPARENCY · RESEARCH REFERENCES</span><h2>{copy.forestMsp}</h2><p>{copy.forestMspDisclaimer}</p></div>
      {!references.length && <p className="muted-notice">No matching source-recorded price reference. No current rate is available here; use a seller-defined price pending independent verification.</p>}
      <div className="forest-price-grid">{references.map((reference) => <article key={reference.id} className="forest-price-card">
        <span className="request-badge">{language === "hi" ? "सरकारी न्यूनतम समर्थन मूल्य (MSP)" : reference.priceType.replaceAll("_", " ")}</span>
        <h3>{language === "hi" ? reference.productNameHi : reference.productName}</h3>
        <strong>{money(reference.amount)} <small>/ {reference.unit}</small></strong>
        <dl><div><dt>{language === "hi" ? "राज्य / बाज़ार" : "Market / state"}</dt><dd>{reference.stateOrMarket}</dd></div><div><dt>{language === "hi" ? "संग्रह वर्ष" : "Collection year"}</dt><dd>{reference.collectionYear}</dd></div><div><dt>{language === "hi" ? "उत्पाद का रूप" : "Product form"}</dt><dd>{reference.productForm}</dd></div><div><dt>{language === "hi" ? "ग्रेड" : "Grade"}</dt><dd>{language === "hi" ? "स्रोत में निर्दिष्ट नहीं" : reference.grade}</dd></div><div><dt>{language === "hi" ? "प्रसंस्करण" : "Processing"}</dt><dd>{language === "hi" ? reference.processingState.includes("Dry") ? "सूखा (स्रोत में उल्लेखित)" : "स्रोत में निर्दिष्ट नहीं" : reference.processingState}</dd></div>{reference.botanicalName && <div><dt>{language === "hi" ? "वनस्पति नाम" : "Botanical name"}</dt><dd><i>{reference.botanicalName}</i></dd></div>}{reference.plantPart && <div><dt>{language === "hi" ? "पौधे का भाग" : "Plant part"}</dt><dd>{language === "hi" ? reference.plantPart === "Fruit" ? "फल" : reference.plantPart === "Flower" ? "फूल" : reference.plantPart === "Seed" ? "बीज" : reference.plantPart : reference.plantPart}</dd></div>}</dl>
        <p className="forest-price-source">{language === "hi" ? "ऐतिहासिक सरकारी खरीद MSP; विक्रेता का मूल्य नहीं।" : "Historical government procurement MSP; not a seller price."}</p>
        <a href={reference.sourceUrl} target="_blank" rel="noreferrer">{reference.sourceName} ↗</a>
        <small>{language === "hi" ? `स्रोत जाँच तिथि ${reference.accessedOn}; स्रोत में संग्रह वर्ष 2024–25 दिया है।` : `Source checked ${reference.accessedOn}; source states collection year 2024–25.`}</small>
      </article>)}</div>
      <details className="forest-sources"><summary>{copy.forestSources}</summary>{forestResearchSources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a><span>{source.note}</span></p>)}</details>
    </section>;
  }

  function forestSearchSuggestionButtons() {
    return searchForestReferences.slice(0, 4).map((reference) => <button key={`msp-${reference.id}`} type="button" onClick={() => {
      setSuggestionsOpen(false);
      router.push(`/forest-products?q=${encodeURIComponent(reference.productName)}`);
    }}>
      <img src="/placeholder.svg" alt="" />
      <span><strong>{reference.productName} · historical MSP</strong><small>{money(reference.amount)} / {reference.unit} · Chhattisgarh · 2024–25</small></span>
    </button>);
  }

  function forestReviewSection() {
    return <>
      {sectionHeading(copy.forestReview, copy.forestReviewDisclaimer)}
      <div className="disclaimer-banner">{copy.forestReviewDisclaimer}</div>
      {forestReviewListings.length ? <div className="request-list forest-review-list">{forestReviewListings.map((product) => <article className="request-card" key={product.id}>
        <div className="request-card-heading"><div><span className="request-badge">{product.status.replaceAll("_", " ")}</span><h3>{product.name} · {product.nameHi}</h3></div><strong>{money(product.price)} / {product.unit}</strong></div>
        <div className="forest-review-product"><img src={productImageSource(product.image)} srcSet={productImageSrcSet(product.image)} sizes="130px" alt={(language === "hi" ? product.imageAltHi : product.imageAlt) || product.imageAlt || product.name} loading="lazy" decoding="async" onError={handleProductImageError} /><div><p>{language === "hi" ? product.descriptionHi || product.description : product.description}</p><p>{language === "hi" ? product.sellerHi || product.seller : product.seller} · {language === "hi" ? product.locationHi || product.location || "भारत" : product.location}</p><p>{language === "hi" ? forestSubcategoriesHi[product.subcategory] || product.subcategory : product.subcategory}</p><p>{product.details?.botanicalName || (language === "hi" ? "वनस्पति पहचान दर्ज नहीं" : "Botanical identity not recorded")} · {language === "hi" ? product.detailsHi?.plantPart || product.details?.plantPart || "पौधे का भाग दर्ज नहीं" : product.details?.plantPart || "Plant part not recorded"}</p><p>{language === "hi" ? "स्रोत" : "Source"}: {language === "hi" ? product.detailsHi?.source || product.details?.source || "दर्ज नहीं" : product.details?.source || "Not recorded"} · {language === "hi" ? "प्रसंस्करण" : "Processing"}: {language === "hi" ? product.detailsHi?.processing || product.details?.processing || "दर्ज नहीं" : product.details?.processing || "Not recorded"}</p><p>{language === "hi" ? "तिथियाँ" : "Dates"}: {language === "hi" ? "संग्रह" : "collected"} {product.details?.harvestDate || "—"} · {language === "hi" ? "पैकिंग" : "packed"} {product.details?.packedDate || "—"} · {language === "hi" ? "उपयोग की अंतिम तिथि" : "best before"} {product.details?.bestBefore || "—"}</p><p>{language === "hi" ? "दस्तावेज़" : "Documents"}: {product.details?.documentReferences || (language === "hi" ? "संदर्भ आईडी नहीं दी गई" : "No reference IDs supplied")}</p></div></div>
        <div className="forest-audit-history">{forestAudit.filter((event) => event.listingId === product.id).map((event) => <p key={`${event.listingId}-${event.createdAt}-${event.action}`}>{event.action} · {new Date(event.createdAt).toLocaleString()} · {event.note}</p>)}</div>
        <form className="forest-review-form" onSubmit={(event) => event.preventDefault()}>
          <label>{copy.forestReviewNote}<textarea name="reviewNote" minLength="10" maxLength="800" required /></label>
          <div className="inline-actions">
            {product.status !== "PUBLISHED" && <button type="button" className="primary-action" onClick={(event) => {
              const article = event.currentTarget.closest("article");
              const note = article.querySelector('[name="reviewNote"]').value;
              postAction({ action: "review-forest-listing", id: product.id, decision: "APPROVE", note }, copy.saved);
            }}>{copy.forestApprove}</button>}
            <button type="button" className="secondary-action" onClick={(event) => {
              const article = event.currentTarget.closest("article");
              const note = article.querySelector('[name="reviewNote"]').value;
              postAction({ action: "review-forest-listing", id: product.id, decision: "CORRECTIONS_REQUIRED", note }, copy.saved);
            }}>{copy.forestCorrections}</button>
            <button type="button" className="danger-action" onClick={(event) => {
              const article = event.currentTarget.closest("article");
              const note = article.querySelector('[name="reviewNote"]').value;
              postAction({ action: "review-forest-listing", id: product.id, decision: "REJECT", note }, copy.saved);
            }}>{copy.forestReject}</button>
            <button type="button" className="danger-action" onClick={(event) => {
              const article = event.currentTarget.closest("article");
              const note = article.querySelector('[name="reviewNote"]').value;
              postAction({ action: "review-forest-listing", id: product.id, decision: "SUSPEND", note }, copy.saved);
            }}>{copy.forestSuspend}</button>
          </div>
        </form>
      </article>)}</div> : <div className="market-empty"><span>✓</span><p>{copy.forestNoReview}</p></div>}
    </>;
  }

  function productDetailView(product) {
    const photos = product.images?.length ? product.images : [product.image || "/placeholder.svg"];
    const isForest = product.isForestProduce || product.category === forestCategory;
    const detailRows = Object.entries(product.details || {}).filter(([key, value]) =>
      typeof value === "string" && value && !["complianceRequired", "isMedicinal"].includes(key));
    return <>
      <div className="breadcrumbs"><a href="/">Home</a> / <a href={isForest ? "/forest-products" : "/products"}>{isForest ? copy.forestTitle : "Products"}</a> / {product.name}</div>
      <section className="product-detail">
        <div className="detail-photo">
          <img src={productImageSource(photos[0])} srcSet={productImageSrcSet(photos[0])} sizes="(max-width: 760px) 100vw, 50vw" alt={(language === "hi" ? product.imageAltHi : product.imageAlt) || product.imageAlt || product.name} fetchPriority="high" decoding="async" onError={handleProductImageError} />
          {product.isForestProduce && photos[0] === "/placeholder.svg" && <span className="photo-pending-badge detail-photo-pending">{copy.photoPending}</span>}
          {photos.length > 1 && <div className="detail-photo-gallery">{photos.slice(1).map((image, index) => <img key={`${image}-${index}`} src={productImageSource(image)} srcSet={productImageSrcSet(image)} sizes="(max-width: 560px) 22vw, 110px" alt={`${language === "hi" ? product.nameHi || product.name : product.name}, ${index + 2}${language === "hi" ? "वीं अतिरिक्त उत्पाद फोटो" : " additional product photo"}`} loading="lazy" decoding="async" onError={handleProductImageError} />)}</div>}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{language === "hi" && product.isForestProduce ? "वन उपज और प्राकृतिक उत्पाद" : product.category} · {language === "hi" ? product.subcategoryHi || product.locationHi || product.location : product.subcategory || product.location}</p>
          <h1>{language === "hi" ? product.nameHi || product.name : product.name}</h1>
          {product.nameHi && <p>{language === "hi" ? product.name : product.nameHi}</p>}
          <p className="detail-seller">{copy.seller}: <strong>{language === "hi" ? product.sellerHi || product.seller : product.seller}</strong> · {language === "hi" ? product.locationHi || product.location || "भारत" : product.location}{product.rating && ` · ★ ${product.rating}`}</p>
          <div className="detail-price">{product.price > 0 ? money(currentPrice(product)) : "Seller-defined"} <small>/ {product.priceDisplay || product.unit}</small>{product.discount > 0 && <del>{money(product.price)}</del>}</div>
          <p className="illustrative-note">{isForest ? `Seller-defined asking price · market verification pending${product.priceLastUpdated ? ` · price set ${new Date(product.priceLastUpdated).toLocaleDateString()}` : ""}. Historical MSP references are not retail prices.` : copy.illustrative}</p>
          <p>{language === "hi" ? product.descriptionHi || product.description : product.description}</p>
          <p><strong>{product.stock > 0 ? `${product.stock} ${copy.available}` : copy.unavailable}</strong></p>
          <p className="detail-delivery">Delivery and returns: demo listing only. Seller must confirm availability, shipping and return terms before a real purchase.</p>
          <div className="detail-actions"><button className="primary-action" disabled={product.stock < 1 || product.price <= 0} type="button" onClick={() => addItem(product)}>{copy.add}</button><button className="secondary-action" disabled={product.stock < 1 || product.price <= 0} type="button" onClick={() => addItem(product, true)}>{copy.buyNow}</button><button className="secondary-action" type="button" onClick={() => toggleWishlist(product.id)}>{wishlist.includes(product.id) ? "♥" : "♡"} {copy.wishlist}</button></div>
          {detailRows.length > 0 && <div className="product-compliance"><h2>{language === "hi" ? "उत्पाद, स्रोत और संभाल की जानकारी" : "Product, source and handling information"}</h2><dl>{detailRows.map(([key, value]) => <div key={key}><dt>{language === "hi" ? detailLabelsHi[key] || key : key.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())}</dt><dd>{language === "hi" ? product.detailsHi?.[key] || value : value}</dd></div>)}</dl>
            {isForest && <><p>{language === "hi" ? "कोई औषधीय लाभ या इलाज का दावा नहीं है। संग्रह, स्वामित्व, परिवहन, व्यापार, संरक्षित प्रजातियों, खाद्य सुरक्षा, AYUSH और लेबल संबंधी नियमों की वस्तु और क्षेत्र के अनुसार जाँच आवश्यक है।" : "No medicinal benefits or cures are claimed. Applicable collection, ownership, transit, trade, protected-species, food-safety, AYUSH and labelling rules must be verified for the item and jurisdiction."}</p><a href="/forest-products">{language === "hi" ? "दिनांकित सरकारी MSP संदर्भ देखें (खुदरा मूल्य नहीं) →" : "View dated government MSP references (not retail prices) →"}</a></>}
          </div>}
          {isForest && <div className="forest-history"><h2>Seller price history</h2>{forestPriceHistory.filter((entry) => entry.listingId === product.id).map((entry) => <p key={`${entry.listingId}-${entry.createdAt}`}>{new Date(entry.createdAt).toLocaleString()} · {money(entry.amount)} / {entry.unit} · Seller asking price; not market verified</p>)}</div>}
        </div>
      </section>
      <section className="home-section"><div className="section-title-row"><h2>Related products</h2></div>{productGrid(products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3))}</section>
    </>;
  }

  function requestForm() {
    return <form className="market-form" onSubmit={async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const result = await postAction({ action: "create-request", ...data, budget: Number(data.budget) }, copy.requestSuccess);
      if (result) form.reset();
    }}>
      <label>{copy.title}<input name="title" minLength="3" maxLength="120" required /></label>
      <label>{copy.category}<select name="category" required>{categories.filter((item) => item !== "Rentals").map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>{copy.description}<textarea name="description" minLength="10" maxLength="1200" required /></label>
      <div className="form-row"><label>{copy.quantity}<input name="quantity" required maxLength="80" placeholder="e.g. 200 kg" /></label><label>{copy.budget}<input name="budget" type="number" min="1" required /></label></div>
      <label>{copy.locationLabel}<input name="location" required maxLength="120" placeholder="City, State" /></label>
      <label>{copy.requiredDate}<input name="requiredDate" type="date" min={new Date().toISOString().slice(0, 10)} required /></label>
      <button className="primary-action" type="submit">{copy.publishRequest}</button>
    </form>;
  }

  function requestList(openOnly = true) {
    const list = openOnly ? requests.filter((item) => ["OPEN", "QUOTATIONS_RECEIVED"].includes(item.status)) : requests;
    if (!list.length) return <div className="market-empty"><span>↗</span><p>{copy.noRequests}</p></div>;
    return <div className="request-list">{list.map((item) => <article className="request-card" key={item.id}>
      <div className="request-card-heading"><div><span className="request-badge">{item.status.replaceAll("_", " ")}</span><h3>{item.title}</h3></div><strong>{money(item.budget)} <small>budget</small></strong></div>
      <p>{item.description}</p>      <div className="request-meta"><span>{item.category}</span><span>{item.quantity}</span><span>{item.location}</span><span>By {item.requiredDate}</span><span>{(item.quotations || []).length} {copy.quoteCount}</span></div>
      <div className="quote-list">{(item.quotations || []).map((quote) => <div className="quote-row" key={quote.id}><span><strong>{quote.seller}</strong><small>{quote.quantity} · {quote.deliveryDays} days · {quote.status}</small>{quote.message && <small>{quote.message}</small>}</span><strong>{money(quote.price)}</strong>{["OPEN", "QUOTATIONS_RECEIVED"].includes(item.status) && <button className="secondary-action" type="button" onClick={() => postAction({ action: "update-request", id: item.id, status: "ACCEPTED", quotationId: quote.id }, copy.saved)}>Accept</button>}</div>)}</div>
      {["OPEN", "QUOTATIONS_RECEIVED"].includes(item.status) && <details className="quote-details"><summary>{copy.quote}</summary><form className="market-form quote-form" onSubmit={async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const result = await postAction({ action: "create-quotation", requestId: item.id, ...data, price: Number(data.price), deliveryDays: Number(data.deliveryDays) }, copy.quoteSuccess);
      if (result) form.reset();
      }}><div className="form-row"><label>{copy.quotePrice}<input name="price" type="number" min="1" required /></label><label>{copy.quantity}<input name="quantity" maxLength="80" required /></label></div><label>{copy.deliveryDays}<input name="deliveryDays" type="number" min="1" max="365" required /></label><label>{copy.message}<textarea name="message" maxLength="500" /></label><button type="submit" className="primary-action">{copy.submitQuote}</button></form></details>}
      {["OPEN", "QUOTATIONS_RECEIVED"].includes(item.status) && <div className="inline-actions"><button type="button" className="secondary-action request-close" onClick={() => postAction({ action: "update-request", id: item.id, status: "CLOSED" }, copy.saved)}>Close request</button><button type="button" className="danger-action request-close" onClick={() => postAction({ action: "update-request", id: item.id, status: "CANCELLED" }, copy.saved)}>Cancel request</button></div>}
    </article>)}</div>;
  }

  function ordersList() {
    const list = orderFilter ? orders.filter((order) => order.id === orderFilter.trim().toUpperCase()) : orders;
    if (!list.length) return <div className="market-empty"><span>▣</span><p>{copy.noOrders}</p></div>;
    return <div className="order-list">{list.map((order) => <article className="order-card" key={order.id}>
      <div className="order-heading"><div><span>{copy.order} ID</span><strong>{order.id}</strong></div><span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status.replaceAll("_", " ")}</span></div>
      <div className="order-lines">{order.items.map((item) => <div className="order-line" key={item.id}><img src={productImageSource(item.image, item.id)} srcSet={productImageSrcSet(productImageSource(item.image, item.id))} sizes="40px" alt={item.name} loading="lazy" decoding="async" onError={handleProductImageError} /><span><strong>{item.name}</strong><small>{item.quantity} × {money(item.price)}</small></span><strong>{money(item.lineTotal)}</strong></div>)}</div>
      <div className="order-total"><span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span><strong>{money(order.total)}</strong></div>
      <div className="order-demo-note">{copy.demoUnpaid} · {order.paymentStatus}</div>
      <div className="tracking-timeline">{order.history.map((event) => <div className="tracking-event" key={`${event.status}-${event.timestamp}`}><i /><span><strong>{event.status.replaceAll("_", " ")}</strong><small>{new Date(event.timestamp).toLocaleString()} · {event.note}</small></span></div>)}</div>
      <p className="muted-notice">{copy.trackingDisclaimer}</p>
      <div className="inline-actions"><button type="button" className="secondary-action" onClick={() => router.push(`/track-my-order?orderId=${encodeURIComponent(order.id)}`)}>{copy.track}</button>{order.status === "ORDER_PLACED" && <button type="button" className="danger-action" onClick={() => postAction({ action: "cancel-order", id: order.id }, copy.cancel)}>{copy.cancel}</button>}</div>
    </article>)}</div>;
  }

  function rentalSection() {
    return <>
      {sectionHeading(copy.rentalTitle, copy.rentalIntro)}
      <div className="disclaimer-banner">{copy.rentalDisclaimer}</div>
      <div className="rental-grid">{rentals.map((rental) => <article className="rental-card" key={rental.id}><img src={productImageSource(rental.image)} srcSet={productImageSrcSet(rental.image)} sizes="(max-width: 560px) 90vw, (max-width: 1200px) 45vw, 30vw" alt={rental.imageAlt || rental.name} loading="lazy" decoding="async" onError={handleProductImageError} /><div className="rental-card-content"><span className="request-badge">{rental.category}</span><h2>{rental.name}</h2><p>{rental.owner} · {rental.location}</p><strong>{money(rental.price)} <small>{rental.unit || copy.rentalFrom}</small></strong><details><summary>{copy.requestBooking}</summary><form className="market-form" onSubmit={async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const result = await postAction({ action: "create-rental-booking", rentalId: rental.id, ...data }, copy.saved);
        if (result) form.reset();
      }}><label>{copy.startDate}<input type="date" name="startDate" min={new Date().toISOString().slice(0, 10)} required /></label><label>{copy.endDate}<input type="date" name="endDate" required /></label><button className="primary-action" type="submit">{copy.requestBooking}</button></form></details></div></article>)}</div>
      <h2 className="subheading">{copy.bookings}</h2>{bookings.length ? <div className="request-list">{bookings.map((booking) => <article className="request-card" key={booking.id}><span className="request-badge">{booking.status}</span><h3>{booking.rentalName}</h3><p>{booking.startDate} — {booking.endDate}</p><p className="muted-notice">{booking.note}</p>{booking.status === "REQUESTED" && <div className="inline-actions"><button className="secondary-action" type="button" onClick={() => postAction({ action: "update-rental-booking", id: booking.id, status: "APPROVED" }, copy.saved)}>Demo owner: approve</button><button className="danger-action" type="button" onClick={() => postAction({ action: "update-rental-booking", id: booking.id, status: "REJECTED" }, copy.saved)}>Demo owner: reject</button></div>}</article>)}</div> : <p className="muted-notice">{copy.noBookings}</p>}
    </>;
  }

  function sellerProducts() {
      const ownListings = myListings;
    return <>{sectionHeading(copy.myListings, copy.sellIntro)}
      {ownListings.length ? <div className="seller-list">{ownListings.map((product) => <article className="seller-row" key={product.id}>
        <img src={productImageSource(product.image)} srcSet={productImageSrcSet(product.image)} sizes="55px" alt={product.imageAlt || product.name} loading="lazy" decoding="async" onError={handleProductImageError} />
        <div><strong>{language === "hi" ? product.nameHi || product.name : product.name}</strong><small>{product.isForestProduce && product.status !== "PUBLISHED" ? copy.forestPending : `${money(product.price)} · ${product.stock} ${copy.available}`}</small><span>{language === "hi" ? categoryHi[product.category] || product.category : product.category} · {language === "hi" ? product.locationHi || product.location || "भारत" : product.location}</span></div>
        <span className="status-pill">{product.status || "PUBLISHED"}</span>
        <div className="seller-row-actions"><button type="button" onClick={() => router.push(`/sell-products?edit=${encodeURIComponent(product.id)}`)}>{copy.edit}</button>{product.isForestProduce && product.status !== "PUBLISHED" ? <a href="/forest-review">Review status</a> : <button type="button" onClick={() => postAction({ action: "update-listing", id: product.id, operation: product.status === "PAUSED" ? "publish" : "pause" }, copy.saved)}>{product.status === "PAUSED" ? copy.republish : copy.pause}</button>}<button type="button" onClick={() => postAction({ action: "update-listing", id: product.id, operation: "remove" }, copy.remove)}>{copy.remove}</button></div>
      </article>)}</div> : <div className="market-empty"><span>＋</span><p>{copy.noListings}</p><a className="primary-action link-action" href="/sell-products">{copy.sellTitle}</a></div>}
    </>;
  }

  function renderMainContent() {
    if (section === "home") return <>
      <section className="market-hero">
        <div className="market-hero-image" aria-hidden="true" />
        <div className="market-hero-content"><span className="hero-kicker">SETU NOVA · {copy.allIndia.toUpperCase()}</span><h1>{copy.browse}</h1><p>{copy.browseText}</p><div className="hero-action-row"><a className="primary-action link-action" href="/products">{copy.explore} <span>→</span></a><a className="hero-outline-link" href="/become-a-seller">{copy.become} ↗</a><a className="hero-outline-link" href="/forest-products">{copy.forestTitle} ↗</a></div><div className="hero-trust"><span>✳</span> Rural makers · fairer market access · across India</div></div>
      </section>
      <div className="demo-banner"><strong>DEMO</strong>{copy.demo}</div>
      <section className="home-section category-home"><div className="section-title-row"><div><p className="eyebrow">{copy.browseCategories}</p><h2>{copy.browseCategories}</h2></div><a href="/categories">Explore all →</a></div><div className="category-tiles">{categories.filter((item) => item !== "Rentals").slice(0, 8).map((item, index) => <button type="button" className={`category-tile tile-${index}`} key={item} onClick={() => router.push(`/categories?category=${encodeURIComponent(item)}`)}><span>{["♧", "▧", "▤", "⌁", "◈", "♢", "◉", "♜"][index]}</span><strong>{language === "hi" ? categoryHi[item] || item : item}</strong></button>)}</div></section>
      <section className="home-section"><div className="section-title-row"><div><p className="eyebrow">{copy.featured}</p><h2>{copy.featured}</h2></div><a href="/products">{copy.explore} →</a></div>{productGrid(products.slice(0, 6))}</section>
      <section className="home-section bestsellers-home"><div className="section-title-row"><div><p className="eyebrow">{copy.bestsellers}</p><h2>{copy.bestsellers}</h2></div><a href="/products">{copy.explore} →</a></div>{productGrid([...products].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(6, 9))}</section>
      <section className="home-section"><div className="section-title-row"><div><p className="eyebrow">{copy.newArrivals}</p><h2>{copy.newArrivals}</h2></div><a href="/products">{copy.explore} →</a></div>{productGrid(products.slice(-3).reverse())}</section>
      <section className="home-section offer-strip"><div className="section-title-row"><div><p className="eyebrow">DEMO OFFERS</p><h2>Producer offers</h2></div><span>Sample discounts only · not a live sale</span></div>{productGrid(products.filter((product) => product.discount > 0))}</section>
      <section className="home-split-promo"><div><span>MADE WITH CARE, SOLD WITH PRIDE</span><h2>Every purchase carries a maker’s story.</h2><a href="/marketplace">Meet the marketplace →</a></div><div><span>BUYERS ACROSS INDIA</span><h2>Looking for something in particular?</h2><a href="/buyer-requests">Post a buyer request →</a></div></section>
      <section className="home-section"><div className="section-title-row"><div><p className="eyebrow">{copy.sellers}</p><h2>{copy.sellers}</h2></div><a href="/marketplace">Discover makers →</a></div><div className="seller-collectives">{["DEMO · Bastar Artisan Collective", "DEMO · Kutch Weavers Group", "DEMO · Gadchiroli Forest Producers"].map((name, i) => <article key={name}><span>{["BA", "KW", "GF"][i]}</span><div><strong>{name}</strong><small>{["Chhattisgarh", "Gujarat", "Maharashtra"][i]} · Sample community group</small></div><span className="seller-arrow">↗</span></article>)}</div></section>
      {recentProducts.length > 0 && <section className="home-section"><div className="section-title-row"><div><p className="eyebrow">YOUR JOURNEY</p><h2>Recently viewed</h2></div></div>{productGrid(recentProducts)}</section>}
      <section className="home-section"><div className="section-title-row"><div><p className="eyebrow">{copy.requests}</p><h2>{copy.requests}</h2></div><a href="/buyer-requests">View requests →</a></div>{requestList()}</section>
    </>;

    if (section === "products" || section === "marketplace" || section === "buy-products" || section === "categories" || section === "forest-products") {
      if (detailId) return currentProduct ? productDetailView(currentProduct) : <div className="market-empty"><span>⌕</span><p>Product listing not found. Unpublished forest listings are not available to buyers.</p><a href="/forest-products">Browse forest products</a></div>;
      return <>
        {section === "forest-products"
          ? <>{sectionHeading(copy.forestTitle, copy.forestSubtitle)}{forestPricingPanel()}          <div className="forest-review-cta"><p>{language === "hi" ? "वन और वनस्पति उत्पादों की सूची प्रमाण-आधारित समीक्षा पूरी होने तक खरीद के लिए उपलब्ध नहीं है। वास्तविक उत्पाद फ़ोटो विक्रेता द्वारा अपलोड और समीक्षा के बाद ही दिखाई जाएगी।" : "Forest and botanical listings remain unavailable to buyers until an evidence-based review is complete. Genuine product photos are shown after seller upload and review."}</p><a className="secondary-action" href="/sell-products">{language === "hi" ? "वन उत्पाद सूचीबद्ध करें" : "List a forest product"}</a></div></>
          : sectionHeading(copy.products, "Illustrative demo listings from producers across India. Prices are not verified rates.")}
        <div className="catalog-top-controls"><form className="catalog-search" onSubmit={navigateSearch}>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setSuggestionsOpen(true); }} onFocus={() => setSuggestionsOpen(true)} placeholder={copy.productSearch} />
          <button type="submit">⌕</button>
          {suggestionsOpen && (searchSuggestions.length > 0 || searchForestReferences.length > 0) && <div className="suggestions-popover">
            {searchSuggestions.map((product) => <button key={product.id} type="button" onClick={() => { setSearch(language === "hi" ? product.nameHi || product.name : product.name); setSuggestionsOpen(false); router.push(`/products/${encodeURIComponent(product.id)}`); }}><img src={productImageSource(product.image)} srcSet={productImageSrcSet(product.image)} sizes="34px" alt="" loading="lazy" decoding="async" onError={handleProductImageError} /><span><strong>{language === "hi" ? product.nameHi || product.name : product.name}</strong><small>{language === "hi" ? categoryHi[product.category] || product.category : product.category} · {product.price > 0 ? money(product.price) : copy.forestPending}</small></span></button>)}
            {forestSearchSuggestionButtons()}
          </div>}
        </form><span>{visibleProducts.length} products · {copy.allIndia}</span></div>
        {renderFilters()}
        {section !== "forest-products" && searchForestReferences.length > 0 && forestPricingPanel(searchForestReferences)}
        {productGrid(visibleProducts)}
      </>;
    }

    if (section === "buyer-requests" || section === "messages-enquiries") return <>{sectionHeading(copy.requests, copy.requestsText)}<div className="workspace-grid"><div><div className="section-title-row"><h2>{copy.openRequests}</h2></div>{requestList()}</div><aside className="form-panel"><h2>{copy.postRequest}</h2><p className="muted-notice">Buyer requests are public in this demo. Do not include personal contact details.</p>{requestForm()}</aside></div></>;

    if (section === "sell-products" || section === "become-a-seller") {
      const product = editingProduct || {};
      return <>{sectionHeading(copy.sellTitle, copy.sellIntro)}<div className="disclaimer-banner">Seller publishing, photo upload and stock are demo workflows. Forest and herbal goods are subject to local collection, ownership, species, food-safety and product rules. Protected and prohibited items must not be listed.</div><div className="seller-form-panel"><form key={product.id || "new-listing"} className="market-form seller-form" onSubmit={submitListing}>
        <label>{copy.productName}<input name="name" required minLength="2" maxLength="100" defaultValue={product.name || ""} /></label>
        <label>Name in Hindi (required for forest products)<input name="nameHi" maxLength="100" defaultValue={product.nameHi || ""} /></label>
        <label>{language === "hi" ? "श्रेणी" : copy.category}<select name="category" defaultValue={product.category || "Handicrafts"}>{categories.filter((item) => item !== "Rentals").map((item) => <option key={item} value={item}>{language === "hi" ? categoryHi[item] || item : item}</option>)}</select></label>
        <label>{copy.productSubcategory}<select name="subcategory" defaultValue={product.subcategory || ""}><option value="">{language === "hi" ? "वन उत्पाद होने पर चुनें" : "Select if forest product"}</option>{forestSubcategories.map((item) => <option key={item} value={item}>{language === "hi" ? forestSubcategoriesHi[item] : item}</option>)}</select></label>
        <label>About product · English<textarea name="description" minLength="10" required maxLength="1200" defaultValue={product.description || ""} /></label>
        <label>उत्पाद के बारे में · हिंदी<textarea name="descriptionHi" minLength="10" maxLength="1200" defaultValue={product.descriptionHi || ""} placeholder="वन उत्पादों के लिए हिंदी विवरण आवश्यक है" /></label>
        <div className="form-row"><label>{copy.price} · seller asking price (₹)<input name="price" type="number" min="1" required defaultValue={product.price || ""} /></label><label>{copy.discount}<input name="discount" type="number" min="0" max="90" defaultValue={product.discount || "0"} /></label><label>{copy.unit}<input name="unit" required maxLength="40" defaultValue={product.unit || "each"} placeholder="kg, 100 g pack, jar" /></label><label>{copy.stock}<input name="stock" type="number" min="1" max="100000" required defaultValue={product.stock || ""} /></label></div>
        <div className="form-row"><label>{copy.materials}<input name="materials" maxLength="300" defaultValue={product.details?.materials || ""} /></label><label>{copy.dimensions}<input name="dimensions" maxLength="150" defaultValue={product.details?.dimensions || ""} /></label></div>
        <div className="form-row"><label>{copy.source}<input name="source" maxLength="300" defaultValue={product.details?.source || ""} /></label><label>स्रोत / संग्रह अधिकार<input name="sourceHi" maxLength="300" defaultValue={product.detailsHi?.source || ""} /></label></div>
        <div className="form-row"><label>{copy.processing}<input name="processing" maxLength="300" defaultValue={product.details?.processing || ""} /></label><label>प्रसंस्करण विवरण<input name="processingHi" maxLength="300" defaultValue={product.detailsHi?.processing || ""} /></label></div>
        <div className="form-row"><label>{copy.botanical}<input name="botanicalName" maxLength="150" defaultValue={product.details?.botanicalName || ""} /></label><label>{copy.plantPart}<input name="plantPart" maxLength="100" defaultValue={product.details?.plantPart || ""} /></label><label>पौधे का भाग<input name="plantPartHi" maxLength="100" defaultValue={product.detailsHi?.plantPart || ""} /></label></div>
        <div className="form-row"><label>{copy.storage}<input name="storage" maxLength="300" defaultValue={product.details?.storage || ""} /></label><label>भंडारण विवरण<input name="storageHi" maxLength="300" defaultValue={product.detailsHi?.storage || ""} /></label><label>{copy.safety}<input name="safety" maxLength="500" defaultValue={product.details?.safety || ""} /></label><label>सुरक्षा / लेबल जानकारी<input name="safetyHi" maxLength="500" defaultValue={product.detailsHi?.safety || ""} /></label></div>
        <div className="form-row"><label>Packaging / pack size<input name="packaging" maxLength="200" defaultValue={product.details?.packaging || ""} /></label><label>{copy.harvestDate}<input name="harvestDate" type="date" defaultValue={product.details?.harvestDate || ""} /></label><label>{copy.packedDate}<input name="packedDate" type="date" defaultValue={product.details?.packedDate || ""} /></label><label>{copy.bestBefore}<input name="bestBefore" type="date" defaultValue={product.details?.bestBefore || ""} /></label></div>
        <div className="form-row"><label hidden={language !== "en"}>Seller / collective name<input name="seller" maxLength="100" defaultValue={product.seller || "Setu Nova artisan collective"} /></label><label hidden={language !== "hi"}>विक्रेता / समूह का नाम<input name="sellerHi" maxLength="100" defaultValue={product.sellerHi || "सेतु नोवा कारीगर समूह"} /></label><label hidden={language !== "en"}>Pickup city and state<input name="location" maxLength="120" defaultValue={product.location || ""} placeholder="City, State" /></label><label hidden={language !== "hi"}>पिकअप शहर और राज्य<input name="locationHi" maxLength="120" defaultValue={product.locationHi || ""} placeholder="शहर, राज्य" /></label></div>
        <label>Delivery options<input name="deliveryOptions" maxLength="300" defaultValue={product.deliveryOptions || "Pickup / seller to confirm delivery"} /></label>
        <div className="form-row photo-input-row"><label>{copy.upload}<input name="imageFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple /><input name="imageUrl" type="hidden" value={product.image || ""} readOnly />{product.images?.length > 0 && <div className="forest-upload-gallery">{product.images.map((image, index) => <img className="upload-preview" key={`${image}-${index}`} src={image} alt={`Uploaded product photo ${index + 1}`} onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }} />)}</div>}</label><label>{language === "hi" ? "कैमरे से फोटो लें" : "Take a photo with camera"}<input name="imageFiles" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" /></label></div>
        <div className="form-row"><label>Photo description (English)<input name="imageAlt" minLength="15" maxLength="200" required defaultValue={product.imageAlt || ""} placeholder="Describe the actual item and its visible form" /></label><label>फ़ोटो का विवरण (हिंदी)<input name="imageAltHi" maxLength="200" defaultValue={product.imageAltHi || ""} placeholder="फ़ोटो में दिख रहे उत्पाद का हिंदी विवरण" /></label></div>
        <label className="compliance-check"><input name="complianceRequired" type="checkbox" defaultChecked={Boolean(product.details?.complianceRequired)} />{copy.compliance}</label>
        <label className="compliance-check"><input name="isMedicinal" type="checkbox" defaultChecked={Boolean(product.details?.isMedicinal)} />{copy.medicinal}</label>
        <label>{copy.forestEvidence}<input name="documentReferences" maxLength="500" defaultValue={product.details?.documentReferences || ""} placeholder="Reference only; documents must be reviewed offline" /></label>
        <p className="muted-notice">Forest listings are saved as pending review and stay unpublished. Reference IDs are not document uploads; never enter private personal information in this local demo.</p>
        <div className="form-actions"><button className="secondary-action" type="button" onClick={saveDraft}>{copy.saveDraft}</button><button className="primary-action" type="submit">{editingProduct ? copy.edit : copy.publish}</button></div>
      </form></div><h2 className="subheading">{copy.drafts}</h2>{drafts.length ? <div className="draft-list">{drafts.map((draft) => <div key={draft.id}><strong>{draft.name || "Untitled product"}</strong><button type="button" onClick={() => setDrafts((current) => current.filter((item) => item.id !== draft.id))}>Remove draft</button></div>)}</div> : <p className="muted-notice">Drafts are private to this browser.</p>}</>;
    }

    if (section === "my-store") return sellerProducts();
    if (section === "forest-review") return forestReviewSection();
    if (section === "seller-dashboard") return <>{sectionHeading(copy.sellerDashboard, "Demo overview from the local marketplace database.")}<div className="dashboard-metrics"><article><span>{copy.myListings}</span><strong>{products.filter((product) => product.id.startsWith("seller-")).length}</strong></article><article><span>{copy.orders}</span><strong>{orders.length}</strong></article><article><span>{copy.sales}</span><strong>{money(orders.reduce((sum, order) => sum + (order.status === "CANCELLED" ? 0 : order.total), 0))}</strong></article><article><span>Open buyer requests</span><strong>{requests.filter((item) => ["OPEN", "QUOTATIONS_RECEIVED"].includes(item.status)).length}</strong></article></div><div className="section-title-row"><h2>{copy.myListings}</h2><a href="/my-store">Manage store →</a></div>{sellerProducts()}<div className="section-title-row"><h2>{copy.orders}</h2><a href="/my-orders">View all →</a></div>{ordersList()}</>;
    if (section === "my-basket") return <>{sectionHeading(copy.basketTitle, copy.checkoutDisclaimer)}{cartProducts.length ? <div className="basket-layout"><div className="basket-lines">{cartProducts.map((product) => <article className="basket-line" key={product.id}><img src={productImageSource(product.image)} srcSet={productImageSrcSet(product.image)} sizes="67px" alt={product.imageAlt || product.name} loading="lazy" decoding="async" onError={handleProductImageError} /><div className="basket-line-copy"><a href={`/products/${product.id}`}><strong>{product.name}</strong></a><small>{language === "hi" ? product.sellerHi || product.seller : product.seller} · {money(product.price)} / {product.unit}</small><span>{product.stock} {copy.available}</span></div><div className="basket-quantity"><button type="button" aria-label="Decrease quantity" onClick={() => setCart((current) => ({ ...current, [product.id]: Math.max(0, Number(current[product.id]) - 1) }))}>−</button><strong>{cart[product.id]}</strong><button type="button" aria-label="Increase quantity" disabled={Number(cart[product.id]) >= product.stock} onClick={() => setCart((current) => ({ ...current, [product.id]: Math.min(product.stock, Number(current[product.id]) + 1) }))}>+</button></div><button className="remove-line" type="button" onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })}>{copy.removeItem}</button></article>)}</div><aside className="checkout-panel"><h2>Order summary</h2><div><span>{copy.subtotal}</span><strong>{money(subtotal)}</strong></div><div><span>{copy.shipping}</span><strong>{shipping ? money(shipping) : "FREE"}</strong></div><p>{copy.freeShipping}</p><label>{copy.deliveryRegion}<select name="deliveryRegion" form="demo-checkout"><option>India</option>{["Andhra Pradesh", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", "Jharkhand", "Karnataka", "Madhya Pradesh", "Maharashtra", "Odisha", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"].map((state) => <option key={state}>{state}</option>)}</select></label><div className="checkout-total"><span>{copy.total}</span><strong>{money(subtotal + shipping)}</strong></div><form id="demo-checkout" onSubmit={createOrder}><button className="primary-action" type="submit">{copy.checkout}</button></form><p className="muted-notice">{copy.checkoutDisclaimer}</p></aside></div> : <div className="market-empty"><span>▱</span><p>{copy.emptyBasket}</p><a className="primary-action link-action" href="/products">{copy.explore}</a></div>}</>;
    if (section === "my-orders" || section === "track-my-order") return <>{sectionHeading(section === "track-my-order" ? "Track a demo order" : copy.orders, copy.trackingDisclaimer)}<div className="order-filter"><label>Order ID<input value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)} placeholder="SN-2026-…" /></label><button className="secondary-action" type="button" onClick={() => setOrderFilter("")}>Show all orders</button></div>{ordersList()}</>;
    if (section === "wishlist") return <>{sectionHeading(copy.wishlist, copy.emptyWishlist)}{productGrid(starredProducts)}</>;
    if (section === "rental-marketplace") return rentalSection();
    if (section === "notifications") return <>{sectionHeading(activeTitle, "Demo activity saved by this browser and the local marketplace database.")}<div className="request-card"><strong>{copy.demo}</strong><p>Order status and buyer request updates are shown on their respective routes. Live notifications are not connected.</p><a href="/my-orders">View orders →</a></div></>;
    if (section === "profile-account" || section === "settings" || section === "logout") return <>{sectionHeading(activeTitle, copy.loginNote)}<div className="form-panel account-panel"><span className="profile-avatar">SN</span><h2>{copy.loginDemo}</h2><p>{copy.loginNote}</p><p className="muted-notice">{copy.personalData}</p><div className="setting-row"><span>Interface language</span><button type="button" className="secondary-action" onClick={changeLanguage}>{language === "en" ? "हिंदी" : "English"}</button></div><div className="setting-row"><span>Currency</span><strong>INR · ₹</strong></div><a className="text-link" href="/">Return home</a></div></>;
    if (section === "help-support") return <>{sectionHeading(activeTitle, copy.helpText)}<div className="form-panel"><h2>Marketplace demo FAQ</h2><details><summary>Are the listed prices real?</summary><p>No. Every included sample price is illustrative and has not been verified against current market rates.</p></details><details><summary>Can I make a real payment or shipment?</summary><p>No. Demo checkout records an unpaid local demo order only. No courier or payment gateway is integrated.</p></details><details><summary>Are herbal items medical products?</summary><p>No medicinal benefits are claimed. Sellers must verify species identity, legal sourcing, permits, food safety and required product labels.</p></details><details><summary>Are my listings shared across users?</summary><p>Listings and orders are stored in the local SQLite database for this running demo server. This demo has no sign-in or user access controls, so do not publish personal or sensitive data.</p></details></div></>;
    return <>{sectionHeading(activeTitle, copy.helpText)}<div className="market-empty"><span>⌂</span><p>{copy.helpText}</p><a className="primary-action link-action" href="/">Go to marketplace</a></div></>;
  }

  return <div className="marketplace-shell">
    <header className="market-topbar">
      <button type="button" className="mobile-menu-toggle" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Toggle navigation">{mobileNavOpen ? "×" : "☰"}</button>
      <a className="market-brand" href="/"><span className="market-logo">S</span><span><strong>Setu Nova</strong><small>{copy.tagline}</small></span></a>
      <form className="global-search" onSubmit={navigateSearch}><span>⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setSuggestionsOpen(true); }} onFocus={() => setSuggestionsOpen(true)} placeholder={copy.search} aria-label={copy.search} /><button type="submit" aria-label="Search">→</button>{suggestionsOpen && (searchSuggestions.length > 0 || searchForestReferences.length > 0) && <div className="suggestions-popover global-suggestions">{searchSuggestions.map((product) => <button key={product.id} type="button" onClick={() => { setSuggestionsOpen(false); router.push(`/products/${encodeURIComponent(product.id)}`); }}><img src={productImageSource(product.image)} srcSet={productImageSrcSet(product.image)} sizes="34px" alt="" loading="lazy" decoding="async" onError={handleProductImageError} /><span><strong>{product.name}</strong><small>{product.category} · {product.price > 0 ? money(product.price) : copy.forestPending}</small></span></button>)}{forestSearchSuggestionButtons()}</div>}</form>
      <div className="topbar-tools"><div className="location-control"><button type="button" className="location-selector" aria-label={copy.location} aria-expanded={locationOpen} onClick={() => setLocationOpen((value) => !value)}><span>⌖</span><span><small>DELIVERING TO</small><strong>{deliveryRegion} <b>⌄</b></strong></span></button>{locationOpen && <div className="location-menu" role="menu">{["India", "Chhattisgarh", "Gujarat", "Maharashtra", "Odisha", "Madhya Pradesh", "Uttar Pradesh", "Delhi", "West Bengal"].map((region) => <button type="button" role="menuitem" key={region} onClick={() => chooseRegion(region)}>{region}</button>)}</div>}</div><button type="button" className="language-switch" onClick={changeLanguage}>{language === "en" ? "हिंदी" : "English"}</button><a href="/wishlist" className="top-icon-button" aria-label={copy.wishlist}>♡</a><a href="/my-basket" className="top-icon-button basket-top" aria-label={`${copy.basket} ${cartCount}`}>▱{cartCount > 0 && <i>{cartCount}</i>}</a><a className="account-link" href="/profile-account">♙ <span>{copy.signIn}</span></a></div>
    </header>
    <div className={`mobile-sidebar-scrim ${mobileNavOpen ? "visible" : ""}`} onClick={() => setMobileNavOpen(false)} />
    <div className="market-layout">
      <aside className={`market-sidebar ${mobileNavOpen ? "sidebar-open" : ""}`} aria-label="Marketplace navigation">
        <div className="sidebar-location"><span>⌖</span><div><small>{copy.location}</small><strong>{copy.allIndia}</strong></div></div>
        <nav>{menuItems.map(([href, label, icon], index) => <a key={href} href={`/${href === "home" ? "" : href}`} className={`${section === href || (href === "products" && section === "buy-products") ? "active" : ""} ${[1, 7, 15, 19].includes(index) ? "nav-group-start" : ""}`} onClick={() => setMobileNavOpen(false)}><Icon>{icon}</Icon><span>{language === "hi" ? hiLabels[href] : label}</span>{href === "my-basket" && cartCount > 0 && <b className="side-count">{cartCount}</b>}</a>)}</nav>
        <div className="sidebar-foot"><span>✳</span><p>Made for makers.<br />Open to all India.</p></div>
      </aside>
      <main className="market-content">
        <div className="route-toolbar"><span><a href="/">Home</a>{section !== "home" && <> <b>/</b> {language === "hi" ? hiLabels[section] : activeLabel}</>}</span><div><span>INR ₹</span><button type="button" onClick={changeLanguage}>{language === "en" ? "हिंदी" : "English"}</button></div></div>
        {error && <div className="alert alert-error" role="alert"><span>{error}</span><button type="button" onClick={() => setError("")}>×</button></div>}
        {notice && <div className="alert alert-success" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice("")}>×</button></div>}
        {renderMainContent()}
        <footer className="market-footer"><a className="market-brand" href="/"><span className="market-logo">S</span><span><strong>Setu Nova</strong><small>{copy.tagline}</small></span></a><p>Connecting rural producers and customers across India. Sample data and prices are illustrative demo content.</p><span>© 2026 Setu Nova</span></footer>
      </main>
    </div>
  </div>;
}
