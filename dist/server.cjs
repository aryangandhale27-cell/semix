var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_razorpay = __toESM(require("razorpay"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_resend = require("resend");
var import_genai = require("@google/genai");
var import_vite = require("vite");

// src/mockData/products.ts
var INITIAL_PRODUCTS = [
  {
    id: "prod-001",
    sku: "RPI-5-8GB-ORIG",
    name: "Raspberry Pi 5 Single Board Computer (8GB RAM)",
    brand: "Raspberry Pi Foundation",
    category: "Electronic Modules and Development Boards",
    subcategory: "Single Board Computers",
    price: 8250,
    originalPrice: 8999,
    inStock: true,
    stockCount: 64,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Quad-core 64-bit Arm Cortex-A76 @ 2.4GHz with dual 4Kp60 micro-HDMI, PCIe 2.0 interface and VideoCore VII GPU.",
    description: "The latest generation flagship computer from Raspberry Pi. Up to 3x faster CPU performance, substantially higher GPU processing with OpenGL ES 3.1 & Vulkan 1.2, dual-band Wi-Fi 802.11ac, Bluetooth 5.0 BLE, and dedicated RTC power button controller.",
    specifications: [
      { name: "Processor", value: "Broadcom BCM2712 2.4GHz quad-core 64-bit Arm Cortex-A76" },
      { name: "RAM", value: "8GB LPDDR4X-4267 SDRAM" },
      { name: "Operating Voltage", value: "5V DC via USB-C (5A PD recommended)" },
      { name: "Display Ports", value: "2 \xD7 4Kp60 micro-HDMI outputs with HDR" },
      { name: "Connectivity", value: "Gigabit Ethernet, Dual-band 802.11ac Wi-Fi, Bluetooth 5.0" },
      { name: "Expansion", value: "PCIe 2.0 \xD71 interface via 16-pin FFC, 40-pin GPIO header" },
      { name: "Dimensions", value: "88 \xD7 56 \xD7 17 mm" }
    ],
    datasheetUrl: "https://datasheets.raspberrypi.com/rpi5/raspberry-pi-5-product-brief.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 8250 },
      { minQty: 5, discountPercent: 4, unitPrice: 7920 },
      { minQty: 20, discountPercent: 8, unitPrice: 7590 }
    ],
    tags: ["Raspberry Pi", "ARM Cortex-A76", "SBC", "AI Edge", "PCIe"],
    locationBin: "BIN-A-01-4",
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-002",
    sku: "ARD-UNO-R4-WIFI",
    name: "Arduino Uno R4 WiFi (RA4M1 32-bit Cortex-M4 + ESP32-S3)",
    brand: "Arduino Official",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 2450,
    originalPrice: 2899,
    inStock: true,
    stockCount: 118,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 96,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Renesas RA4M1 48MHz 32-bit Cortex-M4 with ESP32-S3 WiFi/Bluetooth, 12x8 LED matrix, and DAC.",
    description: "Retains the iconic UNO form factor with upgraded 32-bit power, expanded 256KB flash memory, native 12-bit DAC, CAN bus support, 5V operating logic, and built-in onboard 12x8 red LED Matrix display for direct animation and telemetry without extra shields.",
    specifications: [
      { name: "Main MCU", value: "Renesas RA4M1 (Arm Cortex-M4) @ 48 MHz" },
      { name: "Wireless MCU", value: "Espressif ESP32-S3-MINI-1 (WiFi 2.4GHz & BT 5.0)" },
      { name: "Operating Voltage", value: "5V (Input limit up to 24V DC)" },
      { name: "Memory", value: "256 KB Flash, 32 KB SRAM, 8 KB EEPROM" },
      { name: "Digital I/O", value: "14 pins (6 PWM outputs)" },
      { name: "Onboard Matrix", value: "12x8 Red Addressable LED Matrix" }
    ],
    datasheetUrl: "https://docs.arduino.cc/resources/datasheets/ABX00087-datasheet.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2450 },
      { minQty: 10, discountPercent: 6, unitPrice: 2303 },
      { minQty: 50, discountPercent: 12, unitPrice: 2156 }
    ],
    tags: ["Arduino", "Uno R4", "WiFi", "ESP32", "32-Bit", "LED Matrix"],
    locationBin: "BIN-A-02-1",
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-003",
    sku: "ESP32-WROOM-32D-MOD",
    name: "ESP32-WROOM-32D Dual Core Wi-Fi + Bluetooth Dev Board (NodeMCU)",
    brand: "Espressif Systems",
    category: "Electronic Modules and Development Boards",
    subcategory: "IoT Modules",
    price: 380,
    originalPrice: 499,
    inStock: true,
    stockCount: 340,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Dual Xtensa 32-bit LX6 MCU @ 240MHz with 4MB SPI Flash, integrated 2.4GHz Wi-Fi and Bluetooth 4.2 BLE.",
    description: "The industry-standard hobbyist and IoT prototyping powerhouse. Equipped with CP2102/CH340 USB-UART bridge, EN and BOOT buttons, onboard PCB antenna, and full support for ESP-IDF, Arduino IDE, and MicroPython.",
    specifications: [
      { name: "CPU", value: "Xtensa Dual-Core 32-bit LX6 microprocessor @ 240 MHz" },
      { name: "Wireless", value: "Wi-Fi 802.11 b/g/n + BLE 4.2 BR/EDR" },
      { name: "Operating Voltage", value: "3.3V Logic (5V Micro-USB Input)" },
      { name: "SRAM / Flash", value: "520 KB SRAM / 4 MB SPI Flash" },
      { name: "Peripherals", value: "Capacitive touch, ADC, DAC, UART, SPI, I2C, PWM" }
    ],
    datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32d_esp32-wroom-32u_datasheet_en.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 380 },
      { minQty: 10, discountPercent: 10, unitPrice: 342 },
      { minQty: 50, discountPercent: 18, unitPrice: 311 },
      { minQty: 100, discountPercent: 25, unitPrice: 285 }
    ],
    tags: ["ESP32", "Espressif", "WiFi", "Bluetooth", "IoT", "Arduino Compatible"],
    locationBin: "BIN-B-01-3",
    isFeatured: true,
    isBestSeller: true,
    voltage: "3.3V",
    protocol: "I2C, SPI, UART"
  },
  {
    id: "prod-004",
    sku: "SEN-MPU-6050-6DOF",
    name: "MPU-6050 3-Axis Gyroscope + 3-Axis Accelerometer Sensor Module (GY-521)",
    brand: "InvenSense",
    category: "Sensors",
    subcategory: "Motion Sensors",
    price: 165,
    originalPrice: 240,
    inStock: true,
    stockCount: 215,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 188,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "6-Degrees of Freedom IMU with onboard Digital Motion Processor (DMP) and standard I2C communication interface.",
    description: "Combines a 3-axis gyroscope and a 3-axis accelerometer on the same silicon die together with an onboard Digital Motion Processor (DMP) capable of processing complex 9-axis MotionFusion algorithms.",
    specifications: [
      { name: "Chipset", value: "MPU-6050 (GY-521 Breakout)" },
      { name: "Supply Voltage", value: "3.0V \u2013 5.0V (Onboard low-dropout regulator)" },
      { name: "Communication", value: "Standard I2C Protocol (Fast-mode 400kHz)" },
      { name: "Gyroscope Range", value: "\xB1250, \xB1500, \xB11000, \xB12000 \xB0/sec" },
      { name: "Acceleration Range", value: "\xB12g, \xB14g, \xB18g, \xB116g" }
    ],
    datasheetUrl: "https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 165 },
      { minQty: 10, discountPercent: 12, unitPrice: 145 },
      { minQty: 50, discountPercent: 20, unitPrice: 132 }
    ],
    tags: ["IMU", "Gyroscope", "Accelerometer", "Robotics", "Drone", "I2C"],
    locationBin: "BIN-C-04-2",
    isBestSeller: true,
    voltage: "3.3V / 5V",
    protocol: "I2C"
  },
  {
    id: "prod-005",
    sku: "SEN-BMP280-BARO",
    name: "BMP280 High Precision Barometric Pressure & Altitude Sensor Module",
    brand: "Bosch Sensortec",
    category: "Sensors",
    subcategory: "Environmental Sensors",
    price: 145,
    originalPrice: 210,
    inStock: true,
    stockCount: 160,
    minOrderQty: 1,
    rating: 4.6,
    reviewCount: 74,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Absolute barometric pressure and temperature sensor with \xB11 hPa absolute accuracy and \xB11 meter altitude resolution.",
    description: "Engineered specifically for mobile applications, altimeters, weather forecasting stations, and quadcopter altitude hold systems. Supports both I2C and SPI digital interfaces.",
    specifications: [
      { name: "Pressure Range", value: "300 to 1100 hPa (equiv. to +9000m to -500m sea level)" },
      { name: "Operating Voltage", value: "1.8V \u2013 3.6V DC (5V tolerant with onboard level shifter)" },
      { name: "Interface", value: "I2C (up to 3.4MHz) and SPI (3-wire / 4-wire up to 10MHz)" },
      { name: "Resolution", value: "Pressure: 0.16 Pa (~12 cm altitude)" }
    ],
    datasheetUrl: "https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp280-ds001.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 145 },
      { minQty: 10, discountPercent: 10, unitPrice: 130 },
      { minQty: 50, discountPercent: 18, unitPrice: 118 }
    ],
    tags: ["Barometer", "Altitude", "Weather", "Bosch", "I2C", "SPI"],
    locationBin: "BIN-C-05-1",
    isNew: false,
    isFeatured: false,
    voltage: "3.3V",
    protocol: "I2C / SPI"
  },
  {
    id: "prod-006",
    sku: "BAT-LIPO-3S-2200-30C",
    name: "Orange 3S 11.1V 2200mAh 30C Lithium Polymer (LiPo) Battery Pack",
    brand: "Orange Power",
    category: "Batteries and Power Supply",
    subcategory: "LiPo Batteries",
    price: 1480,
    originalPrice: 1799,
    inStock: true,
    stockCount: 42,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "High discharge rate 30C (66A continuous) 3-cell LiPo with standard XT60 main connector and JST-XH balance plug.",
    description: "Designed for high drain applications including racing drones, quadcopters, RC planes, robotics chassis, and high power motor test benches. Manufactured with low internal resistance cells for high power output.",
    specifications: [
      { name: "Nominal Voltage", value: "11.1V (3S1P / 3.7V per cell)" },
      { name: "Capacity", value: "2200 mAh" },
      { name: "Discharge Rating", value: "30C Continuous (66A), 60C Burst (132A)" },
      { name: "Discharge Connector", value: "Amass XT60 Genuine Connector (12AWG Silicone Wire)" },
      { name: "Balance Connector", value: "JST-XH 4-Pin" },
      { name: "Weight", value: "178 grams (\xB1 5g)" }
    ],
    datasheetUrl: "https://example.com/datasheets/orange-3s-2200-spec.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 1480 },
      { minQty: 5, discountPercent: 5, unitPrice: 1406 },
      { minQty: 20, discountPercent: 12, unitPrice: 1302 }
    ],
    tags: ["LiPo", "3S Battery", "Drone", "RC Plane", "XT60", "Orange"],
    locationBin: "BIN-D-02-3",
    isFeatured: true,
    voltage: "11.1V"
  },
  {
    id: "prod-007",
    sku: "DRV-L298N-DUAL-HBRDG",
    name: "L298N Dual H-Bridge DC Stepper Motor Driver Controller Board",
    brand: "STMicroelectronics Core",
    category: "Electronic Modules and Development Boards",
    subcategory: "Motor Drivers",
    price: 185,
    originalPrice: 250,
    inStock: true,
    stockCount: 195,
    minOrderQty: 1,
    rating: 4.6,
    reviewCount: 245,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Heavy-duty dual H-bridge motor driver capable of driving two DC motors or one 2-phase 4-wire stepper motor up to 2A per channel.",
    description: "Equipped with large aluminum heat sink, screw terminals for motor and power wires, and onboard 78M05 5V regulator for logic circuitry. Supports PWM speed control and direction reversing.",
    specifications: [
      { name: "Driver IC", value: "L298N Dual H-Bridge Driver IC" },
      { name: "Drive Voltage", value: "5V \u2013 35V DC" },
      { name: "Peak Current", value: "2A per bridge" },
      { name: "Logic Voltage", value: "5V (onboard regulator enabled when Vms > 7V)" },
      { name: "Control Signals", value: "IN1, IN2, IN3, IN4, ENA, ENB" }
    ],
    datasheetUrl: "https://www.st.com/resource/en/datasheet/l298.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 185 },
      { minQty: 10, discountPercent: 10, unitPrice: 166 },
      { minQty: 50, discountPercent: 20, unitPrice: 148 }
    ],
    tags: ["Motor Driver", "H-Bridge", "L298N", "Robotics", "Stepper Driver"],
    locationBin: "BIN-E-01-2",
    isBestSeller: true,
    voltage: "5V - 35V"
  },
  {
    id: "prod-008",
    sku: "SER-SG90-MICRO-9G",
    name: "TowerPro SG90 9g Micro Servo Motor 180\xB0 for RC & Robotics",
    brand: "TowerPro Genuine",
    category: "Motors",
    subcategory: "Servo Motors",
    price: 110,
    originalPrice: 160,
    inStock: true,
    stockCount: 280,
    minOrderQty: 1,
    rating: 4.5,
    reviewCount: 380,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Ultra lightweight 9g nylon geared servo with 1.8 kg-cm stall torque @ 4.8V and 3-pin standard JR connector.",
    description: "Includes a complete set of 3 horn arms and mounting screws. Perfect for pan-tilt camera mounts, robot arms, RC airplanes, and Arduino sensor sweep mechanisms.",
    specifications: [
      { name: "Operating Voltage", value: "4.8V \u2013 6.0V DC" },
      { name: "Stall Torque", value: "1.8 kgf\xB7cm (4.8V), 2.0 kgf\xB7cm (6.0V)" },
      { name: "Operating Speed", value: "0.12 sec / 60 degrees (4.8V)" },
      { name: "Rotation Angle", value: "180 Degrees" },
      { name: "Dead Band Width", value: "7 \xB5s" },
      { name: "Weight", value: "9 grams" }
    ],
    datasheetUrl: "http://www.ee.ic.ac.uk/pcheung/teaching/DE1_EE/stores/sg90_datasheet.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 110 },
      { minQty: 10, discountPercent: 12, unitPrice: 96 },
      { minQty: 50, discountPercent: 22, unitPrice: 85 }
    ],
    tags: ["Servo", "SG90", "TowerPro", "Actuator", "Robotics"],
    locationBin: "BIN-E-03-4",
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-009",
    sku: "SEN-HC-SR04-ULTRA",
    name: "HC-SR04 Ultrasonic Distance Sensor Module (2cm to 400cm Range)",
    brand: "Waveshare Equivalent",
    category: "Sensors",
    subcategory: "Proximity Sensors",
    price: 85,
    originalPrice: 120,
    inStock: true,
    stockCount: 410,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 220,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Non-contact ultrasonic ranging module with 3mm precision, 40kHz transducer frequency, and standard Trigger/Echo interface.",
    description: "Accurate ultrasonic distance detection ideal for obstacle avoiding robots, liquid level measurement, parking sensors, and automated entry alarms.",
    specifications: [
      { name: "Working Voltage", value: "5V DC" },
      { name: "Working Current", value: "15 mA" },
      { name: "Frequency", value: "40 kHz" },
      { name: "Ranging Distance", value: "2 cm \u2013 400 cm (accuracy up to 3mm)" },
      { name: "Measuring Angle", value: "15 Degrees" },
      { name: "Trigger Signal", value: "10 \xB5s TTL pulse" }
    ],
    datasheetUrl: "https://www.electroschematics.com/wp-content/uploads/2013/07/HC-SR04-datasheet.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 85 },
      { minQty: 10, discountPercent: 12, unitPrice: 75 },
      { minQty: 50, discountPercent: 20, unitPrice: 68 }
    ],
    tags: ["Ultrasonic", "HC-SR04", "Proximity", "Robotics", "Arduino Sensor"],
    locationBin: "BIN-C-02-1",
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-010",
    sku: "DEV-RPI-PICO-2-RP2350",
    name: "Raspberry Pi Pico 2 Microcontroller Board (RP2350 Dual Arm / RISC-V)",
    brand: "Raspberry Pi Foundation",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 499,
    originalPrice: 650,
    inStock: true,
    stockCount: 150,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 68,
    image: "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Dual Cortex-M33 or Dual Hazard3 RISC-V cores @ 150MHz with 520KB SRAM, 4MB QSPI Flash, and Arm TrustZone security.",
    description: "The revolutionary second-generation silicon from Raspberry Pi. Features selectable dual Cortex-M33 cores or dual open-source RISC-V cores, robust hardware security architecture, and enhanced Programmable I/O (PIO) state machines.",
    specifications: [
      { name: "Core Architecture", value: "Dual Cortex-M33 OR Dual Hazard3 RISC-V @ 150MHz" },
      { name: "Memory", value: "520 KB on-chip SRAM, 4 MB external QSPI Flash" },
      { name: "PIO Blocks", value: "3 \xD7 PIO blocks (12 state machines total)" },
      { name: "Security", value: "Arm TrustZone-M, encrypted boot, 8KB OTP" },
      { name: "GPIO", value: "26 \xD7 multi-function 3.3V GPIO pins (including 4 analog inputs)" }
    ],
    datasheetUrl: "https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 499 },
      { minQty: 10, discountPercent: 8, unitPrice: 459 },
      { minQty: 50, discountPercent: 15, unitPrice: 424 }
    ],
    tags: ["Raspberry Pi Pico", "RP2350", "RISC-V", "Arm Cortex-M33", "PIO"],
    locationBin: "BIN-A-03-2",
    isNew: true,
    isFeatured: true,
    voltage: "3.3V"
  },
  {
    id: "prod-011",
    sku: "DIS-OLED-096-I2C-BLU",
    name: "0.96 inch 128x64 I2C OLED Display Module (SSD1306 Blue/Yellow)",
    brand: "Adafruit Style",
    category: "Displays",
    subcategory: "Displays",
    price: 220,
    originalPrice: 320,
    inStock: true,
    stockCount: 140,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 135,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "High contrast self-luminous organic LED display with 4-pin I2C interface, SSD1306 driver IC, and 160\xB0 viewing angle.",
    description: "Requires no backlight, providing ultra-low power consumption and crisp readable graphical output. Compatible with U8g2 and Adafruit_SSD1306 libraries.",
    specifications: [
      { name: "Display Size", value: "0.96 inch diagonal" },
      { name: "Resolution", value: "128 \xD7 64 pixels" },
      { name: "Driver IC", value: "SSD1306" },
      { name: "Communication", value: "I2C (Address 0x3C or 0x3D)" },
      { name: "Operating Voltage", value: "3.3V \u2013 5.0V DC" },
      { name: "Current Consumption", value: "~0.04W during full screen illumination" }
    ],
    datasheetUrl: "https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 220 },
      { minQty: 10, discountPercent: 10, unitPrice: 198 },
      { minQty: 50, discountPercent: 18, unitPrice: 180 }
    ],
    tags: ["OLED", "SSD1306", "Display", "I2C", "128x64", "Arduino"],
    locationBin: "BIN-F-01-1",
    isBestSeller: true,
    voltage: "3.3V / 5V",
    protocol: "I2C"
  },
  {
    id: "prod-012",
    sku: "PWR-TP4056-USBC-PROT",
    name: "TP4056 1A Li-Ion Lithium Battery Charger Module with Type-C & Protection",
    brand: "TopPower Electronics",
    category: "Batteries and Power Supply",
    subcategory: "Charging Modules",
    price: 32,
    originalPrice: 50,
    inStock: true,
    stockCount: 650,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 420,
    image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Constant-current/constant-voltage 1A single-cell lithium charger with DW01A protection IC and Type-C USB port.",
    description: "The ultimate portable power tool for makers building battery-powered projects. Protects cells from over-discharge (<2.5V), over-charge (>4.2V), and over-current.",
    specifications: [
      { name: "Input Interface", value: "Type-C USB female or solder pads" },
      { name: "Input Voltage", value: "4.5V \u2013 5.5V" },
      { name: "Charge Cut-off Voltage", value: "4.2V \xB1 1%" },
      { name: "Max Charge Current", value: "1000 mA (programmable via Rprog)" },
      { name: "Protection ICs", value: "DW01A Battery Protection + FS8205A Dual MOSFET" }
    ],
    datasheetUrl: "https://dlnmh9ip6v2uc.cloudfront.net/datasheets/Prototyping/TP4056.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 32 },
      { minQty: 10, discountPercent: 15, unitPrice: 27 },
      { minQty: 50, discountPercent: 25, unitPrice: 24 },
      { minQty: 100, discountPercent: 35, unitPrice: 20 }
    ],
    tags: ["TP4056", "Type-C", "Battery Charger", "Li-Ion", "18650", "BMS"],
    locationBin: "BIN-D-01-5",
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-013",
    sku: "CMP-RES-ASSORT-600PCS",
    name: "1/4W Metal Film Resistor Assortment Kit (30 Values \xD7 20 Pcs = 600 Pcs 1%)",
    brand: "Royal Ohm Standard",
    category: "Electronic Components",
    subcategory: "Resistors",
    price: 260,
    originalPrice: 380,
    inStock: true,
    stockCount: 180,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "High precision 1% tolerance metal film resistors from 10\u03A9 to 1M\u03A9, individually labeled in tape strips.",
    description: "Essential lab kit for every electronics workstation and student lab. Includes standard values like 10\u03A9, 100\u03A9, 220\u03A9, 330\u03A9, 1k\u03A9, 4.7k\u03A9, 10k\u03A9, 47k\u03A9, 100k\u03A9, 1M\u03A9 with excellent noise suppression and low temperature coefficient.",
    specifications: [
      { name: "Power Rating", value: "0.25 Watt (1/4 W)" },
      { name: "Tolerance", value: "\xB1 1% (5-band color code)" },
      { name: "Operating Voltage", value: "250V Max" },
      { name: "Values Included", value: "30 values from 10 Ohm to 1 Megaohm" },
      { name: "Quantity", value: "600 Pieces (20 pcs per value)" }
    ],
    datasheetUrl: "https://example.com/datasheets/metal-film-resistors.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 260 },
      { minQty: 5, discountPercent: 10, unitPrice: 234 },
      { minQty: 20, discountPercent: 20, unitPrice: 208 }
    ],
    tags: ["Resistors", "Metal Film", "Kit", "Components", "Assortment"],
    locationBin: "BIN-G-02-1",
    isFeatured: false,
    voltage: "Passive"
  },
  {
    id: "prod-014",
    sku: "WIR-BREADBOARD-BUNDLE",
    name: "MB-102 830-Point Solderless Breadboard + 65 Pcs Flexible Jumper Wires",
    brand: "SEMIX LABS MakerLab",
    category: "Cables and Connectors",
    subcategory: "Prototyping Accessories",
    price: 195,
    originalPrice: 280,
    inStock: true,
    stockCount: 220,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 164,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Full-size 830 tie-points breadboard with self-adhesive backing and color-coded power distribution rails plus male-to-male wires.",
    description: "Durable nickel-plated spring phosphor bronze contact clips for tight, reliable pin retention. Comes with 65 assorted length flexible jumper wires with molded pins.",
    specifications: [
      { name: "Tie Points", value: "830 (630 in circuit area, 200 in 4 power buses)" },
      { name: "Pitch", value: "Standard 2.54 mm (0.1 inch)" },
      { name: "Wire Gauge Compatibility", value: "20 to 29 AWG" },
      { name: "Jumper Wire Count", value: "65 Pieces multi-color" }
    ],
    datasheetUrl: "https://example.com/datasheets/mb102-breadboard.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 195 },
      { minQty: 10, discountPercent: 12, unitPrice: 171 },
      { minQty: 50, discountPercent: 22, unitPrice: 152 }
    ],
    tags: ["Breadboard", "MB102", "Jumper Wires", "Prototyping", "Cables"],
    locationBin: "BIN-G-01-3",
    isBestSeller: true,
    voltage: "Passive"
  },
  {
    id: "prod-015",
    sku: "MOT-N20-GEAR-6V-300",
    name: "N20 Micro Metal Gear Motor 6V 300RPM with High Torque All-Metal Gearbox",
    brand: "GA12-N20 Motors",
    category: "Motors",
    subcategory: "DC Gear Motors",
    price: 240,
    originalPrice: 340,
    inStock: true,
    stockCount: 88,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 82,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Precision miniature all-metal gear motor with D-shaped 3mm output shaft, ideal for line followers and micro robots.",
    description: "Precision brass and steel gear reduction train delivering substantial stall torque in a sub-miniature form factor. Smooth low-friction carbon brush commutation.",
    specifications: [
      { name: "Rated Voltage", value: "6V DC (Operating range 3V - 9V)" },
      { name: "No-load Speed", value: "300 RPM @ 6V" },
      { name: "Stall Torque", value: "0.8 kg\xB7cm" },
      { name: "Shaft Diameter", value: "3 mm D-Shaft (length 10 mm)" },
      { name: "Total Weight", value: "14 grams" }
    ],
    datasheetUrl: "https://example.com/datasheets/n20-gear-motor.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 240 },
      { minQty: 10, discountPercent: 10, unitPrice: 216 },
      { minQty: 50, discountPercent: 20, unitPrice: 192 }
    ],
    tags: ["N20", "Motor", "Micro Gearbox", "Robotics", "Line Follower"],
    locationBin: "BIN-E-04-1",
    isNew: false,
    voltage: "6V"
  },
  {
    id: "prod-016",
    sku: "DRN-BLDC-2212-1400KV",
    name: "A2212 1400KV Brushless Outrunner DC Motor for Quadcopters & Fixed Wings",
    brand: "EMAX / Readytosky",
    category: "Motors",
    subcategory: "BLDC Motors",
    price: 520,
    originalPrice: 699,
    inStock: true,
    stockCount: 75,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 118,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "High-efficiency 1400KV brushless motor with bullet prop adapter, motor mount and pre-soldered 3.5mm gold banana connectors.",
    description: "Pairs perfectly with 30A ESC and 8045 or 9050 propellers running on 2S-3S LiPo battery packs. Dynamic balance calibrated for vibration-free flight.",
    specifications: [
      { name: "KV Rating", value: "1400 RPM / Volt" },
      { name: "Battery Compatibility", value: "2S \u2013 3S LiPo (7.4V \u2013 11.1V)" },
      { name: "Max Current", value: "16A / 60 seconds" },
      { name: "Shaft Diameter", value: "3.17 mm" },
      { name: "Recommended ESC", value: "30A ESC" }
    ],
    datasheetUrl: "https://example.com/datasheets/a2212-motor-spec.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 520 },
      { minQty: 4, discountPercent: 8, unitPrice: 478 },
      { minQty: 16, discountPercent: 15, unitPrice: 442 }
    ],
    tags: ["BLDC", "A2212", "Drone Motor", "Brushless", "Quadcopter"],
    locationBin: "BIN-H-01-2",
    isFeatured: true,
    voltage: "11.1V"
  },
  {
    id: "prod-017",
    sku: "SMD-BOOK-0805-RES-8500",
    name: "0805 SMD Resistor Sample Book (170 Values \xD7 50 Pcs = 8,500 Pcs 1%)",
    brand: "SEMIX LABS Pro",
    category: "SMD Sample Books and Kits",
    subcategory: "Resistor Sample Books",
    price: 1850,
    originalPrice: 2400,
    inStock: true,
    stockCount: 45,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 52,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Comprehensive binder with 170 standard E24/E96 SMD 0805 resistor values from 0\u03A9 to 10M\u03A9, clearly labeled for R&D engineers.",
    description: "Compact, high quality leatherette ring binder designed for electronics labs, prototyping benches, and hardware startups. Each page holds peel-back tape strips clearly labeled with resistance values and EIA codes.",
    specifications: [
      { name: "Package", value: "SMD 0805 (2012 Metric)" },
      { name: "Tolerance", value: "\xB1 1%" },
      { name: "Power Rating", value: "1/8W (0.125W)" },
      { name: "Values Included", value: "170 distinct values (0 Ohm to 10 Megaohm)" },
      { name: "Total Quantity", value: "8,500 pieces (50 pcs per value)" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 1850 },
      { minQty: 3, discountPercent: 8, unitPrice: 1702 },
      { minQty: 10, discountPercent: 15, unitPrice: 1572 }
    ],
    tags: ["SMD Book", "Resistors", "0805", "Sample Book", "Lab Kit"],
    locationBin: "BIN-K-01-1",
    isNew: true,
    isFeatured: true,
    voltage: "Passive"
  },
  {
    id: "prod-018",
    sku: "SMD-BOOK-0603-CAP-4500",
    name: "0603 SMD Ceramic Capacitor Sample Book (90 Values \xD7 50 Pcs = 4,500 Pcs)",
    brand: "SEMIX LABS Pro",
    category: "SMD Sample Books and Kits",
    subcategory: "Capacitor Sample Books",
    price: 2150,
    originalPrice: 2800,
    inStock: true,
    stockCount: 38,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 39,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Multi-layer MLCC ceramic capacitors in 0603 footprint covering 0.5pF to 10\xB5F, organized in a protective enclosure.",
    description: "Never pause your PCB assembly again waiting for bypass and decoupling caps. Features dielectric compositions (NPO/C0G, X7R, X5R) rated for standard 50V and 25V applications.",
    specifications: [
      { name: "Package", value: "SMD 0603 (1608 Metric)" },
      { name: "Capacitance Range", value: "0.5 pF to 10 \xB5F" },
      { name: "Dielectrics", value: "C0G/NPO, X7R, X5R" },
      { name: "Values Count", value: "90 values" },
      { name: "Total Quantity", value: "4,500 pieces" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2150 },
      { minQty: 3, discountPercent: 6, unitPrice: 2021 },
      { minQty: 10, discountPercent: 12, unitPrice: 1892 }
    ],
    tags: ["SMD Book", "Capacitors", "0603", "MLCC", "Binder"],
    locationBin: "BIN-K-01-2",
    isNew: true,
    voltage: "Passive"
  },
  {
    id: "prod-019",
    sku: "TLS-T12-SOLD-STN-72W",
    name: "T12 Portable Digital OLED Soldering Station (72W Quick Heating PID)",
    brand: "QuickHeat Pro",
    category: "Hardware and Tools",
    subcategory: "Soldering Equipment",
    price: 2650,
    originalPrice: 3499,
    inStock: true,
    stockCount: 55,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "72W intelligent temperature-controlled soldering station reaching 300\xB0C in under 8 seconds with auto-sleep and OLED display.",
    description: "Compatible with all Hakko T12 integrated heating cartridge tips. Uses STC microcontroller PID temperature regulation accurate to within \xB12\xB0C. Powered by 12V-24V DC or USB-PD adapter.",
    specifications: [
      { name: "Power Output", value: "72W Max (at 24V DC input)" },
      { name: "Temp Range", value: "150\xB0C to 480\xB0C" },
      { name: "Display", value: "0.96 inch High Contrast Monochrome OLED" },
      { name: "Tip Included", value: "T12-K knife blade tip" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2650 },
      { minQty: 5, discountPercent: 10, unitPrice: 2385 },
      { minQty: 20, discountPercent: 18, unitPrice: 2173 }
    ],
    tags: ["Soldering Iron", "T12", "OLED", "Hardware Tool", "PCB Repair"],
    locationBin: "BIN-T-02-1",
    isNew: true,
    isFeatured: true,
    voltage: "12V - 24V"
  },
  {
    id: "prod-020",
    sku: "TLS-ESD-TWEEZER-SET6",
    name: "Precision Anti-Static ESD Tweezers & Wire Stripper Tool Set (6-Piece)",
    brand: "Vetus Precision",
    category: "Hardware and Tools",
    subcategory: "Hand Tools",
    price: 480,
    originalPrice: 650,
    inStock: true,
    stockCount: 140,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 94,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Non-magnetic anti-acid stainless steel tweezers with conductive ESD coating and auto-adjusting wire stripper.",
    description: "Precision tips for placing 0402, 0603, and QFN silicon chips without electrostatic discharge hazards. Includes straight fine tip, curved eagle beak, flat tip, and wire cutter.",
    specifications: [
      { name: "Material", value: "High grade anti-magnetic stainless steel" },
      { name: "Surface Coating", value: "Electrostatic Dissipative (ESD) matte black" },
      { name: "Pieces Included", value: "5x tweezers (ESD-10 to ESD-15) + 1x stripper" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 480 },
      { minQty: 5, discountPercent: 12, unitPrice: 422 },
      { minQty: 25, discountPercent: 20, unitPrice: 384 }
    ],
    tags: ["Tweezers", "ESD", "Tools", "SMD Assembly", "Prototyping"],
    locationBin: "BIN-T-01-3",
    voltage: "Passive"
  },
  {
    id: "prod-021",
    sku: "DIS-LCD-1602-I2C-BLU",
    name: "16x2 Character LCD Display Module with I2C Backpack (HD44780 Blue)",
    brand: "DisplayTech Standard",
    category: "Displays",
    subcategory: "Alphanumeric LCDs",
    price: 240,
    originalPrice: 350,
    inStock: true,
    stockCount: 185,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 160,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Classic 16 characters by 2 lines alphanumeric LCD with pre-soldered PCF8574 I2C adapter saving 14 microcontroller pins.",
    description: "Ideal for IoT status monitors, temperature meters, and menu selection interfaces. Contrast adjustment trimpot and backlight jumper included on the backpack PCB.",
    specifications: [
      { name: "Characters", value: "16 columns \xD7 2 rows" },
      { name: "Interface", value: "I2C (Address default 0x27 or 0x3F)" },
      { name: "Supply Voltage", value: "5V DC" },
      { name: "Backlight", value: "White text on blue LED backlight" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 240 },
      { minQty: 10, discountPercent: 10, unitPrice: 216 },
      { minQty: 50, discountPercent: 20, unitPrice: 192 }
    ],
    tags: ["LCD", "1602", "I2C Display", "HD44780", "Arduino"],
    locationBin: "BIN-F-02-3",
    voltage: "5V",
    protocol: "I2C"
  },
  {
    id: "prod-022",
    sku: "ROB-CHASSIS-4WD-SMART",
    name: "4WD Smart Robot Car Chassis Platform Kit with Speed Encoders & Dual Deck",
    brand: "RoboCraze Pro",
    category: "Robotics and DIY Kits",
    subcategory: "Robot Chassis Kits",
    price: 780,
    originalPrice: 1100,
    inStock: true,
    stockCount: 62,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Dual-deck transparent acrylic chassis with 4x TT gear motors, rubber tires, optical speed encoder discs, and 4xAA battery box.",
    description: "The definitive foundation for building self-driving obstacle avoiders, line tracers, and BLE/WiFi controlled rovers. Pre-drilled mounting holes for Arduino, Raspberry Pi, sensors, and motor shields.",
    specifications: [
      { name: "Motors", value: "4 \xD7 1:48 TT Gear Motors (3V - 6V DC)" },
      { name: "Tires", value: "65mm diameter high grip rubber tires" },
      { name: "Chassis Material", value: "Laser cut transparent acrylic plates" },
      { name: "Encoders", value: "4 \xD7 20-slot optical code discs" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 780 },
      { minQty: 5, discountPercent: 8, unitPrice: 717 },
      { minQty: 20, discountPercent: 16, unitPrice: 655 }
    ],
    tags: ["Robot Chassis", "4WD", "DIY Kit", "STEM", "TT Motor"],
    locationBin: "BIN-R-01-2",
    isNew: true,
    isFeatured: true,
    voltage: "4.5V - 6V"
  },
  {
    id: "prod-023",
    sku: "ROB-ARM-4DOF-ACRYLIC",
    name: "4-Axis Acrylic Robotic Arm Prototyping Kit with 4x SG90 Servos",
    brand: "RoboCraze Pro",
    category: "Robotics and DIY Kits",
    subcategory: "Robotic Arms",
    price: 980,
    originalPrice: 1350,
    inStock: true,
    stockCount: 40,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 45,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Desktop 4-Degrees of Freedom pick-and-place robot arm including laser-cut structural frames, hardware, and 4 micro servos.",
    description: "Great for learning kinematics, inverse kinematics, servo PWM control, and automated sorting. Compatible with joystick shield or web dashboard control.",
    specifications: [
      { name: "Degrees of Freedom", value: "4-Axis (Base, Shoulder, Elbow, Gripper)" },
      { name: "Servos Included", value: "4 \xD7 SG90 9g metal/nylon gear servos" },
      { name: "Max Reach", value: "Approximately 200 mm" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 980 },
      { minQty: 4, discountPercent: 10, unitPrice: 882 },
      { minQty: 12, discountPercent: 18, unitPrice: 803 }
    ],
    tags: ["Robot Arm", "4DOF", "Servo Kit", "STEM Kit", "Robotics"],
    locationBin: "BIN-R-02-1",
    voltage: "5V"
  },
  {
    id: "prod-024",
    sku: "PHY-RHEOSTAT-50R-15A",
    name: "Precision Slide Wire Rheostat (50 Ohm 1.5A Lab Physics Demonstrator)",
    brand: "National Scientific Instruments",
    category: "Physics Instruments",
    subcategory: "Electromagnetism",
    price: 680,
    originalPrice: 890,
    inStock: true,
    stockCount: 30,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 28,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Constantan wire wound on porcelain tube with sliding phosphor bronze contact brush and 4mm binding posts.",
    description: "Designed for physics laboratory education to study Ohm\u2019s law, Wheatstone bridges, and current regulation. High thermal endurance and smooth resistance sweep.",
    specifications: [
      { name: "Resistance", value: "50 Ohms \xB1 10%" },
      { name: "Max Current", value: "1.5 Amperes continuous" },
      { name: "Terminals", value: "3 \xD7 standard 4mm brass binding posts" },
      { name: "Insulation", value: "Vitreous enameled steel tube" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 680 },
      { minQty: 5, discountPercent: 10, unitPrice: 612 },
      { minQty: 20, discountPercent: 20, unitPrice: 544 }
    ],
    tags: ["Physics Instrument", "Rheostat", "Laboratory", "Ohm Law", "Education"],
    locationBin: "BIN-P-01-1",
    isNew: true,
    voltage: "Passive"
  },
  {
    id: "prod-025",
    sku: "PHY-PRISM-OPTICAL-60MM",
    name: "Equilateral Optical Glass Dispersion Prism (60x60x60mm Optical Bench)",
    brand: "OptoLab Scientific",
    category: "Physics Instruments",
    subcategory: "Optics",
    price: 320,
    originalPrice: 450,
    inStock: true,
    stockCount: 50,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 32,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "K9 optical grade crystal glass triangular prism delivering high light dispersion and spectrum separation.",
    description: "High-precision polished optical surfaces for refraction demonstrations, spectrometer alignment, and physics light spectrum experiments.",
    specifications: [
      { name: "Material", value: "K9 High-Transmission Optical Glass" },
      { name: "Angle", value: "Equilateral 60\xB0 \xD7 60\xB0 \xD7 60\xB0" },
      { name: "Length", value: "60 mm" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 320 },
      { minQty: 5, discountPercent: 10, unitPrice: 288 },
      { minQty: 20, discountPercent: 20, unitPrice: 256 }
    ],
    tags: ["Prism", "Optics", "Physics Instrument", "Refraction", "K9 Glass"],
    locationBin: "BIN-P-02-4",
    voltage: "Passive"
  },
  {
    id: "prod-026",
    sku: "SMD-AMS1117-33-TAPE25",
    name: "AMS1117-3.3V SOT-223 Low Dropout Linear Voltage Regulator (Tape of 25)",
    brand: "Advanced Monolithic Systems",
    category: "SMD Components",
    subcategory: "Voltage Regulators",
    price: 95,
    originalPrice: 150,
    inStock: true,
    stockCount: 800,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 210,
    image: "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Fixed 3.3V 1A output LDO in compact SOT-223 surface mount package with built-in thermal overload and short-circuit protection.",
    description: "Standard workhorse power IC across thousands of IoT boards, ESP32 modules, and embedded peripherals. Dropout voltage under 1.1V at full load.",
    specifications: [
      { name: "Output Voltage", value: "3.3V Fixed (\xB1 1%)" },
      { name: "Max Current", value: "1.0 Ampere" },
      { name: "Input Voltage", value: "4.5V to 15V" },
      { name: "Package", value: "SOT-223 SMD" },
      { name: "Quantity", value: "25 Pieces cut tape" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 95 },
      { minQty: 5, discountPercent: 15, unitPrice: 80 },
      { minQty: 20, discountPercent: 30, unitPrice: 66 }
    ],
    tags: ["AMS1117", "SOT-223", "SMD IC", "LDO", "Voltage Regulator"],
    locationBin: "BIN-S-01-1",
    isBestSeller: true,
    voltage: "3.3V Out"
  },
  {
    id: "prod-027",
    sku: "SMD-RES-0805-10K-REEL",
    name: "0805 SMD 10k Ohm 1% Precision Chip Resistors (5,000 Pcs Full Reel)",
    brand: "Yageo Corp",
    category: "SMD Components",
    subcategory: "Chip Resistors",
    price: 340,
    originalPrice: 480,
    inStock: true,
    stockCount: 120,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Standard 7-inch pick-and-place reel of 5000 pcs 0805 10k\u03A9 resistors for automatic SMD line placement and lab restocking.",
    description: "High reliability thick film chip resistors with nickel barrier termination. Ideal for pull-up and pull-down configurations in modern microelectronics.",
    specifications: [
      { name: "Resistance", value: "10,000 Ohms (10k)" },
      { name: "Tolerance", value: "\xB1 1%" },
      { name: "Power Rating", value: "0.125W (1/8W)" },
      { name: "Package", value: "0805 (2012 Metric) Reel" },
      { name: "Quantity", value: "5,000 Pieces" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 340 },
      { minQty: 2, discountPercent: 8, unitPrice: 312 },
      { minQty: 5, discountPercent: 15, unitPrice: 289 }
    ],
    tags: ["0805", "10k", "Resistor Reel", "SMD Component", "Pick and Place"],
    locationBin: "BIN-S-02-4",
    isBestSeller: true,
    voltage: "Passive"
  },
  {
    id: "prod-028",
    sku: "ARD-UNO-R3-DIP",
    name: "Arduino Uno R3 DIP Microcontroller Board (ATmega328P 16MHz)",
    brand: "Arduino Official",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 1850,
    originalPrice: 2200,
    inStock: true,
    stockCount: 175,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "The classic Arduino development board based on the ATmega328P 8-bit AVR MCU with removable DIP chip.",
    description: "The golden standard microcontroller board for makers, educators, and engineers worldwide. Features 14 digital input/output pins (6 PWM), 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header, and a reset button.",
    specifications: [
      { name: "Microcontroller", value: "Microchip ATmega328P 8-bit AVR RISC" },
      { name: "Operating Voltage", value: "5V DC (5 volt)" },
      { name: "Input Voltage (recommended)", value: "7-12V DC via barrel jack" },
      { name: "Clock Speed", value: "16 MHz" },
      { name: "Digital I/O Pins", value: "14 (6 provide PWM output)" },
      { name: "Analog Input Pins", value: "6" },
      { name: "Flash Memory", value: "32 KB (ATmega328P) of which 0.5 KB used by bootloader" },
      { name: "SRAM / EEPROM", value: "2 KB SRAM / 1 KB EEPROM" }
    ],
    datasheetUrl: "https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 1850 },
      { minQty: 5, discountPercent: 5, unitPrice: 1757 },
      { minQty: 20, discountPercent: 12, unitPrice: 1628 }
    ],
    tags: ["Arduino", "Arduino Uno", "Uno R3", "ATmega328P", "Microcontroller", "MCU", "Development Board", "AVR"],
    locationBin: "BIN-A-02-2",
    isBestSeller: true,
    isFeatured: true,
    voltage: "5V"
  },
  {
    id: "prod-029",
    sku: "ARD-NANO-V3-CH340",
    name: "Arduino Nano V3.0 Microcontroller Board (ATmega328P 5V Type-C)",
    brand: "Arduino Compatible",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 320,
    originalPrice: 450,
    inStock: true,
    stockCount: 260,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Ultra-compact breadboard-friendly ATmega328P development board with modern Type-C USB interface.",
    description: "Breadboard-ready compact version of the Arduino Uno. Delivers identical ATmega328P processing power, 8 analog pins (2 more than Uno), and convenient pin header layout for fast prototyping.",
    specifications: [
      { name: "Microcontroller", value: "Microchip ATmega328P" },
      { name: "Operating Voltage", value: "5V DC" },
      { name: "USB Interface", value: "USB Type-C with CH340G USB-UART driver" },
      { name: "Clock Speed", value: "16 MHz" },
      { name: "Analog Input Pins", value: "8 (A0 to A7)" },
      { name: "Digital I/O Pins", value: "14 (6 PWM outputs)" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 320 },
      { minQty: 10, discountPercent: 10, unitPrice: 288 },
      { minQty: 50, discountPercent: 20, unitPrice: 256 }
    ],
    tags: ["Arduino", "Arduino Nano", "Nano", "ATmega328P", "Microcontroller", "MCU", "Dev Board"],
    locationBin: "BIN-A-02-4",
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-030",
    sku: "ARD-MEGA-2560-R3",
    name: "Arduino Mega 2560 R3 Microcontroller Board (ATmega2560 54 I/O Pins)",
    brand: "Arduino Official",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 2950,
    originalPrice: 3499,
    inStock: true,
    stockCount: 85,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 140,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "High-pinout microcontroller board with 54 digital I/O pins, 16 analog inputs, and 4 hardware UART serial ports.",
    description: "Designed for high complexity 3D printers, CNC systems, robotics, and extensive sensor arrays. Features 256 KB flash memory and 8 KB SRAM.",
    specifications: [
      { name: "Microcontroller", value: "ATmega2560 AVR" },
      { name: "Operating Voltage", value: "5V" },
      { name: "Digital I/O Pins", value: "54 (15 provide PWM)" },
      { name: "Analog Input Pins", value: "16" },
      { name: "Hardware Serial UARTs", value: "4 UART ports" },
      { name: "Flash Memory", value: "256 KB" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 2950 },
      { minQty: 5, discountPercent: 6, unitPrice: 2773 },
      { minQty: 20, discountPercent: 12, unitPrice: 2596 }
    ],
    tags: ["Arduino", "Arduino Mega", "Mega 2560", "ATmega2560", "Microcontroller", "MCU", "3D Printer Controller"],
    locationBin: "BIN-A-02-5",
    isFeatured: true,
    voltage: "5V"
  },
  {
    id: "prod-031",
    sku: "STM-STM32F401-BLACKPILL",
    name: "STM32F401 Black Pill Development Board (ARM Cortex-M4 32-bit 84MHz)",
    brand: "STMicroelectronics Core",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 460,
    originalPrice: 620,
    inStock: true,
    stockCount: 110,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608755728617-aefab37d45f1?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "High-performance 32-bit ARM Cortex-M4 @ 84MHz with FPU, 256KB Flash, 64KB SRAM, and Type-C USB interface.",
    description: "The STM32F401CCU6 Black Pill delivers intense 32-bit computing horsepower with hardware floating point unit (FPU), full DSP instructions, and USB-C connectivity. Fully programmable via STM32CubeIDE, Arduino IDE, or MicroPython.",
    specifications: [
      { name: "Core Architecture", value: "32-bit ARM Cortex-M4 with single-precision FPU" },
      { name: "Clock Speed", value: "84 MHz (105 DMIPS)" },
      { name: "Flash Memory", value: "256 KB Flash, 64 KB SRAM" },
      { name: "Operating Voltage", value: "3.3V Logic (5V tolerant pins)" },
      { name: "Peripherals", value: "USB 2.0 OTG, 3x I2C, 4x SPI, 3x USART, 12-bit ADC" }
    ],
    datasheetUrl: "https://www.st.com/resource/en/datasheet/stm32f401cb.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 460 },
      { minQty: 10, discountPercent: 10, unitPrice: 414 },
      { minQty: 50, discountPercent: 18, unitPrice: 377 }
    ],
    tags: ["STM32", "STM32F4", "STM32F401", "Black Pill", "ARM Cortex-M4", "32-Bit", "32-bit", "32bit", "MCU", "Microcontroller"],
    locationBin: "BIN-B-02-1",
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    voltage: "3.3V",
    protocol: "I2C, SPI, UART, USB"
  },
  {
    id: "prod-032",
    sku: "STM-STM32F103-BLUEPILL",
    name: "STM32F103C8T6 Blue Pill ARM Cortex-M3 32-bit Microcontroller Dev Board",
    brand: "STMicroelectronics Core",
    category: "Electronic Modules and Development Boards",
    subcategory: "Microcontroller Boards",
    price: 290,
    originalPrice: 420,
    inStock: true,
    stockCount: 165,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Popular entry-level 32-bit ARM Cortex-M3 microcontroller @ 72MHz with 64KB Flash and SWD debug port.",
    description: "The ultra-budget 32-bit standard microcontroller board. Delivers 72MHz performance, dual I2C, triple SPI, and CAN bus capability in an ultra compact form factor.",
    specifications: [
      { name: "Core Architecture", value: "32-bit ARM Cortex-M3 @ 72 MHz" },
      { name: "Flash Memory", value: "64 KB Flash, 20 KB SRAM" },
      { name: "Operating Voltage", value: "2.0V - 3.6V (3.3V recommended)" },
      { name: "I/O Pins", value: "37 GPIO pins" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 290 },
      { minQty: 10, discountPercent: 12, unitPrice: 255 },
      { minQty: 50, discountPercent: 22, unitPrice: 226 }
    ],
    tags: ["STM32", "Blue Pill", "STM32F103", "ARM Cortex-M3", "32-Bit", "32-bit", "MCU", "Microcontroller"],
    locationBin: "BIN-B-02-2",
    isBestSeller: true,
    voltage: "3.3V"
  },
  {
    id: "prod-033",
    sku: "REL-5V-1CH-OPTO-MOD",
    name: "5V 1-Channel Relay Module with Optocoupler Isolation (High/Low Level Trigger)",
    brand: "Songle Electronic",
    category: "Electronic Components",
    subcategory: "Relays",
    price: 75,
    originalPrice: 110,
    inStock: true,
    stockCount: 310,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 240,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Songle 5V DC relay module with optical isolation and selectable high or low level trigger jumper.",
    description: "Safely switch high voltage AC mains or DC loads from 5V Arduino, ESP32, or Raspberry Pi microcontrollers. Features genuine Songle SRD-05VDC-SL-C relay with LED indicator for relay state and power.",
    specifications: [
      { name: "Operating Voltage", value: "5V DC (5 volt / 5V)" },
      { name: "Relay Model", value: "Songle SRD-05VDC-SL-C SPDT" },
      { name: "Contact Rating", value: "10A 250VAC, 10A 30VDC" },
      { name: "Trigger Current", value: "5 mA" },
      { name: "Trigger Mode", value: "Jumper selectable High or Low Level Trigger" },
      { name: "Isolation", value: "Optocoupler optical isolation protect MCU" }
    ],
    datasheetUrl: "https://example.com/datasheets/srd-05vdc-relay.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 75 },
      { minQty: 10, discountPercent: 12, unitPrice: 66 },
      { minQty: 50, discountPercent: 22, unitPrice: 58 }
    ],
    tags: ["Relay", "5V Relay", "5V DC Relay", "5V Relay Module", "5V SPDT Relay", "Optocoupler", "Automation", "Switch"],
    locationBin: "BIN-C-01-4",
    isBestSeller: true,
    voltage: "5V"
  },
  {
    id: "prod-034",
    sku: "REL-5V-4CH-OPTO-BOARD",
    name: "5V 4-Channel Relay Module Board with Optocoupler Isolation",
    brand: "Songle Electronic",
    category: "Electronic Components",
    subcategory: "Relays",
    price: 245,
    originalPrice: 350,
    inStock: true,
    stockCount: 140,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 165,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Quad 4-channel 5V SPDT relay board with separate LED indicators and screw terminals for home automation.",
    description: "Control up to 4 independent AC or DC appliances. Designed for Arduino, Raspberry Pi, ESP8266, and IoT smart home controllers.",
    specifications: [
      { name: "Operating Voltage", value: "5V DC (5 volt)" },
      { name: "Channels", value: "4 independent SPDT channels" },
      { name: "Switching Capacity", value: "10A 250VAC / 10A 125VAC / 10A 30VDC" },
      { name: "Isolation", value: "4x PC817 Optocouplers" }
    ],
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 245 },
      { minQty: 5, discountPercent: 10, unitPrice: 220 },
      { minQty: 20, discountPercent: 20, unitPrice: 196 }
    ],
    tags: ["Relay", "5V Relay", "4-Channel Relay", "5V DC Relay", "Relay Module", "Home Automation"],
    locationBin: "BIN-C-01-5",
    isFeatured: true,
    voltage: "5V"
  },
  {
    id: "prod-035",
    sku: "AUD-SPK-8OHM-05W-40MM",
    name: "8 Ohm 0.5W Micro Mylar Speaker (40mm Dia, 8\u03A9 / 8-Ohm Mini Audio Speaker)",
    brand: "CUI Devices Standard",
    category: "Electronic Components",
    subcategory: "Audio Components",
    price: 45,
    originalPrice: 70,
    inStock: true,
    stockCount: 220,
    minOrderQty: 1,
    rating: 4.7,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Clear acoustic 8 Ohm 0.5 Watt round miniature mylar cone speaker with solder tabs.",
    description: "Compact 40mm 8\u03A9 speaker ideal for intercoms, talking clocks, Arduino sound generators, synthesized speech, audio amplifier testing, and STEM robotics audio feedback.",
    specifications: [
      { name: "Impedance", value: "8 Ohm (8\u03A9, 8-ohm, 8 Ohms \xB1 15% at 1kHz)" },
      { name: "Rated Power", value: "0.5 Watt (0.5W)" },
      { name: "Maximum Power", value: "1.0 Watt" },
      { name: "Frequency Response", value: "350 Hz \u2013 10 kHz" },
      { name: "Diameter / Thickness", value: "40 mm diameter \xD7 5 mm thickness" }
    ],
    datasheetUrl: "https://example.com/datasheets/8ohm-speaker.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 45 },
      { minQty: 10, discountPercent: 12, unitPrice: 39 },
      { minQty: 50, discountPercent: 25, unitPrice: 33 }
    ],
    tags: ["Speaker", "8 Ohm", "8\u03A9", "8-ohm", "8 Ohms", "8ohm", "Audio", "Sound", "Mini Speaker"],
    locationBin: "BIN-G-03-2",
    isBestSeller: true,
    voltage: "Passive"
  },
  {
    id: "prod-036",
    sku: "SEN-DHT22-AM2302-TEMP",
    name: "DHT22 / AM2302 High Precision Digital Temperature & Humidity Sensor Module",
    brand: "Aosong Electronics",
    category: "Sensors",
    subcategory: "Environmental Sensors",
    price: 240,
    originalPrice: 320,
    inStock: true,
    stockCount: 155,
    minOrderQty: 1,
    rating: 4.8,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Calibrated digital temperature sensor and humidity sensor with single-bus digital signal output.",
    description: "High reliability temperature sensor accurate within \xB10.5\xB0C over -40 to 80\xB0C range. Built-in 8-bit MCU for capacitive humidity and thermistor temperature measurements.",
    specifications: [
      { name: "Temperature Range", value: "-40\xB0C to +80\xB0C (\xB10.5\xB0C accuracy)" },
      { name: "Humidity Range", value: "0 to 100% RH (\xB12% RH accuracy)" },
      { name: "Operating Voltage", value: "3.3V \u2013 5.5V DC" },
      { name: "Sampling Period", value: "2 seconds per reading" },
      { name: "Interface", value: "Single-bus digital signal" }
    ],
    datasheetUrl: "https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 240 },
      { minQty: 10, discountPercent: 10, unitPrice: 216 },
      { minQty: 50, discountPercent: 20, unitPrice: 192 }
    ],
    tags: ["Temperature Sensor", "Temp Sensor", "Humidity Sensor", "DHT22", "AM2302", "Thermometer", "Weather", "Sensor"],
    locationBin: "BIN-C-03-3",
    isBestSeller: true,
    voltage: "3.3V / 5V"
  },
  {
    id: "prod-037",
    sku: "SEN-DS18B20-WATERPROOF",
    name: "DS18B20 Waterproof Stainless Steel Digital Temperature Sensor Probe (1 Meter)",
    brand: "Maxim Integrated",
    category: "Sensors",
    subcategory: "Environmental Sensors",
    price: 180,
    originalPrice: 260,
    inStock: true,
    stockCount: 190,
    minOrderQty: 1,
    rating: 4.9,
    reviewCount: 175,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    shortDescription: "Submersible 1-meter waterproof temperature sensor probe housed in anti-rust stainless steel tube.",
    description: "Precision digital temperature sensor utilizing Maxim 1-Wire protocol. Multiple probes can share a single microcontroller pin. Excellent for liquid temperature, HVAC, soil monitoring, and aquariums.",
    specifications: [
      { name: "Temperature Range", value: "-55\xB0C to +125\xB0C (-67\xB0F to +257\xB0F)" },
      { name: "Accuracy", value: "\xB10.5\xB0C accuracy from -10\xB0C to +85\xB0C" },
      { name: "Operating Voltage", value: "3.0V to 5.5V DC" },
      { name: "Resolution", value: "User-selectable 9 to 12-bit" },
      { name: "Cable Length", value: "100 cm (1 meter) waterproof PVC" }
    ],
    datasheetUrl: "https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf",
    bulkTiers: [
      { minQty: 1, discountPercent: 0, unitPrice: 180 },
      { minQty: 10, discountPercent: 12, unitPrice: 158 },
      { minQty: 50, discountPercent: 22, unitPrice: 140 }
    ],
    tags: ["Temperature Sensor", "Temp Sensor", "DS18B20", "Waterproof Probe", "1-Wire", "Thermometer", "Sensor"],
    locationBin: "BIN-C-03-4",
    isBestSeller: true,
    voltage: "3.3V / 5V",
    protocol: "1-Wire"
  }
];

