import {createAction, createAsyncThunk} from '@reduxjs/toolkit';

import {PxDataFromSocket, PxDataMap, PxSlotName} from '../../types/pxData';
import {PxDataMarket} from '../../types/pxDataMarket';
import {updatePxDataBar} from '../../utils/calc';
import {overrideObject} from '../../utils/override';
import {updateCurrentPxDataTitle} from '../../utils/title';
import {createConfigAsyncThunk} from '../config/utils';
import {ReduxState} from '../types';
import {onAsyncThunkError} from '../utils';
import {PxDataDispatcherName, PxSlotMapUpdatePayload} from './types';
import {generateInitialSlotMap, isMarketPxUpdateOk} from './utils';


export const pxDataDispatchers = {
  [PxDataDispatcherName.INIT]: createAction<PxDataFromSocket[]>(PxDataDispatcherName.INIT),
  [PxDataDispatcherName.UPDATE_COMPLETE]: createAction<PxDataFromSocket[]>(PxDataDispatcherName.UPDATE_COMPLETE),
  [PxDataDispatcherName.UPDATE_MARKET]: createAsyncThunk<
    PxDataMap,
    PxDataMarket,
    {state: ReduxState, rejectValue: string}
  >(
    PxDataDispatcherName.UPDATE_MARKET,
    async (payload, {getState, dispatch, rejectWithValue}) => {
      const {config, pxData} = getState();
      // FIXME: Change `layoutConfig` to use shared config
      const {layoutConfig} = config;

      if (!layoutConfig) {
        return onAsyncThunkError({
          message: `Attempt to update market data while the layout config is not ready.`,
          data: null,
          rejectWithValue,
          dispatch,
        });
      }

      const pxDataMap: PxDataMap = {
        A: null,
        B: null,
        C: null,
        D: null,
      };

      for (const slotStr of Object.keys(pxData.data)) {
        const slot = slotStr as PxSlotName;
        const pxDataInSlot = pxData.data[slot];
        const lastBar = pxDataInSlot?.data.at(-1);
        const latestMarket = pxDataInSlot ? payload[pxDataInSlot.contract.symbol] : undefined;

        if (!pxDataInSlot) {
          pxDataMap[slot] = null;
          continue;
        }
        if (
          // Check if the `pxData` is potentially update-able
          !latestMarket ||
          // Check if the `pxData` in slot is has the matching security symbol
          !payload.hasOwnProperty(pxDataInSlot.contract.symbol) ||
          // Check if it's OK to update
          !isMarketPxUpdateOk({layoutConfig, pxData: pxDataInSlot, slot, lastBar, last: latestMarket.close})
        ) {
          pxDataMap[slot] = {
            ...pxDataInSlot,
            lastUpdated: Date.now(),
          };
          continue;
        }
        if (!lastBar) {
          return onAsyncThunkError({
            message: (
              `Last data of the PxData ${pxDataInSlot.contract.symbol} @ ${pxDataInSlot.periodSec / 60} undefined.`
            ),
            data: pxDataInSlot,
            rejectWithValue,
            dispatch,
          });
        }

        pxDataMap[slot] = {
          ...pxDataInSlot,
          data: pxDataInSlot.data.slice(0, -1).concat([updatePxDataBar(lastBar, latestMarket.close)]),
          latestMarket,
          lastUpdated: Date.now(),
        };
      }

      updateCurrentPxDataTitle(pxData.data);

      return pxDataMap;
    },
  ),
  [PxDataDispatcherName.UPDATE_SLOT_MAP]: createConfigAsyncThunk<
    PxSlotMapUpdatePayload,
    'slot_map',
    PxSlotName
  >({
    actionName: PxDataDispatcherName.UPDATE_SLOT_MAP,
    key: 'slot_map',
    getData: ({pxData}, {slot, symbol, periodMin}) => overrideObject(
      pxData.map || generateInitialSlotMap(),
      {[slot]: `${symbol}@${periodMin}`},
    ),
    getPayload: ({slot}) => slot,
  }),
};
