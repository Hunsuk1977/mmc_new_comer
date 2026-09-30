// Set apiBase to the deployed Cloudflare Worker URL.
// The YouVersion app key belongs in the Worker's encrypted YV_APP_KEY secret.
window.NMC_YOUVERSION = Object.freeze({
  apiBase: "",
  appKey: "",
  versions: Object.freeze({ ko: 86, en: 111 }),
  abbreviations: Object.freeze({ ko: "KLB", en: "NIV" })
});
