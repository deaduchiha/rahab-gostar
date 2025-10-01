import { getCurrentUser } from "@/auth";
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
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { message: "لطفا وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

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

    return Response.json({
      message: "فاکتور با موفقیت اضافه شد",
      link: photo,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "مشکلی در سرور رخ داده است." },
      { status: 500 }
    );
  }
};
