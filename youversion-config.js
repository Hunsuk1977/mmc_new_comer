// The browser calls a Supabase Edge Function. The YouVersion key remains in
// the function's encrypted YOUVERSION_APP_KEY secret and is never sent here.
window.NMC_YOUVERSION = Object.freeze({
  apiBase: "https://ayybmznqbpufphxlvjeg.supabase.co/functions/v1/youversion",
  appKey: "",
  versions: Object.freeze({ ko: 86, en: 111 }),
  abbreviations: Object.freeze({ ko: "KLB", en: "NIV" })
});
