export const isOnlyLetters = (str) => /^[a-zA-ZÀ-ÿ\s]+$/.test(str.trim());

export const isValidCardNumber = (cardNumber) =>
  /^\d{16}$/.test(cardNumber.trim());

export const isValidExpiryDate = (expiry) =>
  /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);

export const isValidCVV = (cvv) => /^\d{3}$/.test(cvv.trim());

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^\+?\d{7,15}$/.test(phone.trim());

export const isStrongPassword = (password) => password.length >= 6;

export const doPasswordsMatch = (pass1, pass2) => pass1 === pass2;

export const validateProfileData = (data) => {
  const errors = {};

  if (!data.name.trim() || !isOnlyLetters(data.name)) {
    errors.name = "El nombre es obligatorio y debe contener solo letras";
  }

  if (!data.lastname.trim() || !isOnlyLetters(data.lastname)) {
    errors.lastname = "El apellido es obligatorio y debe contener solo letras";
  }

  if (!data.email.trim() || !isValidEmail(data.email)) {
    errors.email = "Debés ingresar un email válido";
  }

  if (data.telephone && !isValidPhone(data.telephone)) {
    errors.telephone = "El número de teléfono es inválido";
  }

  return errors;
};
