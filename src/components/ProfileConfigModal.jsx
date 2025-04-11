import React, { useState } from "react";
import SimpleModal from "./SimpleModal";

const ProfileConfigModal = ({ isOpen, onClose, user, onSaveProfile }) => {
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = () => {
    if (profileData.newPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      if (!profileData.currentPassword) {
        alert("Debés ingresar tu contraseña actual");
        return;
      }
    }

    
    const updatedUser = {
      ...user,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone
    };

   
    if (profileData.newPassword) {
      updatedUser.password = profileData.newPassword;
    }

    onSaveProfile(updatedUser);
    onClose();
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Perfil"
      onConfirm={handleSubmit}
      confirmText="Guardar Cambios"
    >
      <div className="admin-form-group">
        <label htmlFor="firstName">Nombre</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={profileData.firstName}
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
          value={profileData.lastName}
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
          value={profileData.email}
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
          value={profileData.phone}
          onChange={handleChange}
        />
      </div>
      
      <h3>Cambiar Contraseña</h3>
      <div className="admin-form-group">
        <label htmlFor="currentPassword">Contraseña Actual</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={profileData.currentPassword}
          onChange={handleChange}
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="newPassword">Nueva Contraseña</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={profileData.newPassword}
          onChange={handleChange}
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={profileData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </SimpleModal>
  );
};

export default ProfileConfigModal;
