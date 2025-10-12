import { trackDoctorClick } from "@/lib/analytics";

export const paymentPageUrlRenderer = (
  doctor: any,
  apiSources: string,
  router: any
) => {
  let path = "/emailReport?";
  const queryParams = {
    slug: encodeURIComponent(doctor?.slug || doctor?.id || ""),
    _spt: doctor?.specialty || "chiropractor",
    _spt_slug:
      doctor?.specialty_url || doctor?.specialty || "chiropractor",
    _nme: doctor?.name || "Dr.",
    _ct: doctor?.city || "",
    _st: doctor?.state || "",
    _rt: doctor?.rating || 0,
    _sr: apiSources,
  };

  // Normalize IWGC profile link
  if (apiSources === "iwgc" && doctor?.profileLink) {
    queryParams.slug = encodeURIComponent(
      getSlugFromProfileLink(doctor.profileLink) || ""
    );
  }

  // Build the query string
  const queryString = Object.entries(queryParams)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  const pathWithParams = `${path}${queryString}`;

  // ✅ Fire analytics event before navigation
  trackDoctorClick(doctor, apiSources);

  console.log("Navigating to:", pathWithParams);
  router.push(pathWithParams);
};

// helper for IWGC links
const getSlugFromProfileLink = (profileLink: string): string | null => {
  const match = profileLink.match(/\/doctors\/([^/]+)/);
  return match ? match[1] : null;
};
