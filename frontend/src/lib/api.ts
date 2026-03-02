// API client for opencode + sidecar.
// All opencode calls must include x-opencode-directory header (see README).

export async function api(
  method: string,
  path: string,
  body?: unknown,
  opts?: { directory?: string },
): Promise<unknown> {
  const headers: Record<string, string> = {};
  if (opts?.directory) {
    headers["x-opencode-directory"] = opts.directory;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const t0 = performance.now();
  const dirTag = opts?.directory ? ` [dir=${opts.directory}]` : "";
  console.log(`API ${method} ${path}${dirTag}`);
  let r: Response;
  try {
    r = await fetch(path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`API ${method} ${path} network error after ${ms(t0)}:`, msg);
    throw e;
  }
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    console.error(`API ${method} ${path} ${r.status} after ${ms(t0)}:`, txt);
    throw new Error(`${r.status}: ${txt}`);
  }
  console.log(`API ${method} ${path} ${r.status} in ${ms(t0)}`);
  if (r.status === 204 || r.headers.get("content-length") === "0") return null;
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) return r.json();
  return null;
}

function ms(t0: number) {
  return `${Math.round(performance.now() - t0)}ms`;
}

export const get = (path: string, opts?: { directory?: string }) => api("GET", path, undefined, opts);

export const post = (path: string, body?: unknown, opts?: { directory?: string }) => api("POST", path, body, opts);

export const del = (path: string, opts?: { directory?: string }) => api("DELETE", path, undefined, opts);
