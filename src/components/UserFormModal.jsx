import React, { useState } from "react";
import SimpleModal from "./SimpleModal";

const UserFormModal = ({ isOpen, onClose, onSaveUser }) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
    profilePicture: "/default-profile.png"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = () => {
    
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "client",
      profilePicture: "/default-profile.png"
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
        <label htmlFor="firstName">Nombre</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="lastName">Apellido</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userData.lastName}
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
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          name="role"
          value={userData.role}
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
