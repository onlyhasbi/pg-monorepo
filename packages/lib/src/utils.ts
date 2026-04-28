import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractDataFromNIK = (nik: string) => {
  if (nik.length < 12) return { validFormat: false };

  // DDMMYY (dari digit ke-7 sampai 12)
  let day = parseInt(nik.substring(6, 8));
  const month = parseInt(nik.substring(8, 10));
  const year = parseInt(nik.substring(10, 12));

  const gender = day > 40 ? "Perempuan" : "Laki-laki";
  if (day > 40) day -= 40;

  // Prediksi abad (2 digit tahun)
  const currentYear2Digits = new Date().getFullYear() % 100;
  const fullYear = year > currentYear2Digits ? 1900 + year : 2000 + year;

  // Format agar selalu 2 digit (misal: '09', '05')
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  // Return tanggal dalam format YYYY-MM-DD
  return {
    validFormat: true,
    gender: gender,
    dateOfBirth: `${fullYear}-${formattedMonth}-${formattedDay}`,
  };
};

export const calculateAge = (dobString: string) => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
