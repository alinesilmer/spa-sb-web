// utils/validationUtils.js

export const isOnlyLetters = (str) => /^[a-zA-ZÀ-ÿ\s]+$/.test(str.trim());

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^\+?\d{7,15}$/.test(phone.trim());

export const isStrongPassword = (password) => password.length >= 6;

export const doPasswordsMatch = (pass1, pass2) => pass1 === pass2;
