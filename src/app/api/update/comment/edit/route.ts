
import { prisma } from "@/app/util/prismaClient";
import { NextResponse, NextRequest } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { userInDb } from "@/app/util/userInDb";
import { iComment } from "@/app/util/Interfaces";
import { addUserToDb } from "@/app/util/addUserToDb";
import { sanitizeDeletedCommentsInComment } from "@/app/util/sanitizeDeletedComments";

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
  metadata: { userInDb: boolean, id: string }
}
export async function POST(request: NextRequest) {

  const body: { id: string, commentBody: string } = await request.json();
  // Initialize a variable to store the Clerk user data
  let clerkUserData = null;
  let userIdFromClerk = null;

  if (!body.id) {
    return NextResponse.json({
      success: false,
      status: 400,
      message: "Comment ID is required",
    });
  }

  try {
    // Extract the session claims from the request
    const { sessionClaims } = getAuth(request as any);
    // Cast the session claims to the `UserDATA` type
    const clerkClaimsData = sessionClaims as unknown as UserDATA;

    // Check if the user already exists in the database
    if (!(await userInDb(clerkClaimsData.userId))) {
      // If the user doesn't exist, create them
      clerkUserData = await addUserToDb(clerkClaimsData);
    } else {
      // If the user already exists, retrieve their data from the database
      clerkUserData = await clerkClient.users.getUser(clerkClaimsData.userId);
      // then add publicMetaData.id to the object
      if (clerkUserData.publicMetadata.id !== undefined) {
        userIdFromClerk = clerkUserData.publicMetadata
          .id as string;
      }
    }


    const editedComment = await prisma.comment.update({
      where: {
        id: body.id,
      },
      data: {
        body: body.commentBody,
      },
    },
    );

    const editedCommentFromDb = sanitizeDeletedCommentsInComment(editedComment as iComment);

    return NextResponse.json({
      success: true,
      status: 200,
      data: editedCommentFromDb,
    });

  } catch (error) {
    let e = error as Error;
    // Return an error response
    return NextResponse.json({
      success: false,
      status: 500,
      data: e,
    });
  }
}
