import convertUnits, { Unit } from 'convert-units';
import { KeyValuePair } from '../types';

export const convertWeight = (weight: number, fromUnit: string, toUnit: string) => {
  const unitNames: KeyValuePair = {
    OUNCES: 'oz',
    POUNDS: 'lb',
    KILOGRAMS: 'kg',
  };

  const from = unitNames[fromUnit] as Unit;
  const to = unitNames[toUnit] as Unit;

  return convertUnits(weight).from(from).to(to);
};
