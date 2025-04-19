import React, { useState } from "react";
import SimpleModal from "./SimpleModal";

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
    
    if (!userData.name || !userData.lastname || !userData.email || !userData.password) {
      alert("Por favor completá todos los campos obligatorios");
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert("Por favor ingresá un email válido");
      return;
    }

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
      userType: "cliente",
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
