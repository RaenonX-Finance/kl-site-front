import {PeriodInfo, ProductInfo} from '../../types/data';
import {StateBase} from '../types';


export const DATA_STATE_NAME = 'Data';

export type DataState = StateBase & {
  products: {[security in string]: ProductInfo},
  periods: {[periodSec in number]: PeriodInfo},
  lastPxUpdate: {[security in string]?: number},
};
