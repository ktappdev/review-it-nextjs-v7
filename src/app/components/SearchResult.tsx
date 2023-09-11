import React from 'react';
import { iProduct } from '../util/Interfaces';
import Link from 'next/link';
import ProductCardSlim from './ProductCardSlim';

interface SearchResultsProps {
  results: iProduct[];
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
}) => {
  const productCardOptions = {
    size: 'rating-sm',
  }

  return (
    <div className=" mt-2 flex flex-col mx-auto justify-center items-center">
      {results.map((result) => (

        <ProductCardSlim options={productCardOptions} product={result} key={result.id} />))}
    </div>
  );
};

export default SearchResults;
