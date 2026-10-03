/* Plain data for the hero's floating screens — kept free of three.js so the
   DOM can import the labels without pulling the 3D chunk into the main bundle. */
export const PANEL_META = [
  { id: "ads", label: "Paid ads", skill: "meta" },
  { id: "pipeline", label: "CRM pipeline", skill: "ghl" },
  { id: "attribution", label: "Attribution", skill: "crm" },
  { id: "ai", label: "AI workflows", skill: "ai" },
] as const;
