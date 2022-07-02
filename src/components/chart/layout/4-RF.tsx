import React from 'react';

import useResizeObserver from 'use-resize-observer';

import {LayoutBase} from './base';
import {PxDataLayoutPane} from './pxData';
import {LayoutProps} from './type';


export const Layout4ofRF = ({}: LayoutProps) => {
  const {ref, width, height} = useResizeObserver<HTMLDivElement>();

  return (
    <LayoutBase refCallback={ref}>
      {!!width && !!height && (
        <>
          <PxDataLayoutPane slot="A" x={0} y={0} width={width / 2} height={height / 3}/>
          <PxDataLayoutPane slot="B" x={0} y={height * (1 / 3)} width={width / 2} height={height / 3}/>
          <PxDataLayoutPane slot="C" x={0} y={height * (2 / 3)} width={width / 2} height={height / 3}/>
          <PxDataLayoutPane slot="D" x={width / 2} y={0} width={width / 2} height={height}/>
        </>
      )}
    </LayoutBase>
  );
};
