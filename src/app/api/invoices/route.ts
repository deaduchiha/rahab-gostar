import { getDb } from "@/db";
import { invoices } from "@/db/schema";
import { uploadImage } from "@/lib/upload-image";
import { NextRequest } from "next/server";

export const GET = async () => {
  try {
    const db = await getDb();
    const data = await db.query.invoices.findMany({});

    return Response.json(data);
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "مشکلی در سرور رخ داده است." },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const db = await getDb();

    const formdata = await request.formData();
    const description = formdata.get("description") as string;
    const imageFile = formdata.get("image") as File;
    const photo = imageFile ? await uploadImage(imageFile) : undefined;

    const invoice = await db.insert(invoices).values({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      description,
      photo: photo || "",
    });

    return Response.json(invoice);
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "مشکلی در سرور رخ داده است." },
      { status: 500 }
    );
  }
};
