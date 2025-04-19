import React, { useState, useEffect } from "react";
import SimpleModal from "./SimpleModal";
import NotePopup from "./NotePopup";
import "../styles/professional.css";

const ClientHistoryModal = ({ isOpen, onClose, client }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    if (!client || !client.appointments || client.appointments.length === 0) {
      return (
        <SimpleModal isOpen={isOpen} onClose={onClose} title="Historial del Cliente">
          <p>Este cliente no tiene historial de turnos registrado.</p>
        </SimpleModal>
      );
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAppointments = client.appointments.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(client.appointments.length / itemsPerPage);
  
    return (
      <SimpleModal isOpen={isOpen} onClose={onClose} title={`Historial de ${client.name} ${client.lastname}`}>
        <div className="client-history">
          <div className="client-history-header">
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Teléfono:</strong> {client.telephone || "No especificado"}</p>
          </div>
  
          <div className="client-history-section">
            <h4>Turnos Realizados</h4>
            <table className="client-history-table">
                <thead>
                <tr>
                    <th>Servicio</th>
                    <th>🗓️ Fecha</th>
                    <th>🕒 Hora</th>
                    <th>📝 Notas</th>
                </tr>
                </thead>
                <tbody>
                {paginatedAppointments.map((appt, index) => (
                    <tr key={index}>
                    <td>{appt.service}</td>
                    <td>{appt.date}</td>
                    <td>{appt.hour || "—"}</td>
                    <td>
                        {appt.notes ? <NotePopup note={appt.notes} /> : "---"}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
  
        {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>←</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>→</button>
            </div>
          )}
        </div>
      </SimpleModal>
    );
  };
  
  export default ClientHistoryModal;
