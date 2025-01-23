import {
  CarDetails,
  ClothesDetails,
  LaptopDetails,
  PhoneDetails,
} from "article/entities/article.entity";

const dimitri = {
  email: "dimitri.petrinko@consommi.tn",
  name: "Dimitri",
  lastName: "Petrinko",
  phone: "27206781",
  street: "Tahreer",
  postalCode: "3000",
  city: "sfax",
  password: "uraa",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbWl0cmkucGV0cmlua29AY29uc29tbWkudG4iLCJyb2xlIjoiY29uc3VtZXIiLCJsYXN0TmFtZSI6IlBldHJpbmtvIiwibmFtZSI6IkRpbWl0cmkiLCJpZCI6IjY2NWRjMzBmYmU0MWYxNjE1NzQ3MjcxYSIsImlhdCI6MTcxNzQyMDgxNiwiZXhwIjoxNzE4MDI1NjE2fQ.c0Rxbq0-Ex3YmtspEXp8ueXdDlE5n6kzrxgyq3lhhEQ",
};
const heisneberg = {
  email: "werner.heisenberg@consommi.tn",
  name: "Werner",
  lastName: "Heisenberg",
  phone: "93215404",
  street: "Sidi Ali",
  postalCode: "4000",
  city: "kef",
};
const admin = {
  email: "root.kali@consommi.tn",
  name: "Root",
  lastName: "Kali",
};
const vaas = {
  email: "vaas.montenegro@consommi.tn",
  name: "Vaas",
  lastName: "Montenegro",
  phone: "40418468",
  street: "tastour",
  postalCode: "5000",
  city: "beja",
};

const laptop = {
  brand: "ASUS",
  processor_brand: "Intel",
  processor_name: "Core i5",
  processor_gnrtn: "10th",
  ram_gb: "8 GB",
  ram_type: "DDR4",
  ssd: "512 GB",
  hdd: "0 GB",
  os: "Windows",
  os_bit: "32-bit",
  graphic_card_gb: "2 GB",
  weight: "Casual",
  warranty: "No warranty",
  Touchscreen: "No",
  msoffice: "No",
  rating: "3 stars",
  "Number of Ratings": 0,
  "Number of Reviews": 0,
};
const phony = {
  Brand: "LG",
  Model: "Wing",
  Storage: 256,
  RAM: 12,
  "Screen Size": 7,
  Camera: 20,
  Battery: 4000,
};
const clothe = {
  marka: "HA",
  naw3: "confy",
  "9at3a": "Shirt",
  khochn: 1.021667,
  toul: 40.8,
  "3ordh": 54.0,
  color: "red",
};

const car = {
  Titre: "neuvqdfqsdfe",
  Marque: "BMW",
  Modele: "Golf",
  Transmission: "Automatique",
  Carburant: "Diesel",
  Annee: 2020,
  Kilometrage: 90000,
};

let shapedClothe: ClothesDetails;
let shapedCar: CarDetails;
let shapedPhone: PhoneDetails;
let shapedLaptop: LaptopDetails;

shapedClothe = {
  color: clothe.color,
  width: clothe["3ordh"],
  height: clothe["toul"],
  thickness: clothe.khochn,
  functionality: clothe["9at3a"],
  brand: clothe.marka,
  type: clothe.naw3,
  material: "cotton",
  seasonality: "winter",
  size: "XL",
  style: "casual",
};

shapedCar = {
  year: car.Annee,
  fuelType: car.Carburant,
  model: car.Modele,
  brand: car.Marque,
  title: car.Titre,
  mileage: car.Kilometrage,
  transmission: car.Transmission,
};
shapedPhone = {
  battery: phony.Battery,
  camera: phony.Camera,
  ram: phony.RAM,
  screenSize: phony["Screen Size"],
  storage: phony.Storage,
  model: phony.Model,
  brand: phony.Brand,
};

shapedLaptop = {
  numberOfRatings: laptop["Number of Ratings"],
  rating: laptop.rating,
  msoffice: laptop.msoffice,
  Touchscreen: laptop.Touchscreen,
  warranty: laptop.warranty,
  weight: laptop.weight,
  graphic_card_gb: laptop.graphic_card_gb,
  os_bit: laptop.os_bit,
  hdd: laptop.hdd,
  ssd: laptop.ssd,
  os: laptop.os,
  ram_type: laptop.ram_type,
  ram_gb: laptop.ram_gb,
  processor_gnrtn: laptop.processor_gnrtn,
  processor_name: laptop.processor_name,
  processor_brand: laptop.processor_brand,
  brand: laptop.brand,
  numberOfReviews: laptop["Number of Reviews"],
};
