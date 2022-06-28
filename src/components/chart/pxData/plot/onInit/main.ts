import {PxChartInitEventHandler} from '../../type';
import {handleLegendUpdate} from '../eventHandler';
import {handleLegend} from './legend';
import {handlePrice} from './price';
import {handleSR} from './sr';
import {handleSrCustom} from './srCustom';


export const onPxChartInit: PxChartInitEventHandler = (e) => {
  const price = handlePrice(e);
  const srLevelLines = handleSR(e, price);
  handleLegend(e);
  handleSrCustom(e, price);
  handleLegendUpdate(e);

  return {
    series: {price},
    lines: {srLevelLines},
  };
};
