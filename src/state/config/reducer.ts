import {createSlice} from '@reduxjs/toolkit';

import {mergedDispatchers} from '../aggregated/dispatchers';
import {MergedDispatcherName} from '../aggregated/types';
import {configDispatchers} from './dispatchers';
import {CONFIG_STATE_NAME, ConfigDispatcherName, ConfigState} from './types';
import {generateInitialConfig} from './utils';


const initialState: ConfigState = {
  layoutType: null,
  layoutConfig: null,
};

const slice = createSlice({
  name: CONFIG_STATE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      mergedDispatchers[MergedDispatcherName.INIT_APP],
      (state: ConfigState, {payload}) => {
        const {config} = payload;

        return {
          layoutType: config.layout_type || '4-2x2',
          layoutConfig: config.layout_config || generateInitialConfig(),
        };
      },
    );
    builder.addCase(
      configDispatchers[ConfigDispatcherName.UPDATE_LAYOUT_TYPE].fulfilled,
      (state: ConfigState, {payload}) => {
        const {layoutType} = payload;

        state.layoutType = layoutType;
      },
    );
    builder.addCase(
      configDispatchers[ConfigDispatcherName.UPDATE_LAYOUT_CONFIG].fulfilled,
      (state: ConfigState, {payload}) => {
        const {slot, configKey, value} = payload;

        if (!state.layoutConfig) {
          console.error(
            'Attempt to update the layout config while the config is not ready. (Reducer)',
            JSON.stringify(state),
          );
          return;
        }

        state.layoutConfig[slot][configKey] = value;
      },
    );
  },
});

export default slice.reducer;
