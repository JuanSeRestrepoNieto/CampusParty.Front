import { useEffect, useState } from "react";
import {
  type Pabellon as PabellonType,
  pabellonService,
} from "../services/pabellon.service";

const Pabellon: React.FC = () => {
  const [pabellones, setPabellones] = useState<PabellonType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pabellonService.getAll();

        setPabellones(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-content">
      <h2>Pabellon</h2>
      <button className="add-button">Nuevo Pabellon</button>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tematica</th>
            <th>Area</th>
            <th>Ubicacion</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pabellones.map((pabellon) => (
            <tr key={pabellon.id}>
              <td>{pabellon.id}</td>
              <td>{pabellon.nombre}</td>
              <td>{pabellon.tematica}</td>
              <td>{pabellon.area}</td>
              <td>{pabellon.ubicacion}</td>
              <td>{pabellon.capacidad}</td>
              <td>
                <button className="edit-button">Editar</button>
                <button className="delete-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pabellon;
