import React, { useState } from "react";
import SimpleModal from "./SimpleModal";

const ProfileConfigModal = ({ isOpen, onClose, user, onSaveProfile }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
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
      name: profileData.name,
      lastname: profileData.lastname,
      email: profileData.email,
      telephone: profileData.telephone
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
          id="name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="admin-form-group">
        <label htmlFor="lastName">Apellido</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={profileData.lastname}
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
          id="telephone"
          name="telephone"
          value={profileData.telephone}
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
