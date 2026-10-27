// The CV repo builds the PDF on every .tex push; serve whatever is on main.
const CV_URL = "https://raw.githubusercontent.com/KoalaAwad/CV/main/Abdelrahman_Awad_CV.pdf";
const CACHE_SECONDS = 300;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/resume.pdf") return env.ASSETS.fetch(request);

    const upstream = await fetch(CV_URL, { cf: { cacheEverything: true, cacheTtl: CACHE_SECONDS } });
    if (!upstream.ok) return new Response("Resume temporarily unavailable", { status: 502 });

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Abdelrahman_Awad_CV.pdf"',
        "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      },
    });
  },
};
