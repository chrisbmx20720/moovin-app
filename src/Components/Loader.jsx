import * as React from 'react';
import { Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export const DeterminateLoaderExample = ({ percentage }) => {
  return (
    <>
      <Loader percentage={percentage} isDeterminate />
      <Loader variation="linear" percentage={percentage} isDeterminate />
    </>
  );
};
