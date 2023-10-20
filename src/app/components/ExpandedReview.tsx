'use client';
import ReviewCard from './ReviewCard';
import { useAtom } from "jotai";
import { currentReviewAtom, currentUserAtom } from "../store/store";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {  iReview, iComment } from '../util/Interfaces';
import { createCommentOnReview, getReview } from '../util/serverFunctions';
import LoadingSpinner from './LoadingSpinner';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useEffect, useState } from 'react';
import DisplayError from './DisplayError';
import ProductCard from './ProductCard';

const ExpandedReview = ({ reviewId }: { reviewId: string }) => {
  const queryClient = useQueryClient();
  const [reviewAtom] = useAtom(currentReviewAtom);
  const [isOpen, setIsOpen] = useState(true);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [comment, setComment] = useState<iComment>({
    reviewId: reviewId,
    body: textAreaValue,
    createdDate: new Date(),
  }
  )
  const [currentUser] = useAtom(currentUserAtom);


  const mutations = useMutation(
    createCommentOnReview,
    {
      onMutate: (newData) => {
        // Update the UI optimistically before the actual mutation
        queryClient.setQueryData(["review", reviewId], (oldData: any) => {
          // create a structure like the old data but with the new data
          newData.reviewId = reviewId;
          newData.isDeleted = false;
          newData.user = currentUser; // this works i just need to get my user
          let iReviewOldData: iReview = { ...oldData };
          iReviewOldData.comments.push(newData);
          // reverse the comments array
          iReviewOldData.comments = iReviewOldData.comments.reverse();
          return { ...iReviewOldData };
        });
      },
      // onSuccess: (data: iComment) => {
      // console.log('this is the comment', data);
      //pop up a notofication or a saving spinner on the comment
      // },
      onError: (error: Error) => {
        <DisplayError error={error.message} />
        console.error(error);
      }
    }
  )

  const handleCommentSubmit = async (newTextAreaValue: string) => {
    setTextAreaValue(newTextAreaValue);
    setIsOpen(!isOpen);
    mutations.mutate({ reviewId, body: newTextAreaValue });

  };

  useEffect(() => {
    // Update the comment object whenever textAreaValue changes
    setComment({
      ...comment,
      body: textAreaValue,
    });
  }, [textAreaValue]);



  // NOTE query to get the comments... really it gets the review and it contains the comments
  const { data, isLoading, isError } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      if (reviewAtom !== null) {
        const data = reviewAtom
        return data
      }
      // else return getProduct(id)
      console.log('review id is null')
      const data: any = await getReview(reviewId)
      return data.data
    },
    refetchOnWindowFocus: false,
  }) as any

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>fetch error</p>;
  const review = data as iReview
  // review.comments = review.comments.reverse()
  // filter allPproductsatom for id variable and return product

  // NOTE this is the useMutation mostly to do optimistic updates to the comments

  const productCardOptions = {
    showLatestReview: true,
    size: 'rating-md',
    showWriteReview: true,
    showClaimThisProduct: true
  }

  return (
    <div className="flex flex-col w-full p-2 md:px-36 sm:pt-8 ">
      <div className="mb-4">
      <ProductCard product={review?.product!} options={productCardOptions} />
      </div>
      {/* Display the full review details here */}
      {review ? (
        <>
          <ReviewCard review={review} />
          {/* create submit commit form here */}
          <CommentForm onSubmit={handleCommentSubmit} isOpen={isOpen} onClose={(isOpen: boolean) => { setIsOpen(!isOpen) }} />
        </>
      ) : (
        // Render a loading state or fetch the review details based on reviewId
        <div>Loading...</div>
      )}
      <div className="space-y-1 mt-2 gap-1 flex flex-col w-full justify-end items-end">
        <h2>Comments</h2>
        {/* arrange comments from newest to oldest */}
        {review?.comments?.length > 0 ? (
          <>
            {review?.comments
              .slice()
              .sort((a, b) => new Date(b.createdDate!).valueOf() - new Date(a.createdDate!).valueOf()) // Sort comments by createdDate in descending order
              .map((comment, index) => (
                <Comment comment={comment} key={index} />
              ))}
          </>
        ) : (
          <div>No comments yet</div>
        )}
      </div>
    </div>
  );
};

export default ExpandedReview;
