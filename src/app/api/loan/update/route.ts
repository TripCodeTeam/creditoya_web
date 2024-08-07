import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import UserService from "@/classes/UserServices";

export async function PUT(req: Request) {
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
    );

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const { userId, data } = await req.json();

    if (!userId) throw new Error("LoanId is required!");
    if (!data) throw new Error("Data user is required!");

    // Obtenemos el usuario
    const user = await UserService.get(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizamos los datos del usuario utilizando el UserService
    const response = await UserService.update({
      id: userId,
      data: data,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
