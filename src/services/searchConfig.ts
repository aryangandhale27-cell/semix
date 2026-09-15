// Intelligent Search Engine Configuration & Analytics
// Provides synonyms, field weights, normalizations, and query tracking
import { addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SearchConfig {
  weights: {
    exactNameMatch: number;
    nameStartsWith: number;
    exactSkuMatch: number;
    skuStartsWith: number;
    nameWordMatch: number;
    brandMatch: number;
    categoryMatch: number;
    specMatch: number;
    tagMatch: number;
    descriptionMatch: number;
    fuzzyMatch: number;
  };
  inStockBoost: number;
  outOfStockPenalty: number;
  minQueryLength: number;
  autocompleteLimit: number;
  fuzzyThreshold: number; // max edit distance
}

export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  weights: {
    exactNameMatch: 120,
    nameStartsWith: 70,
    exactSkuMatch: 100,
    skuStartsWith: 60,
    nameWordMatch: 45,
    brandMatch: 40,
    categoryMatch: 35,
    specMatch: 30,
    tagMatch: 25,
    descriptionMatch: 15,
    fuzzyMatch: 20,
  },
  inStockBoost: 10,
  outOfStockPenalty: -15,
  minQueryLength: 1,
  autocompleteLimit: 8,
  fuzzyThreshold: 2,
};

// Technical normalizations and synonyms for electronics marketplace
export const ELECTRONICS_SYNONYMS: Record<string, string[]> = {
  // Microcontrollers and boards
  mcu: ['microcontroller', 'micro-controller', 'processor', 'board', 'development board'],
  microcontroller: ['mcu', 'micro controller', 'micro-controller', 'board', 'processor'],
  'dev board': ['development board', 'breakout board', 'board', 'module'],
  'development board': ['dev board', 'breakout board', 'board', 'module'],
  arduino: ['uno', 'nano', 'mega', 'atmega328p', 'atmega2560'],
  'arduino uno': ['uno', 'uno r3', 'uno r4', 'atmega328p'],
  uno: ['arduino uno', 'uno r3', 'uno r4'],
  nano: ['arduino nano', 'atmega328p nano'],
  mega: ['arduino mega', 'mega 2560', 'atmega2560'],
  stm32: ['stm32f4', 'stm32f401', 'stm32f103', 'blue pill', 'black pill', 'arm cortex'],
  stm32f4: ['stm32', 'stm32f401', 'black pill', 'cortex-m4'],
  stm32f1: ['stm32', 'stm32f103', 'blue pill', 'cortex-m3'],
  esp32: ['esp32-wroom', 'nodemcu', 'wifi', 'bluetooth', 'espressif'],
  rpi: ['raspberry pi', 'sbc'],
  'raspberry pi': ['rpi', 'pi 5', 'pico', 'single board computer'],

  // Architecture & Bits
  '32-bit': ['32 bit', '32bit', '32bits', 'cortex-m4', 'cortex-m3', 'ra4m1', 'rp2350', 'xtensa'],
  '32 bit': ['32-bit', '32bit', '32bits'],
  '32bit': ['32-bit', '32 bit'],
  '64-bit': ['64 bit', '64bit', 'cortex-a76'],
  '64 bit': ['64-bit', '64bit'],
  '64bit': ['64-bit', '64 bit'],

  // Electrical units: Ohms
  '8 ohm': ['8ohm', '8-ohm', '8 ohms', '8Ω', '8 Ω', 'speaker'],
  '8Ω': ['8 ohm', '8ohm', '8-ohm', '8 ohms', '8 Ω'],
  '8-ohm': ['8 ohm', '8Ω', '8ohm', '8 ohms'],
  '8ohm': ['8 ohm', '8Ω', '8-ohm', '8 ohms'],
  ohm: ['Ω', 'ohms', 'resistance', 'resistor'],
  'Ω': ['ohm', 'ohms', 'resistance', 'resistor'],
  ohms: ['ohm', 'Ω', 'resistance'],

  // Voltage
  '5v': ['5 volt', '5 volts', '5-volt', '5vdc', '5 v'],
  '5 volt': ['5v', '5 volts', '5-volt', '5vdc', '5 v'],
  '5 volts': ['5v', '5 volt', '5-volt', '5vdc'],
  '3.3v': ['3.3 volt', '3.3 volts', '3.3-volt', '3v3', '3.3 v'],
  '3.3 volt': ['3.3v', '3.3 volts', '3v3'],
  '12v': ['12 volt', '12 volts', '12vdc', '12 v'],
  '12 volt': ['12v', '12 volts'],

  // Relays and Switching
  relay: ['relays', 'relay module', 'spdt relay', 'solid state relay', 'ssr', 'songle', '5v relay'],
  '5v relay': ['5v relay module', 'relay', '5v dc relay', 'songle relay', 'spdt relay'],
  'relay module': ['relay', '5v relay', 'switch'],

  // Sensors & Temperature
  'temperature sensor': ['temp sensor', 'thermometer', 'thermal sensor', 'dht22', 'ds18b20', 'temperature'],
  'temp sensor': ['temperature sensor', 'thermometer', 'dht22', 'ds18b20'],
  thermometer: ['temperature sensor', 'temp sensor'],
  sensor: ['sensors', 'detector', 'transducer', 'module'],

  // Displays & Actuators
  display: ['screen', 'oled', 'lcd', 'monitor', 'tft'],
  oled: ['display', 'screen', 'ssd1306', '128x64'],
  lcd: ['display', 'screen', '1602', 'hd44780'],
  motor: ['motors', 'stepper', 'servo', 'bldc', 'brushless', 'gear motor', 'actuator'],
  servo: ['servomotor', 'sg90', 'servo motor', 'actuator'],
  bldc: ['brushless motor', 'brushless dc', 'outrunner'],
};

export interface SearchAnalyticsRecord {
  query: string;
  normalizedQuery: string;
  resultCount: number;
  timestamp: number;
  clickedProductId?: string;
  clickedProductName?: string;
}

const ANALYTICS_COLLECTION = 'search_analytics';

export function recordSearchQuery(
  query: string, 
  normalizedQuery: string, 
  resultCount: number,
  clickedProductId?: string,
  clickedProductName?: string
 ): void {
  if (!query || query.trim().length < 2) return;
  const newRecord: SearchAnalyticsRecord = {
      query: query.trim(),
      normalizedQuery,
      resultCount,
      timestamp: Date.now(),
      clickedProductId,
      clickedProductName
  };
  void addDoc(collection(db, ANALYTICS_COLLECTION), newRecord).catch((error) => {
    console.error('[SearchAnalytics] Firestore write failed:', error);
  });
}

export async function getSearchAnalytics(): Promise<SearchAnalyticsRecord[]> {
  const snapshot = await getDocs(collection(db, ANALYTICS_COLLECTION));
  return snapshot.docs
    .map((item) => item.data() as SearchAnalyticsRecord)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 150);
}

export async function clearSearchAnalytics(): Promise<void> {
  const snapshot = await getDocs(collection(db, ANALYTICS_COLLECTION));
  await Promise.all(snapshot.docs.map((item) => deleteDoc(item.ref)));
}
