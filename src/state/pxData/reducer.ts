import {createSlice} from '@reduxjs/toolkit';

import {PxData, PxDataSocket} from '../../types/pxData';
import {PxDataMarket} from '../../types/pxDataMarket';
import {getNewBarOfPx, updatePxDataBar} from '../../utils/calc';
import {getCurrentLocalEpochOfPeriod, updateEpochSecToLocal} from '../../utils/time';
import {updateCurrentPxDataTitle} from '../../utils/title';
import {pxDataDispatchers} from './dispatchers';
import {PX_DATA_STATE_NAME, PxDataDispatcherName, PxDataState} from './types';


const initialState: PxDataState = {};

const fixPxData = (pxData: PxData): PxData => {
  pxData.data = pxData.data.map((item) => ({
    ...item,
    epochSec: updateEpochSecToLocal(item.epochSec),
    lastUpdated: Date.now(),
  }));

  return pxData;
};

const slice = createSlice({
  name: PX_DATA_STATE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      pxDataDispatchers[PxDataDispatcherName.INIT],
      (state: PxDataState, {payload}: {payload: PxDataSocket[]}) => {
        payload.forEach((pxData) => state[pxData.uniqueIdentifier] = fixPxData({
          ...pxData,
          lastUpdated: Date.now(),
        }));
        updateCurrentPxDataTitle(state);
      },
    );
    builder.addCase(
      pxDataDispatchers[PxDataDispatcherName.UPDATE],
      (state: PxDataState, {payload}: {payload: PxDataSocket}) => {
        state[payload.uniqueIdentifier] = fixPxData({
          ...payload,
          lastUpdated: Date.now(),
        });
        updateCurrentPxDataTitle(state);
      },
    );
    builder.addCase(
      pxDataDispatchers[PxDataDispatcherName.UPDATE_MARKET],
      (state: PxDataState, {payload}: {payload: PxDataMarket}) => {
        const {symbol, px} = payload;

        Object.entries(state).forEach(([_, pxData]) => {
          if (pxData.contract.symbol !== symbol) {
            return;
          }

          const lastBar = pxData.data.at(-1);

          if (!lastBar) {
            console.error(
              `Last data of the PxData ` +
              `(Contract: ${pxData.contract.symbol} / Period: ${pxData.periodSec} sec) undefined.`,
            );
            return;
          }

          const currentEpochOfPeriod = getCurrentLocalEpochOfPeriod(pxData.periodSec);

          if (lastBar.epochSec === currentEpochOfPeriod) {
            pxData.data[pxData.data.length - 1] = updatePxDataBar(lastBar, px);
          } else {
            pxData.data.push(getNewBarOfPx(px, currentEpochOfPeriod));
          }

          pxData.lastUpdated = Date.now();
        });

        updateCurrentPxDataTitle(state);
      },
    );
  },
});

export default slice.reducer;