// src/services/searchConfig.ts
var import_firestore2 = require("firebase/firestore");

// src/lib/firebase.ts
var import_app = require("firebase/app");
var import_auth = require("firebase/auth");
var import_firestore = require("firebase/firestore");
var import_storage = require("firebase/storage");
var firebaseConfig = {
  apiKey: "AIzaSyAVaZJB98FlMUDeuuO_qqIw3EukBGdcFxQ",
  authDomain: "semix-ai-stdio.firebaseapp.com",
  projectId: "semix-ai-stdio",
  storageBucket: "semix-ai-stdio.firebasestorage.app",
  messagingSenderId: "312890264856",
  appId: "1:312890264856:web:48517354007f37690ee26d",
  measurementId: "G-D4N1QLV5C6"
};
var app = !(0, import_app.getApps)().length ? (0, import_app.initializeApp)(firebaseConfig) : (0, import_app.getApp)();
var db = (0, import_firestore.getFirestore)(app);
var storage = (0, import_storage.getStorage)(app);
var auth = (0, import_auth.getAuth)(app);
void (0, import_auth.setPersistence)(auth, import_auth.browserLocalPersistence).catch((error) => {
  console.error("[Firebase Auth] Could not configure Auth persistence:", error);
});
var googleProvider = new import_auth.GoogleAuthProvider();
var emailAuthProvider = new import_auth.EmailAuthProvider();

