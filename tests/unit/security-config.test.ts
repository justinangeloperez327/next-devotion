import { describe, expect, it } from "vitest";

import nextConfig, { getSecurityHeaders } from "../../next.config";

function asMap(headers: ReturnType<typeof getSecurityHeaders>) {
  return new Map(headers.map((header) => [header.key, header.value]));
}

describe("production security configuration", () => {
  it("removes the framework disclosure header and limits action payloads", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.productionBrowserSourceMaps).toBe(false);
    expect(nextConfig.experimental?.serverActions?.bodySizeLimit).toBe("64kb");
  });

  it("sets baseline browser hardening headers", () => {
    const headers = asMap(getSecurityHeaders(false));

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
  });

  it("preserves request origin for progressive-enhancement auth forms in both environments", () => {
    for (const production of [false, true]) {
      expect(asMap(getSecurityHeaders(production)).get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    }
    expect(nextConfig.allowedDevOrigins).toEqual(["127.0.0.1"]);
    // Keep CSRF validation intact; never allowlist the opaque null origin.
    expect(nextConfig.experimental?.serverActions?.allowedOrigins).toBeUndefined();
  });

  it("adds transport and content security policy in production", () => {
    const headers = asMap(getSecurityHeaders(true));

    expect(headers.get("Strict-Transport-Security")).toContain(
      "max-age=31536000",
    );

    const csp = headers.get("Content-Security-Policy") ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain("'unsafe-eval'");
  });
});
