"use client"
import { iReview } from '../util/Interfaces'
import { useQuery } from '@tanstack/react-query';
import { getReviews } from '../util/serverFunctions';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';

const Reviews = ({ productId }: { productId: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId),
    refetchOnWindowFocus: false,
  }) as any

  const productCardOptions = {
    showLatestReview: false,
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>{error?.toString()}</p>;
  const reviews = data?.data as iReview[]
  console.log('this', reviews)

  return (
    <div className='flex flex-col w-full p-2 md:px-28 sm:pt-8 bg-myTheme-light'>
      <div>{reviews[0].product?.name} Reviews</div>
      <ProductCard
        // choosing the first review should be fine, just need to deal with 0 reviews
        product={reviews[0].product!}
        options={productCardOptions}
      />
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="p-4 border rounded shadow-md">
            const sanitizedHtmlContent = DOMPurify.sanitize(review.body);
            {/* Review content */}
            <div className="flex items-center mb-2">
              {/* <img src={review.user.avatar} alt={review.user?.userName} className="w-8 h-8 rounded-full mr-2" /> */}
              <div>
                <p className="font-semibold">{review.user?.firstName} {review.user?.lastName}</p>
                <p className="text-gray-600">{review.createdDate.toString()}</p>
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">{review.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: review.body }} className="mb-4" />
            <div className="flex items-center">
              <p className="text-gray-600 mr-2">{review.rating} / 5 stars</p>
              <div className="flex">
                <button className="mr-2">
                  Helpful <span className="text-gray-600">({review.helpfulVotes})</span>
                </button>
                <button>
                  Unhelpful <span className="text-gray-600">({review.unhelpfulVotes})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reviews