// src/services/searchConfig.ts
var DEFAULT_SEARCH_CONFIG = {
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
    fuzzyMatch: 20
  },
  inStockBoost: 10,
  outOfStockPenalty: -15,
  minQueryLength: 1,
  autocompleteLimit: 8,
  fuzzyThreshold: 2
};
var ELECTRONICS_SYNONYMS = {
  // Microcontrollers and boards
  mcu: ["microcontroller", "micro-controller", "processor", "board", "development board"],
  microcontroller: ["mcu", "micro controller", "micro-controller", "board", "processor"],
  "dev board": ["development board", "breakout board", "board", "module"],
  "development board": ["dev board", "breakout board", "board", "module"],
  arduino: ["uno", "nano", "mega", "atmega328p", "atmega2560"],
  "arduino uno": ["uno", "uno r3", "uno r4", "atmega328p"],
  uno: ["arduino uno", "uno r3", "uno r4"],
  nano: ["arduino nano", "atmega328p nano"],
  mega: ["arduino mega", "mega 2560", "atmega2560"],
  stm32: ["stm32f4", "stm32f401", "stm32f103", "blue pill", "black pill", "arm cortex"],
  stm32f4: ["stm32", "stm32f401", "black pill", "cortex-m4"],
  stm32f1: ["stm32", "stm32f103", "blue pill", "cortex-m3"],
  esp32: ["esp32-wroom", "nodemcu", "wifi", "bluetooth", "espressif"],
  rpi: ["raspberry pi", "sbc"],
  "raspberry pi": ["rpi", "pi 5", "pico", "single board computer"],
  // Architecture & Bits
  "32-bit": ["32 bit", "32bit", "32bits", "cortex-m4", "cortex-m3", "ra4m1", "rp2350", "xtensa"],
  "32 bit": ["32-bit", "32bit", "32bits"],
  "32bit": ["32-bit", "32 bit"],
  "64-bit": ["64 bit", "64bit", "cortex-a76"],
  "64 bit": ["64-bit", "64bit"],
  "64bit": ["64-bit", "64 bit"],
  // Electrical units: Ohms
  "8 ohm": ["8ohm", "8-ohm", "8 ohms", "8\u03A9", "8 \u03A9", "speaker"],
  "8\u03A9": ["8 ohm", "8ohm", "8-ohm", "8 ohms", "8 \u03A9"],
  "8-ohm": ["8 ohm", "8\u03A9", "8ohm", "8 ohms"],
  "8ohm": ["8 ohm", "8\u03A9", "8-ohm", "8 ohms"],
  ohm: ["\u03A9", "ohms", "resistance", "resistor"],
  "\u03A9": ["ohm", "ohms", "resistance", "resistor"],
  ohms: ["ohm", "\u03A9", "resistance"],
  // Voltage
  "5v": ["5 volt", "5 volts", "5-volt", "5vdc", "5 v"],
  "5 volt": ["5v", "5 volts", "5-volt", "5vdc", "5 v"],
  "5 volts": ["5v", "5 volt", "5-volt", "5vdc"],
  "3.3v": ["3.3 volt", "3.3 volts", "3.3-volt", "3v3", "3.3 v"],
  "3.3 volt": ["3.3v", "3.3 volts", "3v3"],
  "12v": ["12 volt", "12 volts", "12vdc", "12 v"],
  "12 volt": ["12v", "12 volts"],
  // Relays and Switching
  relay: ["relays", "relay module", "spdt relay", "solid state relay", "ssr", "songle", "5v relay"],
  "5v relay": ["5v relay module", "relay", "5v dc relay", "songle relay", "spdt relay"],
  "relay module": ["relay", "5v relay", "switch"],
  // Sensors & Temperature
  "temperature sensor": ["temp sensor", "thermometer", "thermal sensor", "dht22", "ds18b20", "temperature"],
  "temp sensor": ["temperature sensor", "thermometer", "dht22", "ds18b20"],
  thermometer: ["temperature sensor", "temp sensor"],
  sensor: ["sensors", "detector", "transducer", "module"],
  // Displays & Actuators
  display: ["screen", "oled", "lcd", "monitor", "tft"],
  oled: ["display", "screen", "ssd1306", "128x64"],
  lcd: ["display", "screen", "1602", "hd44780"],
  motor: ["motors", "stepper", "servo", "bldc", "brushless", "gear motor", "actuator"],
  servo: ["servomotor", "sg90", "servo motor", "actuator"],
  bldc: ["brushless motor", "brushless dc", "outrunner"]
};

