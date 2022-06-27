import styles from './main.module.scss';
import {StrengthIndex} from './type';


export const strengthStyleLookup: {[index in StrengthIndex]: string} = {
  [-3]: styles['strength-indicator-bear-3'],
  [-2]: styles['strength-indicator-bear-2'],
  [-1]: styles['strength-indicator-bear-1'],
  [0]: styles['strength-indicator-neutral'],
  [1]: styles['strength-indicator-bull-1'],
  [2]: styles['strength-indicator-bull-2'],
  [3]: styles['strength-indicator-bull-3'],
};