"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export const uploadImage = async (imageFile: File) => {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = env.ASSETS_BUCKET;
  if (!bucket) {
    return null;
  }

  let imageKey: string | null = null;
  if (imageFile) {
    const id = crypto.randomUUID();
    const ext = (
      imageFile.name?.split(".").pop() ||
      imageFile.type?.split("/").pop() ||
      "bin"
    ).toLowerCase();
    const key = `images/${id}.${ext}`;

    const bytes = await imageFile.arrayBuffer();
    await bucket.put(key, bytes, {
      httpMetadata: {
        contentType: imageFile.type || "application/octet-stream",
        contentDisposition: imageFile.name
          ? `inline; filename="${imageFile.name.replace(/"/g, '\\"')}"`
          : undefined,
      },
    });
    imageKey = key;
  }
  return imageKey;
};
