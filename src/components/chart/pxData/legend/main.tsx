import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import useResizeObserver from 'use-resize-observer';

import {useAnimation} from '../../../../hooks/animation';
import {PxData} from '../../../../types/pxData';
import {formatSignedNumber} from '../../../../utils/string';
import {PxChartLegendData} from '../type';
import {LegendDataCell, LegendDataCellProps} from './cell';
import {strengthIndicatorStyleLookup} from './const';
import styles from './main.module.scss';


export type PxChartLegendProps = {
  data: PxData,
  legend: PxChartLegendData,
  title: string,
};

export const PxChartLegend = (props: PxChartLegendProps) => {
  const {legend, title} = props;
  const {
    open,
    high,
    low,
    close,
    decimals,
    changeVal,
    changePct,
    strength,
  } = legend;

  const elemRef = useAnimation({
    deps: [strength],
  });
  const {ref, height} = useResizeObserver<HTMLDivElement>();

  let diffClassName: LegendDataCellProps['useValueClass'] = 'neutral';
  if (changeVal) {
    if (changeVal > 0) {
      diffClassName = 'up';
    } else if (changeVal < 0) {
      diffClassName = 'down';
    }
  }

  return (
    <div className={styles['legend']}>
      <Row className="g-0">
        <Col
          xs="auto"
          ref={ref}
          className={`${styles['strength-indicator']} ${strengthIndicatorStyleLookup[strength]}`}
          style={{fontSize: !!height ? (height * 0.65) : '2rem'}}
        >
          <span ref={elemRef}>
            {strength === '?' ? '?' : Math.abs(strength)}
          </span>
        </Col>
        <Col className={styles['main-content']}>
          <Row className="g-2">
            <Col className={styles['title']}>
              {title}
            </Col>
          </Row>
          <Row>
            <Col className="d-inline">
              <LegendDataCell title="開" value={open} decimals={decimals}/>
              <LegendDataCell title="高" value={high} decimals={decimals}/>
              <LegendDataCell title="低" value={low} decimals={decimals}/>
              <LegendDataCell title="收" value={close} decimals={decimals} large/>
              <LegendDataCell
                value={`${formatSignedNumber(changeVal, decimals)} (${formatSignedNumber(changePct, 2)}%)`}
                decimals={decimals} useValueClass={diffClassName}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
