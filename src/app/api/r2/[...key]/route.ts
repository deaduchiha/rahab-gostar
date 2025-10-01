import { getCloudflareContext } from "@opennextjs/cloudflare";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ key: string[] | string }> }
) => {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = env.ASSETS_BUCKET as R2Bucket | undefined;
  if (!bucket) {
    return new Response("R2 bucket not configured", { status: 500 });
  }

  const { key: rawKey } = await params;
  const key = Array.isArray(rawKey) ? rawKey.join("/") : String(rawKey ?? "");
  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const object = await bucket.get(key);

  if (object === null) {
    return new Response("Object Not Found", { status: 404 });
  }

  const headers = new Headers();
  const meta = "httpMetadata" in object ? object.httpMetadata : undefined;
  if (meta?.contentType) headers.set("content-type", meta.contentType);
  if (meta?.contentDisposition)
    headers.set("content-disposition", meta.contentDisposition);
  if (meta?.contentEncoding)
    headers.set("content-encoding", meta.contentEncoding);
  if (meta?.cacheControl) {
    headers.set("cache-control", meta.cacheControl);
  } else {
    headers.set("cache-control", "public, max-age=31536000, immutable");
  }
  if (meta?.contentLanguage)
    headers.set("content-language", meta.contentLanguage);
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");
  if ("size" in object && typeof object.size === "number") {
    headers.set("content-length", String(object.size));
  }

  return new Response("body" in object ? object.body : undefined, {
    status: "body" in object ? 200 : 412,
    headers,
  });
};
