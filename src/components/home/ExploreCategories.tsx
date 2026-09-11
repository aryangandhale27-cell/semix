import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryCard, CATEGORY_IMAGE_MAP } from '../common/CategoryCard';
import { Category } from '../../types';

// Default 12 electronic engineering categories as specified
export const DEFAULT_EXPLORE_CATEGORIES: Category[] = [
  {
    id: 'cat-electronic-components',
    name: 'Electronic Components',
    slug: 'electronic-components',
    iconName: 'Zap',
    description: 'Resistors, capacitors, diodes, transistors, relays, crystals, fuses, and IC sockets',
    count: 184,
    color: '#FF6B00',
    image: CATEGORY_IMAGE_MAP['cat-electronic-components'],
    popularItems: ['1/4W Metal Film Resistors', '1N4007 Diode Pack', '5V SPDT Relay']
  },
  {
    id: 'cat-electronic-modules-dev-boards',
    name: 'Electronic Modules and Development Boards',
    slug: 'electronic-modules-and-development-boards',
    iconName: 'Cpu',
    description: 'Arm Cortex, ESP32, Raspberry Pi, Arduino, STM32, IoT compute, and breakout modules',
    count: 142,
    color: '#561269',
    image: CATEGORY_IMAGE_MAP['cat-electronic-modules-dev-boards'],
    popularItems: ['Raspberry Pi 5', 'Arduino Uno R4', 'ESP32-WROOM-32D']
  },
  {
    id: 'cat-batteries-power-supply',
    name: 'Batteries and Power Supply',
    slug: 'batteries-and-power-supply',
    iconName: 'BatteryCharging',
    description: 'LiPo packs, 18650 cells, TP4056 chargers, buck-boost converters, SMPS, and BMS boards',
    count: 76,
    color: '#FF6B00',
    image: CATEGORY_IMAGE_MAP['cat-batteries-power-supply'],
    popularItems: ['3S 2200mAh LiPo', 'TP4056 Type-C Charger', 'LM2596 Buck Converter']
  },
  {
    id: 'cat-smd-sample-books-kits',
    name: 'SMD Sample Books and Kits',
    slug: 'smd-sample-books-and-kits',
    iconName: 'BookOpen',
    description: '0402, 0603, 0805, 1206 resistor & capacitor sample books, lab component binder kits',
    count: 32,
    color: '#561269',
    image: CATEGORY_IMAGE_MAP['cat-smd-sample-books-kits'],
    popularItems: ['0805 SMD Resistor Book', '0603 Capacitor Kit', 'SMD Diode Sample Binder']
  },
  {
    id: 'cat-cables-connectors',
    name: 'Cables and Connectors',
    slug: 'cables-and-connectors',
    iconName: 'Share2',
    description: 'Dupont jumpers, JST-XH, XT60/XT90, silicone wire, terminal blocks, USB & ribbon cables',
    count: 98,
    color: '#FF6B00',
    image: CATEGORY_IMAGE_MAP['cat-cables-connectors'],
    popularItems: ['Dupont 40-pin Jumpers', 'XT60 Male/Female Pair', 'JST-XH 2.54mm Kit']
  },
  {
    id: 'cat-hardware-tools',
    name: 'Hardware and Tools',
    slug: 'hardware-and-tools',
    iconName: 'Wrench',
    description: 'Soldering irons, digital multimeters, wire strippers, ESD tweezers, standoff kits, and PCB holders',
    count: 58,
    color: '#561269',
    image: CATEGORY_IMAGE_MAP['cat-hardware-tools'],
    popularItems: ['T12 Soldering Station', 'Digital Multimeter Auto-range', 'M3 Brass Standoff Kit']
  },
  {
    id: 'cat-displays',
    name: 'Displays',
    slug: 'displays',
    iconName: 'Tv',
    description: '0.96" OLEDs, 16x2 I2C LCDs, TFT touchscreens, e-paper displays, and LED matrix panels',
    count: 46,
    color: '#FF6B00',
    image: CATEGORY_IMAGE_MAP['cat-displays'],
    popularItems: ['0.96 inch I2C OLED', '1602 LCD with I2C Backpack', '2.8" SPI TFT Touchscreen']
  },
  {
    id: 'cat-robotics-diy-kits',
    name: 'Robotics and DIY Kits',
    slug: 'robotics-and-diy-kits',
    iconName: 'Bot',
    description: '2WD/4WD chassis, obstacle avoiding robot kits, robotic arms, STEM educational kits, and track platforms',
    count: 64,
    color: '#561269',
    image: CATEGORY_IMAGE_MAP['cat-robotics-diy-kits'],
    popularItems: ['4WD Smart Robot Car Chassis', '4-DOF Acrylic Robot Arm', 'Line Follower DIY Kit']
  },
  {
    id: 'cat-motors',
    name: 'Motors',
    slug: 'motors',
    iconName: 'Cog',
    description: 'N20 metal gear motors, SG90 & MG996R servos, NEMA 17 steppers, A2212 BLDC brushless motors',
    count: 72,
    color: '#FF6B00',
    image: CATEGORY_IMAGE_MAP['cat-motors'],
    popularItems: ['SG90 9g Micro Servo', 'N20 6V Micro Gear Motor', 'A2212 1400KV Brushless Motor']
  },
  {
    id: 'cat-sensors',
    name: 'Sensors',
    slug: 'sensors',
    iconName: 'Activity',
    description: 'MPU-6050 IMU, HC-SR04 ultrasonic, BMP280 barometer, DHT22 temp/humidity, gas and optical sensors',
    count: 112,
    color: '#561269',
    image: CATEGORY_IMAGE_MAP['cat-sensors'],
    popularItems: ['MPU-6050 6-DOF IMU', 'HC-SR04 Ultrasonic Sensor', 'BMP280 Barometric Pressure']
  },
  {
    id: 'cat-physics-instruments',
    name: 'Physics Instruments',
    slug: 'physics-instruments',
    iconName: 'Compass',
    description: 'Galvanometers, optical prisms, tuning forks, rheostats, magnetic field apparatus, and lab physics demonstrators',
    count: 35,
    color: '#FF6B00',
    image: CATEGORY_IMAGE_MAP['cat-physics-instruments'],
    popularItems: ['Slide Wire Rheostat 50 Ohm 1.5A', 'Optical Glass Triangular Prism', 'Digital Tachometer Non-contact']
  },
  {
    id: 'cat-smd-components',
    name: 'SMD Components',
    slug: 'smd-components',
    iconName: 'Grid',
    description: 'SMD ICs, SOT-23 voltage regulators, 0805/0603 chip resistors, ceramic capacitors, MOSFETs, and diodes',
    count: 156,
    color: '#561269',
    image: CATEGORY_IMAGE_MAP['cat-smd-components'],
    popularItems: ['AMS1117-3.3V SOT-223 Regulators', '0805 10k SMD Resistors Reel', 'AO3400 N-Channel SOT-23 MOSFET']
  }
];

interface ExploreCategoriesProps {
  categories?: Category[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  categories = DEFAULT_EXPLORE_CATEGORIES,
  title = 'Explore Categories',
  subtitle = 'Browse microcontrollers, sensors, drone gear, and robotics silicon',
  viewAllLink = '/shop'
}) => {
  return (
    <section id="featured-categories-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Header Section: Title, Subtitle, and View All Action */}
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6 pb-1.5 sm:pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-base sm:text-2xl font-extrabold text-[#561269] flex items-center gap-1.5 sm:gap-2">
            <span>{title}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        </div>

        <Link
          to={viewAllLink}
          id="view-all-categories-btn"
          className="shrink-0 border border-[#561269] sm:border-2 text-[#561269] hover:bg-[#561269] hover:text-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-all shadow-2xs"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
      </div>

      {/* Responsive CSS Grid: 2 columns on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};
