import { iReview } from "@/app/util/Interfaces";
import { prisma } from "@/app/util/prismaClient";
import { sanitizeDeletedCommentsInReviews } from "@/app/util/sanitizeDeletedComments";
import { NextRequest, NextResponse } from "next/server";
import { cleanReview, cleanReviews, createFilter } from "@/app/store/badWordsFilter";
const filter = createFilter();

export async function POST(request: NextRequest) {
  interface Body {
    id: string;
    isPublic: boolean;
    user: boolean;
    product: boolean;
    comments: boolean;
  }

  const body: Body = await request.json();

  try {
    const reviews = await prisma.review.findMany({
      where: { isPublic: body.isPublic, productId: body.id },
      orderBy: {
        createdDate: "desc",
      },
      include: {
        user: body.user,
        product: body.product,
        comments: body.comments
          ? {
            include: {
              user: true,
            },
          }
          : false,
        voteCount: true,
        likedBy: true,
      },
    });

    let product = null;

    // If no reviews found, fetch the product details
    if (reviews.length === 0) {
      product = await prisma.product.findUnique({
        where: { id: body.id },
      });
    }
    let treatedReviews = sanitizeDeletedCommentsInReviews(reviews as iReview[]);
    treatedReviews = cleanReviews(await filter, treatedReviews);

    return NextResponse.json({
      success: true,
      status: 200,
      data: {
        treatedReviews,
        product,
      },
    });
  } catch (error) {
    let e = error as Error;
    return NextResponse.json({
      success: false,
      status: 500,
      data: e.message.slice(0, 500) + "...",
    });
  }
}
