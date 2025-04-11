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
        <div className="user-avatar">
          {user.profilePicture ? (
            <img src={user.profilePicture || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
          ) : (
            <div className="avatar-placeholder">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
          )}
        </div>
        <div className="user-info">
          <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.phone || "No especificado"}</p>
          <p><strong>Rol:</strong> {
            user.role === "admin" ? "Administrador" :
            user.role === "professional" ? "Profesional" : "Cliente"
          }</p>
          {user.role === "professional" && (
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
