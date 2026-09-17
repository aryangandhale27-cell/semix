import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-electronic-components',
    name: 'Electronic Components',
    slug: 'electronic-components',
    iconName: 'Zap',
    description: 'Resistors, capacitors, diodes, transistors, relays, crystals, fuses, and IC sockets',
    count: 184,
    color: '#FF6B00',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=600&q=80',
    popularItems: ['AMS1117-3.3V SOT-223 Regulators', '0805 10k SMD Resistors Reel', 'AO3400 N-Channel SOT-23 MOSFET']
  },
  {
    id: 'cat-clearance',
    name: 'Clearance',
    slug: 'clearance',
    iconName: 'Tag',
    description: 'Reduced-price production stock and end-of-line components.',
    count: 0,
    color: '#FF6B00',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80',
    popularItems: []
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'RPI-5-8GB-ORIG',
    name: 'Raspberry Pi 5 Single Board Computer (8GB RAM)',
    brand: 'Raspberry Pi Foundation',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Single Board Computers',
    price: 8250,
    originalPrice: 8999,
    inStock: true,
    stockCount: 64,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Quad-core 64-bit Arm Cortex-A76 @ 2.4GHz with dual 4Kp60 micro-HDMI, PCIe 2.0 interface and VideoCore VII GPU.',
    description: 'The latest generation flagship computer from Raspberry Pi. Up to 3x faster CPU performance, substantially higher GPU processing with OpenGL ES 3.1 & Vulkan 1.2, dual-band Wi-Fi 802.11ac, Bluetooth 5.0 BLE, and dedicated RTC power button controller.',
    specifications: [
      { name: 'Processor', value: 'Broadcom BCM2712 2.4GHz quad-core 64-bit Arm Cortex-A76' },
      { name: 'RAM', value: '8GB LPDDR4X-4267 SDRAM' },
      { name: 'Operating Voltage', value: '5V DC via USB-C (5A PD recommended)' },
      { name: 'Display Ports', value: '2 × 4Kp60 micro-HDMI outputs with HDR' },
      { name: 'Connectivity', value: 'Gigabit Ethernet, Dual-band 802.11ac Wi-Fi, Bluetooth 5.0' },
      { name: 'Expansion', value: 'PCIe 2.0 ×1 interface via 16-pin FFC, 40-pin GPIO header' },
      { name: 'Dimensions', value: '88 × 56 × 17 mm' }
    ],
    datasheetUrl: 'https://datasheets.raspberrypi.com/rpi5/raspberry-pi-5-product-brief.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 8250 },
      { minQty: 5, discountPercent: 4, unitPrice: 7920 },
      { minQty: 20, discountPercent: 8, unitPrice: 7590 }
    ],
    tags: ['Raspberry Pi', 'ARM Cortex-A76', 'SBC', 'AI Edge', 'PCIe'],
    locationBin: 'BIN-A-01-4',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-002',
    sku: 'ARD-UNO-R4-WIFI',
    name: 'Arduino Uno R4 WiFi (RA4M1 32-bit Cortex-M4 + ESP32-S3)',
    brand: 'Arduino Official',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 2450,
    originalPrice: 2899,
    inStock: true,
    stockCount: 118,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Renesas RA4M1 48MHz 32-bit Cortex-M4 with ESP32-S3 WiFi/Bluetooth, 12x8 LED matrix, and DAC.',
    description: 'Retains the iconic UNO form factor with upgraded 32-bit power, expanded 256KB flash memory, native 12-bit DAC, CAN bus support, 5V operating logic, and built-in onboard 12x8 red LED Matrix display for direct animation and telemetry without extra shields.',
    specifications: [
      { name: 'Main MCU', value: 'Renesas RA4M1 (Arm Cortex-M4) @ 48 MHz' },
      { name: 'Wireless MCU', value: 'Espressif ESP32-S3-MINI-1 (WiFi 2.4GHz & BT 5.0)' },
      { name: 'Operating Voltage', value: '5V (Input limit up to 24V DC)' },
      { name: 'Memory', value: '256 KB Flash, 32 KB SRAM, 8 KB EEPROM' },
      { name: 'Digital I/O', value: '14 pins (6 PWM outputs)' },
      { name: 'Onboard Matrix', value: '12x8 Red Addressable LED Matrix' }
    ],
    datasheetUrl: 'https://docs.arduino.cc/resources/datasheets/ABX00087-datasheet.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2450 },
      { minQty: 10, discountPercent: 6, unitPrice: 2303 },
      { minQty: 50, discountPercent: 12, unitPrice: 2156 }
    ],
    tags: ['Arduino', 'Uno R4', 'WiFi', 'ESP32', '32-Bit', 'LED Matrix'],
    locationBin: 'BIN-A-02-1',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-003',
    sku: 'ESP32-WROOM-32D-MOD',
    name: 'ESP32-WROOM-32D Dual Core Wi-Fi + Bluetooth Dev Board (NodeMCU)',
    brand: 'Espressif Systems',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'IoT Modules',
    price: 380,
    originalPrice: 499,
    inStock: true,
    stockCount: 340,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Dual Xtensa 32-bit LX6 MCU @ 240MHz with 4MB SPI Flash, integrated 2.4GHz Wi-Fi and Bluetooth 4.2 BLE.',
    description: 'The industry-standard hobbyist and IoT prototyping powerhouse. Equipped with CP2102/CH340 USB-UART bridge, EN and BOOT buttons, onboard PCB antenna, and full support for ESP-IDF, Arduino IDE, and MicroPython.',
    specifications: [
      { name: 'CPU', value: 'Xtensa Dual-Core 32-bit LX6 microprocessor @ 240 MHz' },
      { name: 'Wireless', value: 'Wi-Fi 802.11 b/g/n + BLE 4.2 BR/EDR' },
      { name: 'Operating Voltage', value: '3.3V Logic (5V Micro-USB Input)' },
      { name: 'SRAM / Flash', value: '520 KB SRAM / 4 MB SPI Flash' },
      { name: 'Peripherals', value: 'Capacitive touch, ADC, DAC, UART, SPI, I2C, PWM' }
    ],
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32d_esp32-wroom-32u_datasheet_en.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 380 },
      { minQty: 10, discountPercent: 10, unitPrice: 342 },
      { minQty: 50, discountPercent: 18, unitPrice: 311 },
      { minQty: 100, discountPercent: 25, unitPrice: 285 }
    ],
    tags: ['ESP32', 'Espressif', 'WiFi', 'Bluetooth', 'IoT', 'Arduino Compatible'],
    locationBin: 'BIN-B-01-3',
    isFeatured: true,
    isBestSeller: true,
    voltage: '3.3V',
    protocol: 'I2C, SPI, UART'
  },
  {
    id: 'prod-004',
    sku: 'SEN-MPU-6050-6DOF',
    name: 'MPU-6050 3-Axis Gyroscope + 3-Axis Accelerometer Sensor Module (GY-521)',
    brand: 'InvenSense',
    category: 'Sensors',
    subcategory: 'Motion Sensors',
    price: 165,
    originalPrice: 240,
    inStock: true,
    stockCount: 215,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 188,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: '6-Degrees of Freedom IMU with onboard Digital Motion Processor (DMP) and standard I2C communication interface.',
    description: 'Combines a 3-axis gyroscope and a 3-axis accelerometer on the same silicon die together with an onboard Digital Motion Processor (DMP) capable of processing complex 9-axis MotionFusion algorithms.',
    specifications: [
      { name: 'Chipset', value: 'MPU-6050 (GY-521 Breakout)' },
      { name: 'Supply Voltage', value: '3.0V – 5.0V (Onboard low-dropout regulator)' },
      { name: 'Communication', value: 'Standard I2C Protocol (Fast-mode 400kHz)' },
      { name: 'Gyroscope Range', value: '±250, ±500, ±1000, ±2000 °/sec' },
      { name: 'Acceleration Range', value: '±2g, ±4g, ±8g, ±16g' }
    ],
    datasheetUrl: 'https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 165 },
      { minQty: 10, discountPercent: 12, unitPrice: 145 },
      { minQty: 50, discountPercent: 20, unitPrice: 132 }
    ],
    tags: ['IMU', 'Gyroscope', 'Accelerometer', 'Robotics', 'Drone', 'I2C'],
    locationBin: 'BIN-C-04-2',
    isBestSeller: true,
    voltage: '3.3V / 5V',
    protocol: 'I2C'
  },
  {
    id: 'prod-005',
    sku: 'SEN-BMP280-BARO',
    name: 'BMP280 High Precision Barometric Pressure & Altitude Sensor Module',
    brand: 'Bosch Sensortec',
    category: 'Sensors',
    subcategory: 'Environmental Sensors',
    price: 145,
    originalPrice: 210,
    inStock: true,
    stockCount: 160,
    minOrderQty: 1,
    rating: 4.6,
    reviewCount: 74,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Absolute barometric pressure and temperature sensor with ±1 hPa absolute accuracy and ±1 meter altitude resolution.',
    description: 'Engineered specifically for mobile applications, altimeters, weather forecasting stations, and quadcopter altitude hold systems. Supports both I2C and SPI digital interfaces.',
    specifications: [
      { name: 'Pressure Range', value: '300 to 1100 hPa (equiv. to +9000m to -500m sea level)' },
      { name: 'Operating Voltage', value: '1.8V – 3.6V DC (5V tolerant with onboard level shifter)' },
      { name: 'Interface', value: 'I2C (up to 3.4MHz) and SPI (3-wire / 4-wire up to 10MHz)' },
      { name: 'Resolution', value: 'Pressure: 0.16 Pa (~12 cm altitude)' }
    ],
    datasheetUrl: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp280-ds001.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 145 },
      { minQty: 10, discountPercent: 10, unitPrice: 130 },
      { minQty: 50, discountPercent: 18, unitPrice: 118 }
    ],
    tags: ['Barometer', 'Altitude', 'Weather', 'Bosch', 'I2C', 'SPI'],
    locationBin: 'BIN-C-05-1',
    isNew: false,
    isFeatured: false,
    voltage: '3.3V',
    protocol: 'I2C / SPI'
  },
  {
    id: 'prod-006',
    sku: 'BAT-LIPO-3S-2200-30C',
    name: 'Orange 3S 11.1V 2200mAh 30C Lithium Polymer (LiPo) Battery Pack',
    brand: 'Orange Power',
    category: 'Batteries and Power Supply',
    subcategory: 'LiPo Batteries',
    price: 1480,
    originalPrice: 1799,
    inStock: true,
    stockCount: 42,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'High discharge rate 30C (66A continuous) 3-cell LiPo with standard XT60 main connector and JST-XH balance plug.',
    description: 'Designed for high drain applications including racing drones, quadcopters, RC planes, robotics chassis, and high power motor test benches. Manufactured with low internal resistance cells for high power output.',
    specifications: [
      { name: 'Nominal Voltage', value: '11.1V (3S1P / 3.7V per cell)' },
      { name: 'Capacity', value: '2200 mAh' },
      { name: 'Discharge Rating', value: '30C Continuous (66A), 60C Burst (132A)' },
      { name: 'Discharge Connector', value: 'Amass XT60 Genuine Connector (12AWG Silicone Wire)' },
      { name: 'Balance Connector', value: 'JST-XH 4-Pin' },
      { name: 'Weight', value: '178 grams (± 5g)' }
    ],
    datasheetUrl: 'https://example.com/datasheets/orange-3s-2200-spec.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 1480 },
      { minQty: 5, discountPercent: 5, unitPrice: 1406 },
      { minQty: 20, discountPercent: 12, unitPrice: 1302 }
    ],
    tags: ['LiPo', '3S Battery', 'Drone', 'RC Plane', 'XT60', 'Orange'],
    locationBin: 'BIN-D-02-3',
    isFeatured: true,
    voltage: '11.1V'
  },
  {
    id: 'prod-007',
    sku: 'DRV-L298N-DUAL-HBRDG',
    name: 'L298N Dual H-Bridge DC Stepper Motor Driver Controller Board',
    brand: 'STMicroelectronics Core',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Motor Drivers',
    price: 185,
    originalPrice: 250,
    inStock: true,
    stockCount: 195,
    minOrderQty: 1,
    rating: 4.6,
    reviewCount: 245,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Heavy-duty dual H-bridge motor driver capable of driving two DC motors or one 2-phase 4-wire stepper motor up to 2A per channel.',
    description: 'Equipped with large aluminum heat sink, screw terminals for motor and power wires, and onboard 78M05 5V regulator for logic circuitry. Supports PWM speed control and direction reversing.',
    specifications: [
      { name: 'Driver IC', value: 'L298N Dual H-Bridge Driver IC' },
      { name: 'Drive Voltage', value: '5V – 35V DC' },
      { name: 'Peak Current', value: '2A per bridge' },
      { name: 'Logic Voltage', value: '5V (onboard regulator enabled when Vms > 7V)' },
      { name: 'Control Signals', value: 'IN1, IN2, IN3, IN4, ENA, ENB' }
    ],
    datasheetUrl: 'https://www.st.com/resource/en/datasheet/l298.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 185 },
      { minQty: 10, discountPercent: 10, unitPrice: 166 },
      { minQty: 50, discountPercent: 20, unitPrice: 148 }
    ],
    tags: ['Motor Driver', 'H-Bridge', 'L298N', 'Robotics', 'Stepper Driver'],
    locationBin: 'BIN-E-01-2',
    isBestSeller: true,
    voltage: '5V - 35V'
  },
  {
    id: 'prod-008',
    sku: 'SER-SG90-MICRO-9G',
    name: 'TowerPro SG90 9g Micro Servo Motor 180° for RC & Robotics',
    brand: 'TowerPro Genuine',
    category: 'Motors',
    subcategory: 'Servo Motors',
    price: 110,
    originalPrice: 160,
    inStock: true,
    stockCount: 280,
    minOrderQty: 1,
    rating: 4.5,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Ultra lightweight 9g nylon geared servo with 1.8 kg-cm stall torque @ 4.8V and 3-pin standard JR connector.',
    description: 'Includes a complete set of 3 horn arms and mounting screws. Perfect for pan-tilt camera mounts, robot arms, RC airplanes, and Arduino sensor sweep mechanisms.',
    specifications: [
      { name: 'Operating Voltage', value: '4.8V – 6.0V DC' },
      { name: 'Stall Torque', value: '1.8 kgf·cm (4.8V), 2.0 kgf·cm (6.0V)' },
      { name: 'Operating Speed', value: '0.12 sec / 60 degrees (4.8V)' },
      { name: 'Rotation Angle', value: '180 Degrees' },
      { name: 'Dead Band Width', value: '7 µs' },
      { name: 'Weight', value: '9 grams' }
    ],
    datasheetUrl: 'http://www.ee.ic.ac.uk/pcheung/teaching/DE1_EE/stores/sg90_datasheet.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 110 },
      { minQty: 10, discountPercent: 12, unitPrice: 96 },
      { minQty: 50, discountPercent: 22, unitPrice: 85 }
    ],
    tags: ['Servo', 'SG90', 'TowerPro', 'Actuator', 'Robotics'],
    locationBin: 'BIN-E-03-4',
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-009',
    sku: 'SEN-HC-SR04-ULTRA',
    name: 'HC-SR04 Ultrasonic Distance Sensor Module (2cm to 400cm Range)',
    brand: 'Waveshare Equivalent',
    category: 'Sensors',
    subcategory: 'Proximity Sensors',
    price: 85,
    originalPrice: 120,
    inStock: true,
    stockCount: 410,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Non-contact ultrasonic ranging module with 3mm precision, 40kHz transducer frequency, and standard Trigger/Echo interface.',
    description: 'Accurate ultrasonic distance detection ideal for obstacle avoiding robots, liquid level measurement, parking sensors, and automated entry alarms.',
    specifications: [
      { name: 'Working Voltage', value: '5V DC' },
      { name: 'Working Current', value: '15 mA' },
      { name: 'Frequency', value: '40 kHz' },
      { name: 'Ranging Distance', value: '2 cm – 400 cm (accuracy up to 3mm)' },
      { name: 'Measuring Angle', value: '15 Degrees' },
      { name: 'Trigger Signal', value: '10 µs TTL pulse' }
    ],
    datasheetUrl: 'https://www.electroschematics.com/wp-content/uploads/2013/07/HC-SR04-datasheet.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 85 },
      { minQty: 10, discountPercent: 12, unitPrice: 75 },
      { minQty: 50, discountPercent: 20, unitPrice: 68 }
    ],
    tags: ['Ultrasonic', 'HC-SR04', 'Proximity', 'Robotics', 'Arduino Sensor'],
    locationBin: 'BIN-C-02-1',
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-010',
    sku: 'DEV-RPI-PICO-2-RP2350',
    name: 'Raspberry Pi Pico 2 Microcontroller Board (RP2350 Dual Arm / RISC-V)',
    brand: 'Raspberry Pi Foundation',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 499,
    originalPrice: 650,
    inStock: true,
    stockCount: 150,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Dual Cortex-M33 or Dual Hazard3 RISC-V cores @ 150MHz with 520KB SRAM, 4MB QSPI Flash, and Arm TrustZone security.',
    description: 'The revolutionary second-generation silicon from Raspberry Pi. Features selectable dual Cortex-M33 cores or dual open-source RISC-V cores, robust hardware security architecture, and enhanced Programmable I/O (PIO) state machines.',
    specifications: [
      { name: 'Core Architecture', value: 'Dual Cortex-M33 OR Dual Hazard3 RISC-V @ 150MHz' },
      { name: 'Memory', value: '520 KB on-chip SRAM, 4 MB external QSPI Flash' },
      { name: 'PIO Blocks', value: '3 × PIO blocks (12 state machines total)' },
      { name: 'Security', value: 'Arm TrustZone-M, encrypted boot, 8KB OTP' },
      { name: 'GPIO', value: '26 × multi-function 3.3V GPIO pins (including 4 analog inputs)' }
    ],
    datasheetUrl: 'https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 499 },
      { minQty: 10, discountPercent: 8, unitPrice: 459 },
      { minQty: 50, discountPercent: 15, unitPrice: 424 }
    ],
    tags: ['Raspberry Pi Pico', 'RP2350', 'RISC-V', 'Arm Cortex-M33', 'PIO'],
    locationBin: 'BIN-A-03-2',
    isNew: true,
    isFeatured: true,
    voltage: '3.3V'
  },
  {
    id: 'prod-011',
    sku: 'DIS-OLED-096-I2C-BLU',
    name: '0.96 inch 128x64 I2C OLED Display Module (SSD1306 Blue/Yellow)',
    brand: 'Adafruit Style',
    category: 'Displays',
    subcategory: 'Displays',
    price: 220,
    originalPrice: 320,
    inStock: true,
    stockCount: 140,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 135,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'High contrast self-luminous organic LED display with 4-pin I2C interface, SSD1306 driver IC, and 160° viewing angle.',
    description: 'Requires no backlight, providing ultra-low power consumption and crisp readable graphical output. Compatible with U8g2 and Adafruit_SSD1306 libraries.',
    specifications: [
      { name: 'Display Size', value: '0.96 inch diagonal' },
      { name: 'Resolution', value: '128 × 64 pixels' },
      { name: 'Driver IC', value: 'SSD1306' },
      { name: 'Communication', value: 'I2C (Address 0x3C or 0x3D)' },
      { name: 'Operating Voltage', value: '3.3V – 5.0V DC' },
      { name: 'Current Consumption', value: '~0.04W during full screen illumination' }
    ],
    datasheetUrl: 'https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 220 },
      { minQty: 10, discountPercent: 10, unitPrice: 198 },
      { minQty: 50, discountPercent: 18, unitPrice: 180 }
    ],
    tags: ['OLED', 'SSD1306', 'Display', 'I2C', '128x64', 'Arduino'],
    locationBin: 'BIN-F-01-1',
    isBestSeller: true,
    voltage: '3.3V / 5V',
    protocol: 'I2C'
  },
  {
    id: 'prod-012',
    sku: 'PWR-TP4056-USBC-PROT',
    name: 'TP4056 1A Li-Ion Lithium Battery Charger Module with Type-C & Protection',
    brand: 'TopPower Electronics',
    category: 'Batteries and Power Supply',
    subcategory: 'Charging Modules',
    price: 32,
    originalPrice: 50,
    inStock: true,
    stockCount: 650,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Constant-current/constant-voltage 1A single-cell lithium charger with DW01A protection IC and Type-C USB port.',
    description: 'The ultimate portable power tool for makers building battery-powered projects. Protects cells from over-discharge (<2.5V), over-charge (>4.2V), and over-current.',
    specifications: [
      { name: 'Input Interface', value: 'Type-C USB female or solder pads' },
      { name: 'Input Voltage', value: '4.5V – 5.5V' },
      { name: 'Charge Cut-off Voltage', value: '4.2V ± 1%' },
      { name: 'Max Charge Current', value: '1000 mA (programmable via Rprog)' },
      { name: 'Protection ICs', value: 'DW01A Battery Protection + FS8205A Dual MOSFET' }
    ],
    datasheetUrl: 'https://dlnmh9ip6v2uc.cloudfront.net/datasheets/Prototyping/TP4056.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 32 },
      { minQty: 10, discountPercent: 15, unitPrice: 27 },
      { minQty: 50, discountPercent: 25, unitPrice: 24 },
      { minQty: 100, discountPercent: 35, unitPrice: 20 }
    ],
    tags: ['TP4056', 'Type-C', 'Battery Charger', 'Li-Ion', '18650', 'BMS'],
    locationBin: 'BIN-D-01-5',
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-013',
    sku: 'CMP-RES-ASSORT-600PCS',
    name: '1/4W Metal Film Resistor Assortment Kit (30 Values × 20 Pcs = 600 Pcs 1%)',
    brand: 'Royal Ohm Standard',
    category: 'Electronic Components',
    subcategory: 'Resistors',
    price: 260,
    originalPrice: 380,
    inStock: true,
    stockCount: 180,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'High precision 1% tolerance metal film resistors from 10Ω to 1MΩ, individually labeled in tape strips.',
    description: 'Essential lab kit for every electronics workstation and student lab. Includes standard values like 10Ω, 100Ω, 220Ω, 330Ω, 1kΩ, 4.7kΩ, 10kΩ, 47kΩ, 100kΩ, 1MΩ with excellent noise suppression and low temperature coefficient.',
    specifications: [
      { name: 'Power Rating', value: '0.25 Watt (1/4 W)' },
      { name: 'Tolerance', value: '± 1% (5-band color code)' },
      { name: 'Operating Voltage', value: '250V Max' },
      { name: 'Values Included', value: '30 values from 10 Ohm to 1 Megaohm' },
      { name: 'Quantity', value: '600 Pieces (20 pcs per value)' }
    ],
    datasheetUrl: 'https://example.com/datasheets/metal-film-resistors.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 260 },
      { minQty: 5, discountPercent: 10, unitPrice: 234 },
      { minQty: 20, discountPercent: 20, unitPrice: 208 }
    ],
    tags: ['Resistors', 'Metal Film', 'Kit', 'Components', 'Assortment'],
    locationBin: 'BIN-G-02-1',
    isFeatured: false,
    voltage: 'Passive'
  },
  {
    id: 'prod-014',
    sku: 'WIR-BREADBOARD-BUNDLE',
    name: 'MB-102 830-Point Solderless Breadboard + 65 Pcs Flexible Jumper Wires',
    brand: 'SEMIX LABS MakerLab',
    category: 'Cables and Connectors',
    subcategory: 'Prototyping Accessories',
    price: 195,
    originalPrice: 280,
    inStock: true,
    stockCount: 220,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 164,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Full-size 830 tie-points breadboard with self-adhesive backing and color-coded power distribution rails plus male-to-male wires.',
    description: 'Durable nickel-plated spring phosphor bronze contact clips for tight, reliable pin retention. Comes with 65 assorted length flexible jumper wires with molded pins.',
    specifications: [
      { name: 'Tie Points', value: '830 (630 in circuit area, 200 in 4 power buses)' },
      { name: 'Pitch', value: 'Standard 2.54 mm (0.1 inch)' },
      { name: 'Wire Gauge Compatibility', value: '20 to 29 AWG' },
      { name: 'Jumper Wire Count', value: '65 Pieces multi-color' }
    ],
    datasheetUrl: 'https://example.com/datasheets/mb102-breadboard.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 195 },
      { minQty: 10, discountPercent: 12, unitPrice: 171 },
      { minQty: 50, discountPercent: 22, unitPrice: 152 }
    ],
    tags: ['Breadboard', 'MB102', 'Jumper Wires', 'Prototyping', 'Cables'],
    locationBin: 'BIN-G-01-3',
    isBestSeller: true,
    voltage: 'Passive'
  },
  {
    id: 'prod-015',
    sku: 'MOT-N20-GEAR-6V-300',
    name: 'N20 Micro Metal Gear Motor 6V 300RPM with High Torque All-Metal Gearbox',
    brand: 'GA12-N20 Motors',
    category: 'Motors',
    subcategory: 'DC Gear Motors',
    price: 240,
    originalPrice: 340,
    inStock: true,
    stockCount: 88,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 82,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Precision miniature all-metal gear motor with D-shaped 3mm output shaft, ideal for line followers and micro robots.',
    description: 'Precision brass and steel gear reduction train delivering substantial stall torque in a sub-miniature form factor. Smooth low-friction carbon brush commutation.',
    specifications: [
      { name: 'Rated Voltage', value: '6V DC (Operating range 3V - 9V)' },
      { name: 'No-load Speed', value: '300 RPM @ 6V' },
      { name: 'Stall Torque', value: '0.8 kg·cm' },
      { name: 'Shaft Diameter', value: '3 mm D-Shaft (length 10 mm)' },
      { name: 'Total Weight', value: '14 grams' }
    ],
    datasheetUrl: 'https://example.com/datasheets/n20-gear-motor.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 240 },
      { minQty: 10, discountPercent: 10, unitPrice: 216 },
      { minQty: 50, discountPercent: 20, unitPrice: 192 }
    ],
    tags: ['N20', 'Motor', 'Micro Gearbox', 'Robotics', 'Line Follower'],
    locationBin: 'BIN-E-04-1',
    isNew: false,
    voltage: '6V'
  },
  {
    id: 'prod-016',
    sku: 'DRN-BLDC-2212-1400KV',
    name: 'A2212 1400KV Brushless Outrunner DC Motor for Quadcopters & Fixed Wings',
    brand: 'EMAX / Readytosky',
    category: 'Motors',
    subcategory: 'BLDC Motors',
    price: 520,
    originalPrice: 699,
    inStock: true,
    stockCount: 75,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 118,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'High-efficiency 1400KV brushless motor with bullet prop adapter, motor mount and pre-soldered 3.5mm gold banana connectors.',
    description: 'Pairs perfectly with 30A ESC and 8045 or 9050 propellers running on 2S-3S LiPo battery packs. Dynamic balance calibrated for vibration-free flight.',
    specifications: [
      { name: 'KV Rating', value: '1400 RPM / Volt' },
      { name: 'Battery Compatibility', value: '2S – 3S LiPo (7.4V – 11.1V)' },
      { name: 'Max Current', value: '16A / 60 seconds' },
      { name: 'Shaft Diameter', value: '3.17 mm' },
      { name: 'Recommended ESC', value: '30A ESC' }
    ],
    datasheetUrl: 'https://example.com/datasheets/a2212-motor-spec.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 520 },
      { minQty: 4, discountPercent: 8, unitPrice: 478 },
      { minQty: 16, discountPercent: 15, unitPrice: 442 }
    ],
    tags: ['BLDC', 'A2212', 'Drone Motor', 'Brushless', 'Quadcopter'],
    locationBin: 'BIN-H-01-2',
    isFeatured: true,
    voltage: '11.1V'
  },
  {
    id: 'prod-017',
    sku: 'SMD-BOOK-0805-RES-8500',
    name: '0805 SMD Resistor Sample Book (170 Values × 50 Pcs = 8,500 Pcs 1%)',
    brand: 'SEMIX LABS Pro',
    category: 'SMD Sample Books and Kits',
    subcategory: 'Resistor Sample Books',
    price: 1850,
    originalPrice: 2400,
    inStock: true,
    stockCount: 45,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Comprehensive binder with 170 standard E24/E96 SMD 0805 resistor values from 0Ω to 10MΩ, clearly labeled for R&D engineers.',
    description: 'Compact, high quality leatherette ring binder designed for electronics labs, prototyping benches, and hardware startups. Each page holds peel-back tape strips clearly labeled with resistance values and EIA codes.',
    specifications: [
      { name: 'Package', value: 'SMD 0805 (2012 Metric)' },
      { name: 'Tolerance', value: '± 1%' },
      { name: 'Power Rating', value: '1/8W (0.125W)' },
      { name: 'Values Included', value: '170 distinct values (0 Ohm to 10 Megaohm)' },
      { name: 'Total Quantity', value: '8,500 pieces (50 pcs per value)' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 1850 },
      { minQty: 3, discountPercent: 8, unitPrice: 1702 },
      { minQty: 10, discountPercent: 15, unitPrice: 1572 }
    ],
    tags: ['SMD Book', 'Resistors', '0805', 'Sample Book', 'Lab Kit'],
    locationBin: 'BIN-K-01-1',
    isNew: true,
    isFeatured: true,
    voltage: 'Passive'
  },
  {
    id: 'prod-018',
    sku: 'SMD-BOOK-0603-CAP-4500',
    name: '0603 SMD Ceramic Capacitor Sample Book (90 Values × 50 Pcs = 4,500 Pcs)',
    brand: 'SEMIX LABS Pro',
    category: 'SMD Sample Books and Kits',
    subcategory: 'Capacitor Sample Books',
    price: 2150,
    originalPrice: 2800,
    inStock: true,
    stockCount: 38,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Multi-layer MLCC ceramic capacitors in 0603 footprint covering 0.5pF to 10µF, organized in a protective enclosure.',
    description: 'Never pause your PCB assembly again waiting for bypass and decoupling caps. Features dielectric compositions (NPO/C0G, X7R, X5R) rated for standard 50V and 25V applications.',
    specifications: [
      { name: 'Package', value: 'SMD 0603 (1608 Metric)' },
      { name: 'Capacitance Range', value: '0.5 pF to 10 µF' },
      { name: 'Dielectrics', value: 'C0G/NPO, X7R, X5R' },
      { name: 'Values Count', value: '90 values' },
      { name: 'Total Quantity', value: '4,500 pieces' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2150 },
      { minQty: 3, discountPercent: 6, unitPrice: 2021 },
      { minQty: 10, discountPercent: 12, unitPrice: 1892 }
    ],
    tags: ['SMD Book', 'Capacitors', '0603', 'MLCC', 'Binder'],
    locationBin: 'BIN-K-01-2',
    isNew: true,
    voltage: 'Passive'
  },
  {
    id: 'prod-019',
    sku: 'TLS-T12-SOLD-STN-72W',
    name: 'T12 Portable Digital OLED Soldering Station (72W Quick Heating PID)',
    brand: 'QuickHeat Pro',
    category: 'Hardware and Tools',
    subcategory: 'Soldering Equipment',
    price: 2650,
    originalPrice: 3499,
    inStock: true,
    stockCount: 55,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: '72W intelligent temperature-controlled soldering station reaching 300°C in under 8 seconds with auto-sleep and OLED display.',
    description: 'Compatible with all Hakko T12 integrated heating cartridge tips. Uses STC microcontroller PID temperature regulation accurate to within ±2°C. Powered by 12V-24V DC or USB-PD adapter.',
    specifications: [
      { name: 'Power Output', value: '72W Max (at 24V DC input)' },
      { name: 'Temp Range', value: '150°C to 480°C' },
      { name: 'Display', value: '0.96 inch High Contrast Monochrome OLED' },
      { name: 'Tip Included', value: 'T12-K knife blade tip' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2650 },
      { minQty: 5, discountPercent: 10, unitPrice: 2385 },
      { minQty: 20, discountPercent: 18, unitPrice: 2173 }
    ],
    tags: ['Soldering Iron', 'T12', 'OLED', 'Hardware Tool', 'PCB Repair'],
    locationBin: 'BIN-T-02-1',
    isNew: true,
    isFeatured: true,
    voltage: '12V - 24V'
  },
  {
    id: 'prod-020',
    sku: 'TLS-ESD-TWEEZER-SET6',
    name: 'Precision Anti-Static ESD Tweezers & Wire Stripper Tool Set (6-Piece)',
    brand: 'Vetus Precision',
    category: 'Hardware and Tools',
    subcategory: 'Hand Tools',
    price: 480,
    originalPrice: 650,
    inStock: true,
    stockCount: 140,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Non-magnetic anti-acid stainless steel tweezers with conductive ESD coating and auto-adjusting wire stripper.',
    description: 'Precision tips for placing 0402, 0603, and QFN silicon chips without electrostatic discharge hazards. Includes straight fine tip, curved eagle beak, flat tip, and wire cutter.',
    specifications: [
      { name: 'Material', value: 'High grade anti-magnetic stainless steel' },
      { name: 'Surface Coating', value: 'Electrostatic Dissipative (ESD) matte black' },
      { name: 'Pieces Included', value: '5x tweezers (ESD-10 to ESD-15) + 1x stripper' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 480 },
      { minQty: 5, discountPercent: 12, unitPrice: 422 },
      { minQty: 25, discountPercent: 20, unitPrice: 384 }
    ],
    tags: ['Tweezers', 'ESD', 'Tools', 'SMD Assembly', 'Prototyping'],
    locationBin: 'BIN-T-01-3',
    voltage: 'Passive'
  },
  {
    id: 'prod-021',
    sku: 'DIS-LCD-1602-I2C-BLU',
    name: '16x2 Character LCD Display Module with I2C Backpack (HD44780 Blue)',
    brand: 'DisplayTech Standard',
    category: 'Displays',
    subcategory: 'Alphanumeric LCDs',
    price: 240,
    originalPrice: 350,
    inStock: true,
    stockCount: 185,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 160,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Classic 16 characters by 2 lines alphanumeric LCD with pre-soldered PCF8574 I2C adapter saving 14 microcontroller pins.',
    description: 'Ideal for IoT status monitors, temperature meters, and menu selection interfaces. Contrast adjustment trimpot and backlight jumper included on the backpack PCB.',
    specifications: [
      { name: 'Characters', value: '16 columns × 2 rows' },
      { name: 'Interface', value: 'I2C (Address default 0x27 or 0x3F)' },
      { name: 'Supply Voltage', value: '5V DC' },
      { name: 'Backlight', value: 'White text on blue LED backlight' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 240 },
      { minQty: 10, discountPercent: 10, unitPrice: 216 },
      { minQty: 50, discountPercent: 20, unitPrice: 192 }
    ],
    tags: ['LCD', '1602', 'I2C Display', 'HD44780', 'Arduino'],
    locationBin: 'BIN-F-02-3',
    voltage: '5V',
    protocol: 'I2C'
  },
  {
    id: 'prod-022',
    sku: 'ROB-CHASSIS-4WD-SMART',
    name: '4WD Smart Robot Car Chassis Platform Kit with Speed Encoders & Dual Deck',
    brand: 'RoboCraze Pro',
    category: 'Robotics and DIY Kits',
    subcategory: 'Robot Chassis Kits',
    price: 780,
    originalPrice: 1100,
    inStock: true,
    stockCount: 62,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Dual-deck transparent acrylic chassis with 4x TT gear motors, rubber tires, optical speed encoder discs, and 4xAA battery box.',
    description: 'The definitive foundation for building self-driving obstacle avoiders, line tracers, and BLE/WiFi controlled rovers. Pre-drilled mounting holes for Arduino, Raspberry Pi, sensors, and motor shields.',
    specifications: [
      { name: 'Motors', value: '4 × 1:48 TT Gear Motors (3V - 6V DC)' },
      { name: 'Tires', value: '65mm diameter high grip rubber tires' },
      { name: 'Chassis Material', value: 'Laser cut transparent acrylic plates' },
      { name: 'Encoders', value: '4 × 20-slot optical code discs' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 780 },
      { minQty: 5, discountPercent: 8, unitPrice: 717 },
      { minQty: 20, discountPercent: 16, unitPrice: 655 }
    ],
    tags: ['Robot Chassis', '4WD', 'DIY Kit', 'STEM', 'TT Motor'],
    locationBin: 'BIN-R-01-2',
    isNew: true,
    isFeatured: true,
    voltage: '4.5V - 6V'
  },
  {
    id: 'prod-023',
    sku: 'ROB-ARM-4DOF-ACRYLIC',
    name: '4-Axis Acrylic Robotic Arm Prototyping Kit with 4x SG90 Servos',
    brand: 'RoboCraze Pro',
    category: 'Robotics and DIY Kits',
    subcategory: 'Robotic Arms',
    price: 980,
    originalPrice: 1350,
    inStock: true,
    stockCount: 40,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Desktop 4-Degrees of Freedom pick-and-place robot arm including laser-cut structural frames, hardware, and 4 micro servos.',
    description: 'Great for learning kinematics, inverse kinematics, servo PWM control, and automated sorting. Compatible with joystick shield or web dashboard control.',
    specifications: [
      { name: 'Degrees of Freedom', value: '4-Axis (Base, Shoulder, Elbow, Gripper)' },
      { name: 'Servos Included', value: '4 × SG90 9g metal/nylon gear servos' },
      { name: 'Max Reach', value: 'Approximately 200 mm' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 980 },
      { minQty: 4, discountPercent: 10, unitPrice: 882 },
      { minQty: 12, discountPercent: 18, unitPrice: 803 }
    ],
    tags: ['Robot Arm', '4DOF', 'Servo Kit', 'STEM Kit', 'Robotics'],
    locationBin: 'BIN-R-02-1',
    voltage: '5V'
  },
  {
    id: 'prod-024',
    sku: 'PHY-RHEOSTAT-50R-15A',
    name: 'Precision Slide Wire Rheostat (50 Ohm 1.5A Lab Physics Demonstrator)',
    brand: 'National Scientific Instruments',
    category: 'Physics Instruments',
    subcategory: 'Electromagnetism',
    price: 680,
    originalPrice: 890,
    inStock: true,
    stockCount: 30,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Constantan wire wound on porcelain tube with sliding phosphor bronze contact brush and 4mm binding posts.',
    description: 'Designed for physics laboratory education to study Ohm’s law, Wheatstone bridges, and current regulation. High thermal endurance and smooth resistance sweep.',
    specifications: [
      { name: 'Resistance', value: '50 Ohms ± 10%' },
      { name: 'Max Current', value: '1.5 Amperes continuous' },
      { name: 'Terminals', value: '3 × standard 4mm brass binding posts' },
      { name: 'Insulation', value: 'Vitreous enameled steel tube' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 680 },
      { minQty: 5, discountPercent: 10, unitPrice: 612 },
      { minQty: 20, discountPercent: 20, unitPrice: 544 }
    ],
    tags: ['Physics Instrument', 'Rheostat', 'Laboratory', 'Ohm Law', 'Education'],
    locationBin: 'BIN-P-01-1',
    isNew: true,
    voltage: 'Passive'
  },
  {
    id: 'prod-025',
    sku: 'PHY-PRISM-OPTICAL-60MM',
    name: 'Equilateral Optical Glass Dispersion Prism (60x60x60mm Optical Bench)',
    brand: 'OptoLab Scientific',
    category: 'Physics Instruments',
    subcategory: 'Optics',
    price: 320,
    originalPrice: 450,
    inStock: true,
    stockCount: 50,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 32,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'K9 optical grade crystal glass triangular prism delivering high light dispersion and spectrum separation.',
    description: 'High-precision polished optical surfaces for refraction demonstrations, spectrometer alignment, and physics light spectrum experiments.',
    specifications: [
      { name: 'Material', value: 'K9 High-Transmission Optical Glass' },
      { name: 'Angle', value: 'Equilateral 60° × 60° × 60°' },
      { name: 'Length', value: '60 mm' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 320 },
      { minQty: 5, discountPercent: 10, unitPrice: 288 },
      { minQty: 20, discountPercent: 20, unitPrice: 256 }
    ],
    tags: ['Prism', 'Optics', 'Physics Instrument', 'Refraction', 'K9 Glass'],
    locationBin: 'BIN-P-02-4',
    voltage: 'Passive'
  },
  {
    id: 'prod-026',
    sku: 'SMD-AMS1117-33-TAPE25',
    name: 'AMS1117-3.3V SOT-223 Low Dropout Linear Voltage Regulator (Tape of 25)',
    brand: 'Advanced Monolithic Systems',
    category: 'SMD Components',
    subcategory: 'Voltage Regulators',
    price: 95,
    originalPrice: 150,
    inStock: true,
    stockCount: 800,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Fixed 3.3V 1A output LDO in compact SOT-223 surface mount package with built-in thermal overload and short-circuit protection.',
    description: 'Standard workhorse power IC across thousands of IoT boards, ESP32 modules, and embedded peripherals. Dropout voltage under 1.1V at full load.',
    specifications: [
      { name: 'Output Voltage', value: '3.3V Fixed (± 1%)' },
      { name: 'Max Current', value: '1.0 Ampere' },
      { name: 'Input Voltage', value: '4.5V to 15V' },
      { name: 'Package', value: 'SOT-223 SMD' },
      { name: 'Quantity', value: '25 Pieces cut tape' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 95 },
      { minQty: 5, discountPercent: 15, unitPrice: 80 },
      { minQty: 20, discountPercent: 30, unitPrice: 66 }
    ],
    tags: ['AMS1117', 'SOT-223', 'SMD IC', 'LDO', 'Voltage Regulator'],
    locationBin: 'BIN-S-01-1',
    isBestSeller: true,
    voltage: '3.3V Out'
  },
  {
    id: 'prod-027',
    sku: 'SMD-RES-0805-10K-REEL',
    name: '0805 SMD 10k Ohm 1% Precision Chip Resistors (5,000 Pcs Full Reel)',
    brand: 'Yageo Corp',
    category: 'SMD Components',
    subcategory: 'Chip Resistors',
    price: 340,
    originalPrice: 480,
    inStock: true,
    stockCount: 120,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Standard 7-inch pick-and-place reel of 5000 pcs 0805 10kΩ resistors for automatic SMD line placement and lab restocking.',
    description: 'High reliability thick film chip resistors with nickel barrier termination. Ideal for pull-up and pull-down configurations in modern microelectronics.',
    specifications: [
      { name: 'Resistance', value: '10,000 Ohms (10k)' },
      { name: 'Tolerance', value: '± 1%' },
      { name: 'Power Rating', value: '0.125W (1/8W)' },
      { name: 'Package', value: '0805 (2012 Metric) Reel' },
      { name: 'Quantity', value: '5,000 Pieces' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 340 },
      { minQty: 2, discountPercent: 8, unitPrice: 312 },
      { minQty: 5, discountPercent: 15, unitPrice: 289 }
    ],
    tags: ['0805', '10k', 'Resistor Reel', 'SMD Component', 'Pick and Place'],
    locationBin: 'BIN-S-02-4',
    isBestSeller: true,
    voltage: 'Passive'
  },
  {
    id: 'prod-028',
    sku: 'ARD-UNO-R3-DIP',
    name: 'Arduino Uno R3 DIP Microcontroller Board (ATmega328P 16MHz)',
    brand: 'Arduino Official',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 1850,
    originalPrice: 2200,
    inStock: true,
    stockCount: 175,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'The classic Arduino development board based on the ATmega328P 8-bit AVR MCU with removable DIP chip.',
    description: 'The golden standard microcontroller board for makers, educators, and engineers worldwide. Features 14 digital input/output pins (6 PWM), 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header, and a reset button.',
    specifications: [
      { name: 'Microcontroller', value: 'Microchip ATmega328P 8-bit AVR RISC' },
      { name: 'Operating Voltage', value: '5V DC (5 volt)' },
      { name: 'Input Voltage (recommended)', value: '7-12V DC via barrel jack' },
      { name: 'Clock Speed', value: '16 MHz' },
      { name: 'Digital I/O Pins', value: '14 (6 provide PWM output)' },
      { name: 'Analog Input Pins', value: '6' },
      { name: 'Flash Memory', value: '32 KB (ATmega328P) of which 0.5 KB used by bootloader' },
      { name: 'SRAM / EEPROM', value: '2 KB SRAM / 1 KB EEPROM' }
    ],
    datasheetUrl: 'https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 1850 },
      { minQty: 5, discountPercent: 5, unitPrice: 1757 },
      { minQty: 20, discountPercent: 12, unitPrice: 1628 }
    ],
    tags: ['Arduino', 'Arduino Uno', 'Uno R3', 'ATmega328P', 'Microcontroller', 'MCU', 'Development Board', 'AVR'],
    locationBin: 'BIN-A-02-2',
    isBestSeller: true,
    isFeatured: true,
    voltage: '5V'
  },
  {
    id: 'prod-029',
    sku: 'ARD-NANO-V3-CH340',
    name: 'Arduino Nano V3.0 Microcontroller Board (ATmega328P 5V Type-C)',
    brand: 'Arduino Compatible',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 320,
    originalPrice: 450,
    inStock: true,
    stockCount: 260,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Ultra-compact breadboard-friendly ATmega328P development board with modern Type-C USB interface.',
    description: 'Breadboard-ready compact version of the Arduino Uno. Delivers identical ATmega328P processing power, 8 analog pins (2 more than Uno), and convenient pin header layout for fast prototyping.',
    specifications: [
      { name: 'Microcontroller', value: 'Microchip ATmega328P' },
      { name: 'Operating Voltage', value: '5V DC' },
      { name: 'USB Interface', value: 'USB Type-C with CH340G USB-UART driver' },
      { name: 'Clock Speed', value: '16 MHz' },
      { name: 'Analog Input Pins', value: '8 (A0 to A7)' },
      { name: 'Digital I/O Pins', value: '14 (6 PWM outputs)' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 320 },
      { minQty: 10, discountPercent: 10, unitPrice: 288 },
      { minQty: 50, discountPercent: 20, unitPrice: 256 }
    ],
    tags: ['Arduino', 'Arduino Nano', 'Nano', 'ATmega328P', 'Microcontroller', 'MCU', 'Dev Board'],
    locationBin: 'BIN-A-02-4',
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-030',
    sku: 'ARD-MEGA-2560-R3',
    name: 'Arduino Mega 2560 R3 Microcontroller Board (ATmega2560 54 I/O Pins)',
    brand: 'Arduino Official',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 2950,
    originalPrice: 3499,
    inStock: true,
    stockCount: 85,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'High-pinout microcontroller board with 54 digital I/O pins, 16 analog inputs, and 4 hardware UART serial ports.',
    description: 'Designed for high complexity 3D printers, CNC systems, robotics, and extensive sensor arrays. Features 256 KB flash memory and 8 KB SRAM.',
    specifications: [
      { name: 'Microcontroller', value: 'ATmega2560 AVR' },
      { name: 'Operating Voltage', value: '5V' },
      { name: 'Digital I/O Pins', value: '54 (15 provide PWM)' },
      { name: 'Analog Input Pins', value: '16' },
      { name: 'Hardware Serial UARTs', value: '4 UART ports' },
      { name: 'Flash Memory', value: '256 KB' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2950 },
      { minQty: 5, discountPercent: 6, unitPrice: 2773 },
      { minQty: 20, discountPercent: 12, unitPrice: 2596 }
    ],
    tags: ['Arduino', 'Arduino Mega', 'Mega 2560', 'ATmega2560', 'Microcontroller', 'MCU', '3D Printer Controller'],
    locationBin: 'BIN-A-02-5',
    isFeatured: true,
    voltage: '5V'
  },
  {
    id: 'prod-031',
    sku: 'STM-STM32F401-BLACKPILL',
    name: 'STM32F401 Black Pill Development Board (ARM Cortex-M4 32-bit 84MHz)',
    brand: 'STMicroelectronics Core',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 460,
    originalPrice: 620,
    inStock: true,
    stockCount: 110,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'High-performance 32-bit ARM Cortex-M4 @ 84MHz with FPU, 256KB Flash, 64KB SRAM, and Type-C USB interface.',
    description: 'The STM32F401CCU6 Black Pill delivers intense 32-bit computing horsepower with hardware floating point unit (FPU), full DSP instructions, and USB-C connectivity. Fully programmable via STM32CubeIDE, Arduino IDE, or MicroPython.',
    specifications: [
      { name: 'Core Architecture', value: '32-bit ARM Cortex-M4 with single-precision FPU' },
      { name: 'Clock Speed', value: '84 MHz (105 DMIPS)' },
      { name: 'Flash Memory', value: '256 KB Flash, 64 KB SRAM' },
      { name: 'Operating Voltage', value: '3.3V Logic (5V tolerant pins)' },
      { name: 'Peripherals', value: 'USB 2.0 OTG, 3x I2C, 4x SPI, 3x USART, 12-bit ADC' }
    ],
    datasheetUrl: 'https://www.st.com/resource/en/datasheet/stm32f401cb.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 460 },
      { minQty: 10, discountPercent: 10, unitPrice: 414 },
      { minQty: 50, discountPercent: 18, unitPrice: 377 }
    ],
    tags: ['STM32', 'STM32F4', 'STM32F401', 'Black Pill', 'ARM Cortex-M4', '32-Bit', '32-bit', '32bit', 'MCU', 'Microcontroller'],
    locationBin: 'BIN-B-02-1',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    voltage: '3.3V',
    protocol: 'I2C, SPI, UART, USB'
  },
  {
    id: 'prod-032',
    sku: 'STM-STM32F103-BLUEPILL',
    name: 'STM32F103C8T6 Blue Pill ARM Cortex-M3 32-bit Microcontroller Dev Board',
    brand: 'STMicroelectronics Core',
    category: 'Electronic Modules and Development Boards',
    subcategory: 'Microcontroller Boards',
    price: 290,
    originalPrice: 420,
    inStock: true,
    stockCount: 165,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Popular entry-level 32-bit ARM Cortex-M3 microcontroller @ 72MHz with 64KB Flash and SWD debug port.',
    description: 'The ultra-budget 32-bit standard microcontroller board. Delivers 72MHz performance, dual I2C, triple SPI, and CAN bus capability in an ultra compact form factor.',
    specifications: [
      { name: 'Core Architecture', value: '32-bit ARM Cortex-M3 @ 72 MHz' },
      { name: 'Flash Memory', value: '64 KB Flash, 20 KB SRAM' },
      { name: 'Operating Voltage', value: '2.0V - 3.6V (3.3V recommended)' },
      { name: 'I/O Pins', value: '37 GPIO pins' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 290 },
      { minQty: 10, discountPercent: 12, unitPrice: 255 },
      { minQty: 50, discountPercent: 22, unitPrice: 226 }
    ],
    tags: ['STM32', 'Blue Pill', 'STM32F103', 'ARM Cortex-M3', '32-Bit', '32-bit', 'MCU', 'Microcontroller'],
    locationBin: 'BIN-B-02-2',
    isBestSeller: true,
    voltage: '3.3V'
  },
  {
    id: 'prod-033',
    sku: 'REL-5V-1CH-OPTO-MOD',
    name: '5V 1-Channel Relay Module with Optocoupler Isolation (High/Low Level Trigger)',
    brand: 'Songle Electronic',
    category: 'Electronic Components',
    subcategory: 'Relays',
    price: 75,
    originalPrice: 110,
    inStock: true,
    stockCount: 310,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 240,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Songle 5V DC relay module with optical isolation and selectable high or low level trigger jumper.',
    description: 'Safely switch high voltage AC mains or DC loads from 5V Arduino, ESP32, or Raspberry Pi microcontrollers. Features genuine Songle SRD-05VDC-SL-C relay with LED indicator for relay state and power.',
    specifications: [
      { name: 'Operating Voltage', value: '5V DC (5 volt / 5V)' },
      { name: 'Relay Model', value: 'Songle SRD-05VDC-SL-C SPDT' },
      { name: 'Contact Rating', value: '10A 250VAC, 10A 30VDC' },
      { name: 'Trigger Current', value: '5 mA' },
      { name: 'Trigger Mode', value: 'Jumper selectable High or Low Level Trigger' },
      { name: 'Isolation', value: 'Optocoupler optical isolation protect MCU' }
    ],
    datasheetUrl: 'https://example.com/datasheets/srd-05vdc-relay.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 75 },
      { minQty: 10, discountPercent: 12, unitPrice: 66 },
      { minQty: 50, discountPercent: 22, unitPrice: 58 }
    ],
    tags: ['Relay', '5V Relay', '5V DC Relay', '5V Relay Module', '5V SPDT Relay', 'Optocoupler', 'Automation', 'Switch'],
    locationBin: 'BIN-C-01-4',
    isBestSeller: true,
    voltage: '5V'
  },
  {
    id: 'prod-034',
    sku: 'REL-5V-4CH-OPTO-BOARD',
    name: '5V 4-Channel Relay Module Board with Optocoupler Isolation',
    brand: 'Songle Electronic',
    category: 'Electronic Components',
    subcategory: 'Relays',
    price: 245,
    originalPrice: 350,
    inStock: true,
    stockCount: 140,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Quad 4-channel 5V SPDT relay board with separate LED indicators and screw terminals for home automation.',
    description: 'Control up to 4 independent AC or DC appliances. Designed for Arduino, Raspberry Pi, ESP8266, and IoT smart home controllers.',
    specifications: [
      { name: 'Operating Voltage', value: '5V DC (5 volt)' },
      { name: 'Channels', value: '4 independent SPDT channels' },
      { name: 'Switching Capacity', value: '10A 250VAC / 10A 125VAC / 10A 30VDC' },
      { name: 'Isolation', value: '4x PC817 Optocouplers' }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 245 },
      { minQty: 5, discountPercent: 10, unitPrice: 220 },
      { minQty: 20, discountPercent: 20, unitPrice: 196 }
    ],
    tags: ['Relay', '5V Relay', '4-Channel Relay', '5V DC Relay', 'Relay Module', 'Home Automation'],
    locationBin: 'BIN-C-01-5',
    isFeatured: true,
    voltage: '5V'
  },
  {
    id: 'prod-035',
    sku: 'AUD-SPK-8OHM-05W-40MM',
    name: '8 Ohm 0.5W Micro Mylar Speaker (40mm Dia, 8Ω / 8-Ohm Mini Audio Speaker)',
    brand: 'CUI Devices Standard',
    category: 'Electronic Components',
    subcategory: 'Audio Components',
    price: 45,
    originalPrice: 70,
    inStock: true,
    stockCount: 220,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Clear acoustic 8 Ohm 0.5 Watt round miniature mylar cone speaker with solder tabs.',
    description: 'Compact 40mm 8Ω speaker ideal for intercoms, talking clocks, Arduino sound generators, synthesized speech, audio amplifier testing, and STEM robotics audio feedback.',
    specifications: [
      { name: 'Impedance', value: '8 Ohm (8Ω, 8-ohm, 8 Ohms ± 15% at 1kHz)' },
      { name: 'Rated Power', value: '0.5 Watt (0.5W)' },
      { name: 'Maximum Power', value: '1.0 Watt' },
      { name: 'Frequency Response', value: '350 Hz – 10 kHz' },
      { name: 'Diameter / Thickness', value: '40 mm diameter × 5 mm thickness' }
    ],
    datasheetUrl: 'https://example.com/datasheets/8ohm-speaker.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 45 },
      { minQty: 10, discountPercent: 12, unitPrice: 39 },
      { minQty: 50, discountPercent: 25, unitPrice: 33 }
    ],
    tags: ['Speaker', '8 Ohm', '8Ω', '8-ohm', '8 Ohms', '8ohm', 'Audio', 'Sound', 'Mini Speaker'],
    locationBin: 'BIN-G-03-2',
    isBestSeller: true,
    voltage: 'Passive'
  },
  {
    id: 'prod-036',
    sku: 'SEN-DHT22-AM2302-TEMP',
    name: 'DHT22 / AM2302 High Precision Digital Temperature & Humidity Sensor Module',
    brand: 'Aosong Electronics',
    category: 'Sensors',
    subcategory: 'Environmental Sensors',
    price: 240,
    originalPrice: 320,
    inStock: true,
    stockCount: 155,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Calibrated digital temperature sensor and humidity sensor with single-bus digital signal output.',
    description: 'High reliability temperature sensor accurate within ±0.5°C over -40 to 80°C range. Built-in 8-bit MCU for capacitive humidity and thermistor temperature measurements.',
    specifications: [
      { name: 'Temperature Range', value: '-40°C to +80°C (±0.5°C accuracy)' },
      { name: 'Humidity Range', value: '0 to 100% RH (±2% RH accuracy)' },
      { name: 'Operating Voltage', value: '3.3V – 5.5V DC' },
      { name: 'Sampling Period', value: '2 seconds per reading' },
      { name: 'Interface', value: 'Single-bus digital signal' }
    ],
    datasheetUrl: 'https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 240 },
      { minQty: 10, discountPercent: 10, unitPrice: 216 },
      { minQty: 50, discountPercent: 20, unitPrice: 192 }
    ],
    tags: ['Temperature Sensor', 'Temp Sensor', 'Humidity Sensor', 'DHT22', 'AM2302', 'Thermometer', 'Weather', 'Sensor'],
    locationBin: 'BIN-C-03-3',
    isBestSeller: true,
    voltage: '3.3V / 5V'
  },
  {
    id: 'prod-037',
    sku: 'SEN-DS18B20-WATERPROOF',
    name: 'DS18B20 Waterproof Stainless Steel Digital Temperature Sensor Probe (1 Meter)',
    brand: 'Maxim Integrated',
    category: 'Sensors',
    subcategory: 'Environmental Sensors',
    price: 180,
    originalPrice: 260,
    inStock: true,
    stockCount: 190,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 175,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Submersible 1-meter waterproof temperature sensor probe housed in anti-rust stainless steel tube.',
    description: 'Precision digital temperature sensor utilizing Maxim 1-Wire protocol. Multiple probes can share a single microcontroller pin. Excellent for liquid temperature, HVAC, soil monitoring, and aquariums.',
    specifications: [
      { name: 'Temperature Range', value: '-55°C to +125°C (-67°F to +257°F)' },
      { name: 'Accuracy', value: '±0.5°C accuracy from -10°C to +85°C' },
      { name: 'Operating Voltage', value: '3.0V to 5.5V DC' },
      { name: 'Resolution', value: 'User-selectable 9 to 12-bit' },
      { name: 'Cable Length', value: '100 cm (1 meter) waterproof PVC' }
    ],
    datasheetUrl: 'https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf',
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 180 },
      { minQty: 10, discountPercent: 12, unitPrice: 158 },
      { minQty: 50, discountPercent: 22, unitPrice: 140 }
    ],
    tags: ['Temperature Sensor', 'Temp Sensor', 'DS18B20', 'Waterproof Probe', '1-Wire', 'Thermometer', 'Sensor'],
    locationBin: 'BIN-C-03-4',
    isBestSeller: true,
    voltage: '3.3V / 5V',
    protocol: '1-Wire'
  }
];
