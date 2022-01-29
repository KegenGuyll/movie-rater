import { NextPage } from 'next';
import React from 'react';

import Navigation from '../components/navigation';
import Search from '../components/search';

const SearchPage: NextPage = () => (
  <div>
    <Navigation />
    <div className=" bg-dark-components p-2 rounded mx-2">
      <Search />
    </div>
  </div>
);

export default SearchPage;
