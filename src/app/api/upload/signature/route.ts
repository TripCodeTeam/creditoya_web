import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary-conf";
import TokenService from "@/classes/TokenServices";

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      return NextResponse.json(
        { message: "Token de autorización no proporcionado" },
        { status: 401 }
      );
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const { img, userId, upSignatureId } = await req.json();

    console.log(img);

    if (!img) throw new Error("No se cargo la imagen");

    const response = await cloudinary.v2.uploader.upload(img, {
      folder: "signatures",
      public_id: `signature-${userId}-${upSignatureId}`,
    });

    return NextResponse.json({
      success: true,
      data: response.secure_url,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
