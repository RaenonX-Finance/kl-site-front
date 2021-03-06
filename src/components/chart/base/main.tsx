import React from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {configDispatchers} from '../../../state/config/dispatchers';
import {useSingleLayoutConfigSelector} from '../../../state/config/selector';
import {ConfigDispatcherName, LayoutConfigUpdatePayload} from '../../../state/config/type';
import {useDispatch} from '../../../state/store';
import {PxSlotName} from '../../../types/pxData';
import {PeriodTimer} from '../../periodTimer/main';
import {PxLayoutConfigSingle} from '../config/layout/type';
import {useTradingViewChart} from './hook';
import {PxChartLastUpdate} from './lastUpdate';
import styles from './main.module.scss';
import {
  ChartCalcObjects,
  ChartDataUpdatedEventHandler,
  ChartInitEventHandler,
  ChartRenderObjects,
  ChartSetStateObjects,
} from './type';


export type TradingViewChartProps<T, P, R, L, A> = {
  width: number,
  height: number,
  slot: PxSlotName,
  initChart: ChartInitEventHandler<T, R, L, A, P>,
  chartData: T,
  payload: P,
  onDataUpdated: ChartDataUpdatedEventHandler<T, P, R, L, A>,
  calcObjects: ChartCalcObjects<T, L>,
  renderObjects: ChartRenderObjects<T, L>,
  renderLayoutConfig: (
    security: string,
    config: A,
    setConfig: (newConfig: LayoutConfigUpdatePayload) => Promise<void>,
  ) => React.ReactNode,
  getPeriodSec: (data: T) => number,
  getDataSecurity: (data: T) => string,
};

export const TradingViewChart = <T, P, R, L>({
  width,
  height,
  slot,
  initChart,
  calcObjects,
  chartData,
  payload,
  onDataUpdated,
  renderObjects,
  renderLayoutConfig,
  getPeriodSec,
  getDataSecurity,
}: TradingViewChartProps<T, P, R, L, PxLayoutConfigSingle>) => {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chartDataRef = React.useRef<T>(chartData);
  const [legend, setLegend] = React.useState<L>(calcObjects.legend(chartData));
  const layoutConfig = useSingleLayoutConfigSelector(slot);
  const dispatch = useDispatch();
  // Need to be explicit because empty object `{}` is also falsy
  const isLayoutConfigReady = layoutConfig !== null;

  const setObject: ChartSetStateObjects<L> = {
    legend: setLegend,
  };

  const setLayoutConfig = async (payload: LayoutConfigUpdatePayload) => {
    await dispatch(configDispatchers[ConfigDispatcherName.UPDATE_LAYOUT_CONFIG](payload));
  };

  const onDataUpdatedInternal = () => {
    chartDataRef.current = chartData;
    if (!isLayoutConfigReady) {
      return;
    }

    onDataUpdated({chartRef, chartDataRef, chartObjectRef, setObject, payload, layoutConfig});
  };

  const onLoad = () => {
    if (!chartContainerRef.current || !isLayoutConfigReady) {
      return;
    }

    chartDataRef.current = chartData;
    makeChart({
      chartDataRef,
      setObject,
      layoutConfig,
      chartContainer: chartContainerRef.current,
      width,
      height,
      ...payload,
    });
  };

  const {makeChart, chartRef, chartObjectRef} = useTradingViewChart<T, R, L, PxLayoutConfigSingle, P>({
    initChart,
    onDataUpdated: onDataUpdatedInternal,
    width,
    height,
  });

  React.useEffect(onLoad, [isLayoutConfigReady]);
  React.useEffect(
    onDataUpdatedInternal,
    [chartObjectRef.current?.initData, payload, layoutConfig],
  );

  return (
    <div className={styles['chart']} ref={chartContainerRef}>
      <div className={styles['legend']}>
        {renderObjects.legend(chartData, legend)}
      </div>
      <div className={styles['toolbar']}>
        <Row className="g-2 align-items-center">
          <Col>
            {
              layoutConfig &&
              renderLayoutConfig(getDataSecurity(chartData), layoutConfig, setLayoutConfig)
            }
            <Button size="sm" variant="outline-success" className="me-2" onClick={() => {
              chartRef.current?.timeScale().scrollToRealTime();
            }}>
              ????????????
            </Button>
            <Button size="sm" variant="outline-warning" onClick={() => {
              chartRef.current?.timeScale().resetTimeScale();
              chartRef.current?.priceScale().applyOptions({autoScale: true});
            }}>
              ????????????
            </Button>
          </Col>
        </Row>
      </div>
      <div className={styles['status']}>
        <Row className="g-2">
          <Col/>
          <Col xs="auto">
            <PeriodTimer periodSec={getPeriodSec(chartData)}/>
          </Col>
          <Col xs="auto" className="text-end">
            <PxChartLastUpdate security={getDataSecurity(chartData)}/>
          </Col>
        </Row>
      </div>
    </div>
  );
};
