import { prisma } from "@/app/util/prismaClient";
import { iProduct } from "@/app/util/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import { allowedDomains } from "@/lib/allowedDomains";
import { checkReferer } from "@/lib/checkReferrer";

export async function POST(request: NextRequest) {
  const referer = request.headers.get("referer") as string;
  console.log(referer);

  // Check if the referer is present and is one of the allowed domains
  if (!checkReferer(referer, allowedDomains)) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  try {
    const products = (await prisma.product.findMany({
      orderBy: {
        createdDate: "desc",
      },
    })) as unknown as iProduct[];

    return NextResponse.json({
      success: true,
      status: 200,
      dataLength: products.length,
      data: products,
    });
  } catch (error) {
    let e = error as Error;
    console.log(e.message);
    return NextResponse.json({
      success: false,
      status: 500,
      data: e.message.slice(0, 500) + "...",
    });
  }
}
