// Importing necessary modules and packages
import { prisma } from "@/app/util/prismaClient";
import { NextResponse, NextRequest } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { userInDb } from "@/app/util/userInDb";
import { addUserToDb } from "@/app/util/addUserToDb";
import { iReview } from "@/app/util/Interfaces";

// Interface representing user data
interface UserDATA {
  avatar?: string;
  azp: string;
  email: string;
  exp: number;
  firstName: string;
  lastName: string;
  fullName: string;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
  sub: string;
  userId: string;
  userName: string;
  metadata: {
    id: string;
    userInDb: boolean;
  };
}

export async function POST(request: NextRequest) {
  const reviewData: iReview = await request.json();
  let clerkUserData = null;

  try {
    const { sessionClaims } = getAuth(request as any);
    const clerkClaimsData = sessionClaims as unknown as UserDATA;

    if (!(await userInDb(clerkClaimsData.userId))) {
      clerkUserData = await addUserToDb(clerkClaimsData);
    } else {
      clerkUserData = await clerkClient.users.getUser(clerkClaimsData.userId);

      if (clerkUserData.publicMetadata.id !== undefined) {
        reviewData.userId = clerkUserData.publicMetadata.id as string;
      } else {
        return NextResponse.json({
          success: false,
          status: 401,
          data: "publicMetadata.id not found",
        });
      }
    }

    // Create the review and its associated VoteCount entry in a single transaction
    const review = await prisma.$transaction(async (prisma) => {
      const newReview = await prisma.review.create({
        data: {
          body: reviewData.body,
          rating: reviewData.rating,
          userId: reviewData.userId,
          title: reviewData.title,
          productId: reviewData.productId,
          createdDate: reviewData.createdDate,
          images: reviewData.images,
          videos: reviewData.videos,
          links: reviewData.links,
          createdBy: clerkClaimsData.userName,
          voteCount: {
            create: {
              helpfulVotes: 0,
              unhelpfulVotes: 0,
            },
          },
        },
      });

      return newReview;
    });

    return NextResponse.json({
      success: true,
      status: 200,
      data: review,
    });
  } catch (error) {
    let e = error as Error;
    console.log(e.message);
    return NextResponse.json({
      success: false,
      status: 500,
      data: e.message,
    });
  }
}
