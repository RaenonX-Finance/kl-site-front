// `jest-dom` extensions (for example, `expect` extension)
import '@testing-library/jest-dom';

import {TextDecoder, TextEncoder} from 'util';

import {configure} from '@testing-library/react';
import * as dotenv from 'dotenv';


dotenv.config();

import {isCi} from '../src/utils/env';
import {initMockConsoleBehavior} from './init/console';
import {initMockSocket} from './init/socket';

// Retry failing test at most 3 times if in CI
if (isCi()) {
  jest.retryTimes(3);
}

// Set findBy* and waitFor, etc. to 5 secs timeout
// https://github.com/testing-library/react-testing-library/issues/899#issuecomment-819761678
configure({asyncUtilTimeout: 5000});

initMockConsoleBehavior();
initMockSocket();

// Polyfill for `import {ObjectId} from 'mongodb';` to work
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
// Fix `setImmediate` issue when generating `jest` coverage report
global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;