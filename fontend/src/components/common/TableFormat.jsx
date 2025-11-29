import { Button, Col, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";

export default function TableFormatter({
  columns = [],
  data = [],
  action = { handleEdit: null, handleIsActive: null },
}) {
  const hasEditAction = typeof action.handleEdit === "function";
  const hasIsActiveAction = typeof action.handleIsActive === "function";
  const hasAnyAction = hasEditAction || hasIsActiveAction;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
          {hasAnyAction && <th className="text-center">Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col.accessor]}</td>
              ))}

              {hasAnyAction && (
                <td className="d-flex justify-content-center align-items-center gap-2">
                      {/* Chỉ hiển thị button Edit nếu handleEdit không phải empty function */}
                      {hasEditAction && (
                        <Button
                          variant="info"
                          className="text-white fw-semibold"
                          onClick={() => action.handleEdit(row)}
                        >
                          Edit
                        </Button>
                      )}
                      {/* Chỉ hiển thị button Activate/Deactivate nếu handleIsActive không phải empty function */}
                      {hasIsActiveAction && (
                        <Button
                          variant={row.active ? "danger" : "success"}
                          className="text-white fw-semibold"
                          onClick={() => action.handleIsActive(row)}
                        >
                          {row.active ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length + (hasAnyAction ? 1 : 0)}
              className="text-center"
            >
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
