import React, { useState } from "react";
import SimpleModal from "./SimpleModal";
import {
  isOnlyLetters,
  isValidEmail,
  isValidPhone,
  isStrongPassword
} from "../utils/validationUtils";


const UserFormModal = ({ isOpen, onClose, onSaveUser }) => {
  const [userData, setUserData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    telephone: "",
    userType: "cliente",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = () => {
    const { name, lastname, email, password, telephone } = userData;
  
    if (!name.trim() || !lastname.trim() || !email.trim() || !password) {
      alert("Por favor completá todos los campos obligatorios");
      return;
    }
  
    if (!isOnlyLetters(name)) {
      alert("El nombre solo debe contener letras");
      return;
    }
  
    if (!isOnlyLetters(lastname)) {
      alert("El apellido solo debe contener letras");
      return;
    }
  
    if (!isValidEmail(email)) {
      alert("Por favor ingresá un email válido");
      return;
    }
  
    if (!isStrongPassword(password)) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
  
    if (telephone && !isValidPhone(telephone)) {
      alert("Número de teléfono inválido");
      return;
    }
  
    // Si todo es válido, se guarda el usuario
    onSaveUser({
      ...userData,
      id: Date.now().toString()
    });
  
    setUserData({
      name: "",
      lastname: "",
      email: "",
      password: "",
      telephone: "",
      userType: "cliente"
    });
  
    onClose();
  };
  

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Usuario"
      onConfirm={handleSubmit}
      confirmText="Guardar"
    >
      <div className="admin-form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="lastname">Apellido</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={userData.lastname}
          onChange={handleChange}
          required
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="telephone">Teléfono</label>
        <input
          type="tel"
          id="telephone"
          name="telephone"
          value={userData.telephone}
          onChange={handleChange}
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="userType">Rol</label>
        <select
          id="userType"
          name="userType"
          value={userData.userType}
          onChange={handleChange}
        >
          <option value="client">Cliente</option>
          <option value="professional">Profesional</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
    </SimpleModal>
  );
};

export default UserFormModal;
