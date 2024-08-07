import LoanApplicationService from "@/classes/LoanApplicationServices";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      throw new Error("Token de autorización no proporcionado");
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      throw new Error("Token no válido");
    }

    const { loanId, newCantityOpt } = await req.json();

    console.log(loanId, newCantityOpt)

    if (!loanId) throw new Error("loanId is required!");
    if (newCantityOpt == null) throw new Error("newCantityOpt is required!");

    const response = await LoanApplicationService.ChangeCantity(
      loanId,
      newCantityOpt
    );

    if (response) {
      return NextResponse.json({ success: true, data: response });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