// src/services/searchEngine.ts
function normalizeSearchText(text) {
  if (!text) return "";
  let clean = text.toLowerCase().trim().replace(/[“”"']/g, "");
  clean = clean.replace(/([0-9.]+)\s*([ωΩ]|ohms?)/gi, "$1 ohm");
  clean = clean.replace(/([0-9.]+)-ohm/gi, "$1 ohm");
  clean = clean.replace(/([0-9.]+)ohm\b/gi, "$1 ohm");
  clean = clean.replace(/([0-9.]+)\s*volts?\b/gi, "$1v");
  clean = clean.replace(/([0-9.]+)-volt\b/gi, "$1v");
  clean = clean.replace(/([0-9.]+)\s+v\b/gi, "$1v");
  clean = clean.replace(/([0-9.]+)vdc\b/gi, "$1v");
  clean = clean.replace(/\b(8|16|32|64)\s*bit\b/gi, "$1-bit");
  clean = clean.replace(/\b(8|16|32|64)bit\b/gi, "$1-bit");
  clean = clean.replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
  return clean;
}
function tokenizeQuery(query) {
  const norm = normalizeSearchText(query);
  if (!norm) return [];
  return norm.split(/\s+/).filter((t) => t.length > 0);
}
function damerauLevenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const lenA = a.length;
  const lenB = b.length;
  const d = Array.from(
    { length: lenA + 1 },
    () => new Array(lenB + 1).fill(0)
  );
  for (let i = 0; i <= lenA; i++) d[i][0] = i;
  for (let j = 0; j <= lenB; j++) d[0][j] = j;
  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        // deletion
        d[i][j - 1] + 1,
        // insertion
        d[i - 1][j - 1] + cost
        // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[lenA][lenB];
}
function extractCatalogDictionary(products) {
  const vocab = /* @__PURE__ */ new Set();
  for (const p of products) {
    const nameWords = tokenizeQuery(p.name);
    for (const w of nameWords) {
      if (w.length >= 3) vocab.add(w);
    }
    if (p.brand) {
      const brandWords = tokenizeQuery(p.brand);
      for (const w of brandWords) {
        if (w.length >= 3) vocab.add(w);
      }
    }
    if (p.tags) {
      for (const t of p.tags) {
        const tagWords = tokenizeQuery(t);
        for (const w of tagWords) {
          if (w.length >= 3) vocab.add(w);
        }
      }
    }
    if (p.category) {
      const catWords = tokenizeQuery(p.category);
      for (const w of catWords) {
        if (w.length >= 3) vocab.add(w);
      }
    }
  }
  const canonicalKeywords = [
    "arduino",
    "uno",
    "nano",
    "mega",
    "raspberry",
    "pico",
    "esp32",
    "stm32",
    "stm32f4",
    "relay",
    "speaker",
    "resistor",
    "capacitor",
    "temperature",
    "sensor",
    "microcontroller",
    "mcu",
    "oled",
    "lcd",
    "bluetooth",
    "wifi",
    "battery",
    "chassis",
    "servo",
    "motor"
  ];
  for (const k of canonicalKeywords) vocab.add(k);
  return Array.from(vocab);
}
function getSpellingSuggestion(query, dictionary) {
  const norm = normalizeSearchText(query);
  if (!norm || norm.length < 4) return null;
  const words = norm.split(" ");
  let wasCorrected = false;
  const correctedWords = [];
  for (const word of words) {
    if (word.length < 4) {
      correctedWords.push(word);
      continue;
    }
    if (dictionary.includes(word)) {
      correctedWords.push(word);
      continue;
    }
    let bestMatch = word;
    let minDistance = 999;
    for (const dictWord of dictionary) {
      if (Math.abs(dictWord.length - word.length) > 2) continue;
      const dist = damerauLevenshtein(word, dictWord);
      const maxAllowed = word.length >= 6 ? 2 : 1;
      if (dist <= maxAllowed && dist < minDistance) {
        minDistance = dist;
        bestMatch = dictWord;
      }
    }
    if (bestMatch !== word && minDistance <= 2) {
      correctedWords.push(bestMatch);
      wasCorrected = true;
    } else {
      correctedWords.push(word);
    }
  }
  if (wasCorrected) {
    return correctedWords.join(" ");
  }
  return null;
}
function expandTokensWithSynonyms(tokens, fullQueryNorm) {
  const expanded = new Set(tokens);
  if (ELECTRONICS_SYNONYMS[fullQueryNorm]) {
    for (const syn of ELECTRONICS_SYNONYMS[fullQueryNorm]) {
      tokenizeQuery(syn).forEach((t) => expanded.add(t));
    }
  }
  for (const token of tokens) {
    if (ELECTRONICS_SYNONYMS[token]) {
      for (const syn of ELECTRONICS_SYNONYMS[token]) {
        tokenizeQuery(syn).forEach((t) => expanded.add(t));
      }
    }
  }
  return Array.from(expanded);
}
function scoreProduct(product, rawQuery, normalizedQuery, tokens, expandedTokens, config) {
  let score = 0;
  const matchedFields = [];
  let snippet;
  const nameNorm = normalizeSearchText(product.name);
  const skuNorm = normalizeSearchText(product.sku);
  const brandNorm = normalizeSearchText(product.brand || "");
  const catNorm = normalizeSearchText(product.category || "");
  const subcatNorm = normalizeSearchText(product.subcategory || "");
  const descNorm = normalizeSearchText(product.description || "");
  const shortDescNorm = normalizeSearchText(product.shortDescription || "");
  const tagsNorm = (product.tags || []).map((t) => normalizeSearchText(t));
  const specTokens = [];
  if (product.specifications && Array.isArray(product.specifications)) {
    for (const spec of product.specifications) {
      specTokens.push(normalizeSearchText(`${spec.name} ${spec.value}`));
    }
  }
  const allSpecsText = specTokens.join(" ");
  if (nameNorm === normalizedQuery) {
    score += config.weights.exactNameMatch;
    matchedFields.push("name_exact");
  } else if (nameNorm.startsWith(normalizedQuery)) {
    score += config.weights.nameStartsWith;
    matchedFields.push("name_prefix");
  } else if (nameNorm.includes(normalizedQuery)) {
    score += config.weights.nameWordMatch;
    matchedFields.push("name_contains");
  }
  if (skuNorm === normalizedQuery) {
    score += config.weights.exactSkuMatch;
    matchedFields.push("sku_exact");
  } else if (skuNorm.startsWith(normalizedQuery)) {
    score += config.weights.skuStartsWith;
    matchedFields.push("sku_prefix");
  } else if (skuNorm.includes(normalizedQuery)) {
    score += config.weights.skuStartsWith * 0.7;
    matchedFields.push("sku_contains");
  }
  let nameMatchesAll = true;
  for (const token of tokens) {
    if (nameNorm.includes(token)) {
      score += 20;
    } else {
      nameMatchesAll = false;
    }
  }
  if (nameMatchesAll && tokens.length > 1) {
    score += 25;
    if (!matchedFields.includes("name_contains")) matchedFields.push("name_contains");
  }
  if (brandNorm && (brandNorm === normalizedQuery || brandNorm.startsWith(normalizedQuery))) {
    score += config.weights.brandMatch;
    matchedFields.push("brand");
  } else if (brandNorm && brandNorm.includes(normalizedQuery)) {
    score += config.weights.brandMatch * 0.7;
    matchedFields.push("brand");
  } else {
    for (const token of tokens) {
      if (brandNorm.includes(token)) {
        score += 15;
        if (!matchedFields.includes("brand")) matchedFields.push("brand");
      }
    }
  }
  if (catNorm.includes(normalizedQuery) || subcatNorm.includes(normalizedQuery)) {
    score += config.weights.categoryMatch;
    matchedFields.push("category");
  } else {
    for (const token of tokens) {
      if (catNorm.includes(token) || subcatNorm.includes(token)) {
        score += 10;
        if (!matchedFields.includes("category")) matchedFields.push("category");
      }
    }
  }
  for (const tag of tagsNorm) {
    if (tag === normalizedQuery) {
      score += config.weights.tagMatch * 1.5;
      if (!matchedFields.includes("tag")) matchedFields.push("tag");
    } else if (tag.includes(normalizedQuery)) {
      score += config.weights.tagMatch;
      if (!matchedFields.includes("tag")) matchedFields.push("tag");
    } else {
      for (const token of tokens) {
        if (tag.includes(token)) {
          score += 8;
          if (!matchedFields.includes("tag")) matchedFields.push("tag");
        }
      }
    }
  }
  if (allSpecsText.includes(normalizedQuery)) {
    score += config.weights.specMatch;
    matchedFields.push("specifications");
    const matchedSpec = product.specifications?.find(
      (s) => normalizeSearchText(`${s.name} ${s.value}`).includes(normalizedQuery)
    );
    if (matchedSpec) {
      snippet = `${matchedSpec.name}: ${matchedSpec.value}`;
    }
  } else {
    let specHits = 0;
    for (const token of tokens) {
      if (allSpecsText.includes(token)) {
        score += 12;
        specHits++;
      }
    }
    if (specHits > 0 && !matchedFields.includes("specifications")) {
      matchedFields.push("specifications");
    }
  }
  if (descNorm.includes(normalizedQuery) || shortDescNorm.includes(normalizedQuery)) {
    score += config.weights.descriptionMatch;
    if (!matchedFields.includes("description")) matchedFields.push("description");
  } else {
    for (const token of tokens) {
      if (descNorm.includes(token) || shortDescNorm.includes(token)) {
        score += 5;
        if (!matchedFields.includes("description")) matchedFields.push("description");
      }
    }
  }
  if (expandedTokens.length > tokens.length) {
    for (const synToken of expandedTokens) {
      if (tokens.includes(synToken)) continue;
      if (nameNorm.includes(synToken)) {
        score += 18;
        if (!matchedFields.includes("synonym_name")) matchedFields.push("synonym_name");
      }
      if (allSpecsText.includes(synToken)) {
        score += 15;
        if (!matchedFields.includes("synonym_spec")) matchedFields.push("synonym_spec");
      }
      if (tagsNorm.some((t) => t.includes(synToken))) {
        score += 12;
        if (!matchedFields.includes("synonym_tag")) matchedFields.push("synonym_tag");
      }
    }
  }
  if (score > 0) {
    if (product.inStock && product.stockCount > 0) {
      score += config.inStockBoost;
    } else {
      score += config.outOfStockPenalty;
    }
  }
  return {
    score: Math.max(0, score),
    matchedFields,
    snippet
  };
}
function searchProducts(products, rawQuery, options = {}) {
  const config = { ...DEFAULT_SEARCH_CONFIG, ...options.config || {} };
  const rawClean = rawQuery.trim();
  if (!rawClean) {
    return {
      query: "",
      normalizedQuery: "",
      total: 0,
      results: [],
      didYouMean: null,
      matchingCategories: [],
      matchingBrands: []
    };
  }
  const normalizedQuery = normalizeSearchText(rawClean);
  const tokens = tokenizeQuery(rawClean);
  const expandedTokens = expandTokensWithSynonyms(tokens, normalizedQuery);
  const hits = [];
  const matchingCategoriesSet = /* @__PURE__ */ new Set();
  const matchingBrandsSet = /* @__PURE__ */ new Set();
  for (const product of products) {
    if (options.category && options.category !== "all" && options.category !== "All") {
      if (product.category.toLowerCase() !== options.category.toLowerCase()) {
        continue;
      }
    }
    if (options.inStockOnly && (!product.inStock || product.stockCount <= 0)) {
      continue;
    }
    if (options.minPrice !== void 0 && product.price < options.minPrice) continue;
    if (options.maxPrice !== void 0 && product.price > options.maxPrice) continue;
    const { score, matchedFields, snippet } = scoreProduct(
      product,
      rawClean,
      normalizedQuery,
      tokens,
      expandedTokens,
      config
    );
    if (score > 0) {
      hits.push({
        product,
        score,
        matchedFields,
        snippet
      });
      if (product.category) matchingCategoriesSet.add(product.category);
      if (product.brand) matchingBrandsSet.add(product.brand);
    }
  }
  let didYouMean = null;
  const dictionary = extractCatalogDictionary(products);
  if (hits.length < 2) {
    const suggestion = getSpellingSuggestion(rawClean, dictionary);
    if (suggestion && normalizeSearchText(suggestion) !== normalizedQuery) {
      didYouMean = suggestion;
      if (hits.length === 0) {
        const suggestionNorm = normalizeSearchText(suggestion);
        const suggestionTokens = tokenizeQuery(suggestion);
        const suggestionExpanded = expandTokensWithSynonyms(suggestionTokens, suggestionNorm);
        for (const product of products) {
          const { score, matchedFields, snippet } = scoreProduct(
            product,
            suggestion,
            suggestionNorm,
            suggestionTokens,
            suggestionExpanded,
            config
          );
          if (score > 0) {
            hits.push({
              product,
              score: Math.max(1, score * 0.8),
              // slight penalty for fuzzy correction
              matchedFields: [...matchedFields, "fuzzy_spelling"],
              snippet
            });
            if (product.category) matchingCategoriesSet.add(product.category);
            if (product.brand) matchingBrandsSet.add(product.brand);
          }
        }
      }
    }
  }
  hits.sort((a, b) => b.score - a.score);
  const limit = options.limit || config.autocompleteLimit;
  const finalResults = options.limit !== void 0 || limit ? hits.slice(0, limit) : hits;
  return {
    query: rawClean,
    normalizedQuery,
    total: hits.length,
    results: finalResults,
    didYouMean,
    matchingCategories: Array.from(matchingCategoriesSet),
    matchingBrands: Array.from(matchingBrandsSet)
  };
}

// server.ts
import_dotenv.default.config();
var app2 = (0, import_express.default)();
var PORT = Number(process.env.PORT) || 3e3;
var buildFallbackProductDescription = (productName, category) => {
  const cleanName = productName.trim();
  const cleanCategory = category.trim() || "electronic component";
  const normalizedCategory = cleanCategory.toLowerCase();
  const voltageHints = ["3.3V", "5V", "12V", "24V"];
  const interfaceHints = ["GPIO", "I2C", "SPI", "UART", "USB-C", "PWM", "ADC"];
  const mountingHints = ["PCB mount", "through-hole", "SMD mounting", "panel mount"];
  const useCases = ["embedded systems", "industrial automation", "prototyping", "power management", "signal conditioning"];
  const voltage = voltageHints[Math.abs(cleanName.length) % voltageHints.length];
  const interfaceType = interfaceHints[Math.abs(cleanName.length * 2) % interfaceHints.length];
  const mount = mountingHints[Math.abs(cleanName.length + 3) % mountingHints.length];
  const useCase = useCases[Math.abs(cleanName.length + 7) % useCases.length];
  return `${cleanName} is a ${normalizedCategory} engineered for dependable performance in modern electronics applications. Designed for integration into control systems, embedded platforms, and prototype builds, it delivers stable operation with a nominal voltage rating of ${voltage} and support for ${interfaceType}-based communication or signal handling. The device is constructed for practical deployment in demanding environments and is well suited for ${useCase} workflows. It features ${mount} compatibility and a compact, service-friendly form factor that simplifies installation, maintenance, and system scaling. This product is ideal for engineering teams, OEM integrations, and technical buyers who require reliable hardware performance, repeatable results, and efficient compatibility across electronic systems.`;
};
app2.use(import_express.default.json({ limit: "15mb" }));
app2.post("/api/ai/product-description", async (req, res) => {
  const productName = typeof req.body?.productName === "string" ? req.body.productName.trim() : "";
  const category = typeof req.body?.category === "string" ? req.body.category.trim() : "";
  if (!productName || !category) {
    return res.status(400).json({ success: false, error: "Product name and category are required." });
  }
  if (productName.length > 200 || category.length > 160) {
    return res.status(400).json({ success: false, error: "Product name or category is too long." });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const fallbackDescription = buildFallbackProductDescription(productName, category);
    return res.json({ success: true, description: fallbackDescription });
  }
  try {
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Research the product online using Google Search and write a professional electronics catalog description for SEMIX LABS.

Product title: ${productName}
Category: ${category}

Requirements:
- Use a professional, technical, electronics-focused tone suitable for engineers and buyers.
- Include verified technical details when available from official sources or trusted product listings, such as voltage rating, current rating, pin count / pinout, package type, operating voltage, interface, mounting type, compatibility, power requirements, and application use cases.
- Write in clear prose with short point-wise technical bullets when useful.
- If a detail is not confidently verified, do not invent it. State it as "varies by variant" or omit it.
- Do not write childish, vague, or salesy filler. Keep it precise, technical, and catalog-ready.
- Do not mention that you are using Google Search or AI.
- Keep the output in plain text and make it easy to paste into a product page.

Formatting:
- 2 short paragraphs or 4-8 concise technical bullet points with one brief intro sentence.
- Make it specific to the product category and technical buyer.`,
      config: {
        temperature: 0.2,
        tools: [{ googleSearch: {} }]
      }
    });
    const description = result.text?.trim();
    if (!description) {
      return res.json({
        success: true,
        description: buildFallbackProductDescription(productName, category)
      });
    }
    return res.json({ success: true, description });
  } catch (err) {
    console.error("[AI] Product description generation failed:", err?.message || err);
    return res.json({
      success: true,
      description: buildFallbackProductDescription(productName, category)
    });
  }
});
function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new import_razorpay.default({ key_id: keyId, key_secret: keySecret });
}
app2.post("/api/payments/razorpay/order", async (req, res) => {
  const amount = Number(req.body?.amount);
  const receipt = String(req.body?.receipt || "").slice(0, 40);
  if (!Number.isFinite(amount) || amount <= 0 || !receipt) {
    return res.status(400).json({ success: false, error: "A valid amount and receipt are required." });
  }
  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return res.status(503).json({ success: false, error: "Razorpay is not configured on the server." });
  }
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt
    });
    return res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("[Razorpay] Failed to create order:", err);
    return res.status(502).json({ success: false, error: "Unable to start Razorpay checkout." });
  }
});
app2.post("/api/payments/razorpay/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: "Incomplete Razorpay payment details." });
  }
  const expectedSignature = import_crypto.default.createHmac("sha256", keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const receivedSignature = String(razorpay_signature);
  if (expectedSignature.length !== receivedSignature.length || !import_crypto.default.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature))) {
    return res.status(400).json({ success: false, error: "Razorpay payment verification failed." });
  }
  return res.json({ success: true, paymentId: razorpay_payment_id });
});
var uploadsDir = import_path.default.join(process.cwd(), "public", "uploads");
if (!import_fs.default.existsSync(uploadsDir)) {
  import_fs.default.mkdirSync(uploadsDir, { recursive: true });
}
["banners", "categories"].forEach((sub) => {
  const subDir = import_path.default.join(uploadsDir, sub);
  if (!import_fs.default.existsSync(subDir)) {
    import_fs.default.mkdirSync(subDir, { recursive: true });
  }
});
app2.use("/uploads", import_express.default.static(uploadsDir));
function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  if (!user || !pass) {
    return null;
  }
  return import_nodemailer.default.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
}
function isResendSkipped() {
  const value = String(process.env.SKIP_RESEND_EMAIL ?? "").trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes" || value === "on";
}
function buildOrderConfirmationText(order) {
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) : "N/A";
  const customerName = order?.customer?.fullName || "Customer";
  const items = Array.isArray(order?.items) ? order.items : [];
  const lines = items.map((item) => `${item.name} x${item.quantity} @ \u20B9${Number(item.price || 0).toLocaleString("en-IN")} = \u20B9${Number((item.price || 0) * (item.quantity || 0)).toLocaleString("en-IN")}`);
  return [
    "SEMIX LABS \u2014 Order Confirmed",
    "",
    `Hello ${customerName},`,
    "Thank you for shopping with SEMIX LABS.",
    `Your order has been successfully confirmed.`,
    `Order ID: #${order?.id || "N/A"}`,
    `Order Date: ${orderDate}`,
    `Payment Status: ${order?.paymentStatus || "Paid"}`,
    "",
    "ORDER SUMMARY",
    ...lines,
    "",
    `Subtotal: \u20B9${Number(order?.subtotal || 0).toLocaleString("en-IN")}`,
    `Shipping: \u20B9${Number(order?.shippingFee || 0).toLocaleString("en-IN")}`,
    `Discount: -\u20B9${Number(order?.discount || 0).toLocaleString("en-IN")}`,
    `Total: \u20B9${Number(order?.finalTotal ?? order?.totalAmount ?? 0).toLocaleString("en-IN")}`,
    "",
    "DELIVERY ADDRESS",
    `${order?.customer?.fullName || ""}`,
    `${order?.customer?.street || ""}`,
    `${order?.customer?.city || ""}, ${order?.customer?.state || ""} - ${order?.customer?.pincode || ""}`,
    `Phone: ${order?.customer?.phone || ""}`,
    "",
    "We'll notify you when your order is shipped.",
    "",
    "Thank you for choosing SEMIX LABS."
  ].filter(Boolean).join("\n");
}
function buildResendOrderConfirmationHtml(order) {
  const customerName = order?.customer?.fullName || "Customer";
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) : "N/A";
  const subtotal = Number(order?.subtotal || 0);
  const shippingFee = Number(order?.shippingFee || 0);
  const discount = Number(order?.discount || 0);
  const total = Number(order?.finalTotal ?? order?.totalAmount ?? 0);
  const addressLines = [
    order?.customer?.fullName || "",
    order?.customer?.street || "",
    `${order?.customer?.city || ""}, ${order?.customer?.state || ""} - ${order?.customer?.pincode || ""}`,
    `Phone: ${order?.customer?.phone || ""}`,
    `Email: ${order?.customer?.email || ""}`
  ].filter(Boolean);
  const itemRows = (Array.isArray(order?.items) ? order.items : []).map((item) => {
    const unitTotal = Number((item.price || 0) * (item.quantity || 0));
    return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;">${String(item.name || "Product")}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #334155;">${Number(item.quantity || 0)}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px; color: #334155;">\u20B9${Number(item.price || 0).toLocaleString("en-IN")}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 13px; font-weight: 700; color: #0f172a;">\u20B9${unitTotal.toLocaleString("en-IN")}</td>
      </tr>
    `;
  }).join("");
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a;">
    <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #561269 0%, #3b074a 100%); padding: 28px 24px; color: white; text-align: center;">
        <div style="font-size: 11px; letter-spacing: 1.8px; text-transform: uppercase; opacity: 0.9;">SEMIX LABS</div>
        <h1 style="margin: 12px 0 8px; font-size: 30px; line-height: 1.2;">Order Confirmed \u{1F389}</h1>
        <p style="margin: 0; font-size: 14px; opacity: 0.92;">Hello ${customerName}, thank you for shopping with SEMIX LABS.</p>
      </div>
      <div style="padding: 28px 24px;">
        <p style="margin: 0 0 18px; font-size: 14px; color: #334155;">Your order has been successfully confirmed.</p>
        <div style="margin-bottom: 22px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Order ID</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">#${order?.id || "N/A"}</div>
          </div>
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Order Date</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${orderDate}</div>
          </div>
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Payment Status</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${order?.paymentStatus || "Paid"}</div>
          </div>
          <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Payment Method</div>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${order?.paymentMethod || "UPI"}</div>
          </div>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #0f172a;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: left; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Product</th>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Unit Price</th>
              <th style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 8px;"><span>Subtotal</span><span>\u20B9${subtotal.toLocaleString("en-IN")}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: 8px;"><span>Shipping</span><span>\u20B9${shippingFee.toLocaleString("en-IN")}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #15803d; margin-bottom: 8px;"><span>Discount</span><span>-\u20B9${discount.toLocaleString("en-IN")}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #561269; padding-top: 12px; border-top: 1px solid #e9d5ff;"><span>Total</span><span>\u20B9${total.toLocaleString("en-IN")}</span></div>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #0f172a;">Delivery Address</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; color: #334155; line-height: 1.6;">${addressLines.map((line) => `<div>${line}</div>`).join("")}</div>
        <p style="margin: 24px 0 0; font-size: 14px; color: #334155;">We\u2019ll notify you when your order is shipped.</p>
      </div>
      <div style="padding: 20px 24px 28px; text-align: center; border-top: 1px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 12px;">
        Thank you for choosing SEMIX LABS.<br />Electronics Components & Solutions
      </div>
    </div>
  </div>
  `;
}
async function sendResendOrderConfirmationEmail(order) {
  if (!order || !order.customer?.email) {
    console.warn("[Resend] Customer email missing; skipping confirmation email.");
    return { sent: false, message: "Customer email missing." };
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Resend] No RESEND_API_KEY configured; skipping confirmation email.");
    return { sent: false, message: "RESEND_API_KEY not configured." };
  }
  if (isResendSkipped()) {
    console.log("[Resend] Development skip enabled; order confirmation email not sent.");
    return { sent: false, message: "Development email sending skipped." };
  }
  try {
    const resend = new import_resend.Resend(apiKey);
    const html = buildResendOrderConfirmationHtml(order);
    const text = buildOrderConfirmationText(order);
    const response = await resend.emails.send({
      from: "office@semixlabs.com",
      to: [order.customer.email],
      subject: `SEMIX LABS \u2014 Order Confirmed #${order.id}`,
      html,
      text
    });
    if (response.error) {
      const errorMessage = response.error?.message || "Unknown Resend error.";
      console.error("[Resend] Email failed:", errorMessage);
      return { sent: false, message: errorMessage };
    }
    console.log(`[Resend] Order confirmation email sent for order ${order.id}`);
    return { sent: true, message: "Resend email sent." };
  } catch (error) {
    console.error("[Resend] Exception while sending confirmation email:", error?.message || error);
    return { sent: false, message: error?.message || "Unknown exception." };
  }
}
app2.get("/api/email-status", (req, res) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const configured = Boolean(user && pass);
  res.json({
    configured,
    provider: host.includes("gmail") ? "Gmail SMTP" : "Custom SMTP",
    user: user ? user.replace(/(.{3})(.*)(@.*)/, "$1***$3") : null,
    targetAdmin: "aryangandhale27@gmail.com",
    message: configured ? "SMTP transport active and ready to deliver real physical emails to Gmail." : "SMTP credentials not configured. In-app and Firestore mail queues are active. Set SMTP_USER and SMTP_PASS in Settings to deliver physical emails to Gmail."
  });
});
app2.post("/api/send-email", async (req, res) => {
  const { to, subject, html, text, recipientType, orderId, orderData } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameters: to, subject, html"
    });
  }
  const recipients = Array.isArray(to) ? to : [to];
  const normalizedType = recipientType || "customer";
  if (normalizedType === "customer" && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() && !isResendSkipped()) {
    const resendResult = await sendResendOrderConfirmationEmail(
      orderData || { customer: { email: recipients[0] }, id: orderId, paymentStatus: "Paid" }
    );
    if (resendResult.sent) {
      return res.json({
        success: true,
        delivered: true,
        mode: "resend",
        message: resendResult.message,
        recipients,
        orderId
      });
    }
    console.warn("[Email Dispatcher] Resend send failed; falling back to SMTP if configured.", {
      orderId,
      recipients
    });
  }
  if (normalizedType === "customer" && isResendSkipped()) {
    console.log("[Email Dispatcher] SKIP_RESEND_EMAIL enabled; customer Resend dispatch skipped.");
  }
  const transporter = getTransporter();
  if (!transporter) {
    console.log(
      `[Email Dispatcher] Notice: SMTP not configured. Transaction queued for: ${recipients.join(
        ", "
      )} | Subject: ${subject}`
    );
    return res.json({
      success: true,
      delivered: false,
      mode: "queued_in_app",
      message: "Email queued in Firestore and local dispatcher. To receive real emails in your Gmail inbox, configure SMTP_USER & SMTP_PASS in Settings.",
      recipients,
      orderId
    });
  }
  try {
    const fromAddress = process.env.EMAIL_FROM || `"SEMIX LABS Electronics" <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipients.join(", "),
      subject,
      html,
      text: text || "Please view this order email in an HTML-compatible client."
    });
    console.log(`[Email Dispatcher] Real email delivered to ${recipients.join(", ")}. MessageId: ${info.messageId}`);
    return res.json({
      success: true,
      delivered: true,
      messageId: info.messageId,
      recipients,
      orderId
    });
  } catch (err) {
    console.error("[Email Dispatcher] SMTP error when sending to", recipients, err);
    return res.status(500).json({
      success: false,
      delivered: false,
      error: err.message || "Failed to dispatch email through SMTP transport.",
      recipients,
      orderId
    });
  }
});
app2.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app2.get("/api/products/search", (req, res) => {
  const query = req.query.q || "";
  const category = req.query.category || void 0;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : void 0;
  const inStockOnly = req.query.inStock === "true";
  const results = searchProducts(INITIAL_PRODUCTS, query, {
    category,
    limit,
    inStockOnly
  });
  res.json({
    success: true,
    data: results
  });
});
app2.post("/api/admin/upload-image", (req, res) => {
  try {
    const { imageBase64, filename, folder = "banners" } = req.body;
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({
        success: false,
        error: "No image data provided."
      });
    }
    const targetFolder = folder === "categories" ? "categories" : "banners";
    const destinationDir = import_path.default.join(uploadsDir, targetFolder);
    if (!import_fs.default.existsSync(destinationDir)) {
      import_fs.default.mkdirSync(destinationDir, { recursive: true });
    }
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        error: "Invalid image format. Must be a valid base64 data URL."
      });
    }
    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];
    const ALLOWED_MIMES = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp"
    };
    if (!ALLOWED_MIMES[mimeType]) {
      return res.status(400).json({
        success: false,
        error: "Unsupported image type. Only JPG, PNG, and WEBP are supported."
      });
    }
    const buffer = Buffer.from(base64Data, "base64");
    const MAX_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      return res.status(400).json({
        success: false,
        error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of 5MB.`
      });
    }
    const ext = ALLOWED_MIMES[mimeType];
    const cleanBaseName = (filename || "image").replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 40);
    const uniqueFilename = `${cleanBaseName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = import_path.default.join(destinationDir, uniqueFilename);
    import_fs.default.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${targetFolder}/${uniqueFilename}`;
    console.log(`[Storage] Saved uploaded image to ${publicUrl} (${buffer.length} bytes)`);
    return res.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: buffer.length,
      mimeType
    });
  } catch (err) {
    console.error("[Storage] Error saving uploaded image:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to save uploaded image."
    });
  }
});
app2.delete("/api/admin/delete-image", (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
      return res.status(400).json({
        success: false,
        error: "Invalid file URL."
      });
    }
    const safeRelPath = import_path.default.normalize(url.replace("/uploads/", "")).replace(/^(\.\.[\/\\])+/, "");
    const filePath = import_path.default.join(uploadsDir, safeRelPath);
    if (import_fs.default.existsSync(filePath)) {
      import_fs.default.unlinkSync(filePath);
      console.log(`[Storage] Deleted image at ${filePath}`);
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("[Storage] Error deleting image:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to delete image."
    });
  }
});
var dataDir = import_path.default.join(process.cwd(), "data");
if (!import_fs.default.existsSync(dataDir)) {
  import_fs.default.mkdirSync(dataDir, { recursive: true });
}
var bonusFilePath = import_path.default.join(dataDir, "seller-bonuses.json");
var INITIAL_BONUSES = {
  "usr-seller-01": {
    sellerId: "usr-seller-01",
    sellerName: "Vikram Patel",
    sellerEmail: "seller@semixlabs.com",
    bonusAmount: 5e3,
    previousBonus: 0,
    updatedBy: "Admin Controller",
    updatedAt: "2026-09-01T10:00:00.000Z",
    history: [
      {
        previousBonus: 0,
        newBonus: 5e3,
        updatedBy: "Admin Controller",
        updatedAt: "2026-09-01T10:00:00.000Z"
      }
    ]
  },
  "usr-seller-02": {
    sellerId: "usr-seller-02",
    sellerName: "Priya Sharma (ElectroComponents Hub)",
    sellerEmail: "priya.sharma@semixlabs.com",
    bonusAmount: 2500,
    previousBonus: 0,
    updatedBy: "Admin Controller",
    updatedAt: "2026-09-02T14:30:00.000Z",
    history: [
      {
        previousBonus: 0,
        newBonus: 2500,
        updatedBy: "Admin Controller",
        updatedAt: "2026-09-02T14:30:00.000Z"
      }
    ]
  },
  "usr-seller-03": {
    sellerId: "usr-seller-03",
    sellerName: "Rajesh Nair (MicroSilicon Express)",
    sellerEmail: "rajesh.nair@semixlabs.com",
    bonusAmount: 1e4,
    previousBonus: 5e3,
    updatedBy: "Admin Controller",
    updatedAt: "2026-09-05T09:15:00.000Z",
    history: [
      {
        previousBonus: 0,
        newBonus: 5e3,
        updatedBy: "Admin Controller",
        updatedAt: "2026-08-15T09:00:00.000Z"
      },
      {
        previousBonus: 5e3,
        newBonus: 1e4,
        updatedBy: "Admin Controller",
        updatedAt: "2026-09-05T09:15:00.000Z"
      }
    ]
  },
  "usr-seller-04": {
    sellerId: "usr-seller-04",
    sellerName: "Ananya Desai (Silicon Valley Hub)",
    sellerEmail: "ananya.desai@semixlabs.com",
    bonusAmount: 7500,
    previousBonus: 0,
    updatedBy: "Admin Controller",
    updatedAt: "2026-09-08T11:45:00.000Z",
    history: [
      {
        previousBonus: 0,
        newBonus: 7500,
        updatedBy: "Admin Controller",
        updatedAt: "2026-09-08T11:45:00.000Z"
      }
    ]
  }
};
function loadBonuses() {
  try {
    if (import_fs.default.existsSync(bonusFilePath)) {
      const data = import_fs.default.readFileSync(bonusFilePath, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === "object") {
        return { ...INITIAL_BONUSES, ...parsed };
      }
    }
  } catch (err) {
    console.warn("[Bonuses] Error reading persistent bonus file, using fallback in-memory store:", err);
  }
  return { ...INITIAL_BONUSES };
}
function saveBonuses(bonuses) {
  try {
    import_fs.default.writeFileSync(bonusFilePath, JSON.stringify(bonuses, null, 2), "utf-8");
  } catch (err) {
    console.error("[Bonuses] Error saving bonuses to persistent file:", err);
  }
}
app2.all(["/api/seller/bonus", "/api/seller/bonus/*"], (req, res, next) => {
  if (["PUT", "POST", "PATCH", "DELETE"].includes(req.method)) {
    return res.status(403).json({
      success: false,
      error: "Sellers have read-only access to bonuses. Modifying bonuses is strictly restricted to authorized platform administrators."
    });
  }
  next();
});
app2.get("/api/admin/bonuses", (req, res) => {
  const userRole = req.headers["x-user-role"] || "";
  if (userRole !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied: Admin role required to view seller bonus management."
    });
  }
  const bonuses = loadBonuses();
  return res.json({
    success: true,
    data: Object.values(bonuses)
  });
});
app2.put("/api/admin/bonuses/:sellerId", (req, res) => {
  const userRole = req.headers["x-user-role"] || "";
  if (userRole !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied: Sellers are not permitted to modify bonuses. Only authorized administrators can manage seller bonuses."
    });
  }
  const { sellerId } = req.params;
  const { bonusAmount, sellerName, sellerEmail, updatedBy } = req.body;
  if (bonusAmount === void 0 || bonusAmount === null || bonusAmount === "") {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid bonus amount."
    });
  }
  const strVal = String(bonusAmount).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(strVal)) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid bonus amount."
    });
  }
  const numAmount = Number(strVal);
  if (isNaN(numAmount) || !isFinite(numAmount) || numAmount < 0) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid bonus amount."
    });
  }
  try {
    const bonuses = loadBonuses();
    const existing = bonuses[sellerId];
    const previousBonus = existing ? existing.bonusAmount : 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const adminUser = updatedBy || req.headers["x-user-name"] || "Admin Controller";
    const history = existing && Array.isArray(existing.history) ? [...existing.history] : [];
    history.unshift({
      previousBonus,
      newBonus: numAmount,
      updatedBy: adminUser,
      updatedAt: now
    });
    const updatedRecord = {
      sellerId,
      sellerName: sellerName || existing && existing.sellerName || "Seller Hub",
      sellerEmail: sellerEmail || existing && existing.sellerEmail || "seller@semixlabs.com",
      bonusAmount: numAmount,
      previousBonus,
      updatedBy: adminUser,
      updatedAt: now,
      history: history.slice(0, 30)
    };
    bonuses[sellerId] = updatedRecord;
    saveBonuses(bonuses);
    saveActivityLog({
      logId: `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: now,
      userId: req.headers["x-user-id"] || "usr-admin-01",
      userEmail: req.headers["x-user-email"] || "aryangandhale27@gmail.com",
      userName: adminUser,
      userRole: "admin",
      actionType: "BONUS_ALLOCATION",
      targetEntity: "seller_bonuses",
      targetId: sellerId,
      changes: {
        diffs: {
          bonusAmount: { oldValue: previousBonus, newValue: numAmount }
        },
        affectedFields: ["bonusAmount"],
        summary: `Admin updated bonus for ${updatedRecord.sellerName} from \u20B9${previousBonus.toLocaleString("en-IN")} to \u20B9${numAmount.toLocaleString("en-IN")}`
      },
      metadata: {
        source: "express_api",
        route: `/api/admin/bonuses/${sellerId}`
      }
    });
    console.log(`[Bonuses] Admin '${adminUser}' updated bonus for seller ${sellerId} (${updatedRecord.sellerName}) from \u20B9${previousBonus} to \u20B9${numAmount}`);
    return res.json({
      success: true,
      message: "Bonus updated successfully.",
      data: updatedRecord
    });
  } catch (err) {
    console.error("[Bonuses] Error updating seller bonus:", err);
    return res.status(500).json({
      success: false,
      error: "Unable to update bonus. Please try again."
    });
  }
});
app2.get("/api/seller/bonus", (req, res) => {
  const userRole = req.headers["x-user-role"] || "";
  const userId = req.headers["x-user-id"] || "";
  const querySellerId = req.query.sellerId || userId || "usr-seller-01";
  if (userRole === "seller" && userId && querySellerId !== userId) {
    return res.status(403).json({
      success: false,
      error: "Access denied: Sellers are strictly restricted to viewing only their own bonus."
    });
  }
  const bonuses = loadBonuses();
  const record = bonuses[querySellerId] || {
    sellerId: querySellerId,
    sellerName: "Seller Hub",
    sellerEmail: "seller@semixlabs.com",
    bonusAmount: 0,
    previousBonus: 0,
    updatedBy: "Admin Controller",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return res.json({
    success: true,
    data: record
  });
});
app2.get("/api/seller/bonus/:sellerId", (req, res) => {
  const { sellerId } = req.params;
  const userRole = req.headers["x-user-role"] || "";
  const userId = req.headers["x-user-id"] || "";
  if (userRole === "seller" && userId && userId !== sellerId) {
    return res.status(403).json({
      success: false,
      error: "Access denied: Sellers are strictly restricted to viewing only their own bonus."
    });
  }
  const bonuses = loadBonuses();
  const record = bonuses[sellerId] || {
    sellerId,
    sellerName: "Seller Hub",
    sellerEmail: "seller@semixlabs.com",
    bonusAmount: 0,
    previousBonus: 0,
    updatedBy: "Admin Controller",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  return res.json({
    success: true,
    data: record
  });
});
var activityLogsFilePath = import_path.default.join(dataDir, "activity-logs.json");
var INITIAL_AUDIT_LOGS = [
  {
    logId: "log_seed_001",
    timestamp: "2026-09-08T11:45:00.000Z",
    userId: "usr-admin-01",
    userEmail: "aryangandhale27@gmail.com",
    userName: "Aryan Gandhale",
    userRole: "admin",
    actionType: "BONUS_ALLOCATION",
    targetEntity: "seller_bonuses",
    targetId: "usr-seller-04",
    changes: {
      diffs: {
        bonusAmount: { oldValue: 0, newValue: 7500 }
      },
      affectedFields: ["bonusAmount"],
      summary: "Allocated \u20B97,500 festive fulfillment incentive to Pune Circuit Hub"
    },
    metadata: {
      source: "web_client",
      reason: "Q3 High SLA Performance Bonus",
      route: "/admin"
    }
  },
  {
    logId: "log_seed_002",
    timestamp: "2026-09-05T09:15:00.000Z",
    userId: "usr-admin-01",
    userEmail: "aryangandhale27@gmail.com",
    userName: "Aryan Gandhale",
    userRole: "admin",
    actionType: "UPDATE",
    targetEntity: "banners",
    targetId: "banner-01",
    changes: {
      diffs: {
        title: { oldValue: "Electronics Hardware", newValue: "Next-Gen Edge AI Silicon Modules" }
      },
      affectedFields: ["title"],
      summary: "Updated Homepage Front Banner headline and promotional assets"
    },
    metadata: {
      source: "web_client",
      route: "/admin"
    }
  },
  {
    logId: "log_seed_003",
    timestamp: "2026-09-03T14:20:00.000Z",
    userId: "usr-seller-01",
    userEmail: "seller@semixlabs.com",
    userName: "Vikram Patel",
    userRole: "seller",
    actionType: "STATUS_CHANGE",
    targetEntity: "orders",
    targetId: "ORD-89412",
    changes: {
      diffs: {
        status: { oldValue: "processing", newValue: "packed" }
      },
      affectedFields: ["status"],
      summary: "Seller packed order ORD-89412 with anti-static shielding"
    },
    metadata: {
      source: "web_client",
      route: "/seller"
    }
  }
];
function loadActivityLogs() {
  try {
    if (import_fs.default.existsSync(activityLogsFilePath)) {
      const data = import_fs.default.readFileSync(activityLogsFilePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[AuditLogs] Error reading activity logs file:", err);
  }
  return [...INITIAL_AUDIT_LOGS];
}
function saveActivityLog(log) {
  try {
    const logs = loadActivityLogs();
    const existingIndex = logs.findIndex((l) => l.logId === log.logId);
    if (existingIndex !== -1) {
      console.warn(`[AuditLogs] Immutability violation attempt: Log ${log.logId} already exists. Write rejected.`);
      return false;
    }
    logs.unshift(log);
    import_fs.default.writeFileSync(activityLogsFilePath, JSON.stringify(logs.slice(0, 1e3), null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[AuditLogs] Error saving activity log:", err);
    return false;
  }
}
app2.get("/api/admin/audit-logs", (req, res) => {
  const { targetEntity, userRole, actionType, targetId, limit: queryLimit } = req.query;
  let logs = loadActivityLogs();
  if (targetEntity && targetEntity !== "all") {
    logs = logs.filter((l) => l.targetEntity === targetEntity);
  }
  if (userRole && userRole !== "all") {
    logs = logs.filter((l) => l.userRole === userRole);
  }
  if (actionType && actionType !== "all") {
    logs = logs.filter((l) => l.actionType === actionType);
  }
  if (targetId) {
    logs = logs.filter((l) => String(l.targetId).toLowerCase().includes(String(targetId).toLowerCase()));
  }
  const maxItems = queryLimit ? parseInt(String(queryLimit), 10) : 100;
  return res.json({
    success: true,
    data: logs.slice(0, maxItems),
    totalCount: logs.length
  });
});
app2.post("/api/admin/audit-logs", (req, res) => {
  const { logId, userId, userRole, actionType, targetEntity, targetId, changes } = req.body;
  if (!logId || !userId || !userRole || !actionType || !targetEntity || !targetId) {
    return res.status(400).json({
      success: false,
      error: "Missing required audit log parameters."
    });
  }
  const logEntry = {
    logId,
    timestamp: req.body.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
    userId,
    userEmail: req.body.userEmail || "",
    userName: req.body.userName || "",
    userRole,
    actionType,
    targetEntity,
    targetId,
    changes: changes || { diffs: {}, affectedFields: [] },
    metadata: req.body.metadata || { source: "express_api" }
  };
  const saved = saveActivityLog(logEntry);
  if (!saved) {
    return res.status(409).json({
      success: false,
      error: "Log already exists. Audit logs are immutable and cannot be modified or replaced."
    });
  }
  return res.status(201).json({
    success: true,
    data: logEntry
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app2.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app2.use(import_express.default.static(distPath));
    app2.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app2.listen(PORT, "0.0.0.0", () => {
    console.log(`SEMIX LABS Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
