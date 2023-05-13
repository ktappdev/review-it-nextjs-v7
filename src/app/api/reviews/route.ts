import client from "@/app/util/mongo";
import { NextResponse } from "next/server";


export async function POST(request: Request) { // get a review using post body
    const body = await request.json();
    console.log(body)
    try {
        if (typeof process.env.REVIEWS_COLLECTION === 'string') {
            const database = client.db(process.env.DATABASE);
            const collection = database.collection(process.env.REVIEWS_COLLECTION);
            collection.find({ rating: 3 })
            // console.log('This is reviews data', reviewsData)
            // return NextResponse.json(reviewsData);
        }
    }
    catch (error) {
        await client.close();
        console.log(error);
    }
}