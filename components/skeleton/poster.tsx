import React, { FunctionComponent } from 'react';

const PosterSkeleton: FunctionComponent = () => (
  <div
    className=" bg-dark-components shadow"
    style={{ height: 281, width: 190 }}
  >
    <div className="animate-pulse px-5 flex space-x-4" />
  </div>
);

export default PosterSkeleton;
