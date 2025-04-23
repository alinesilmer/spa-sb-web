import React from "react";
import SimpleModal from "./SimpleModal";

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Usuario"
    >
      <div className="user-details">
        <div className="user-info">
          <p><strong>Nombre:</strong> {user.name} {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.telephone || "No especificado"}</p>
          <p><strong>Rol:</strong> {
            user.userType === "admin" ? "Administrador" :
            user.userType === "profesional" ? "Profesional" : "Cliente"
          }</p>
          {user.userType === "profesional" && (
            <>
              <p><strong>Especialidades:</strong> {user.specialties?.join(", ") || "No especificadas"}</p>
              <p><strong>Biografía:</strong> {user.bio || "No especificada"}</p>
            </>
          )}
        </div>
      </div>
    </SimpleModal>
  );
};

export default UserDetailsModal;
