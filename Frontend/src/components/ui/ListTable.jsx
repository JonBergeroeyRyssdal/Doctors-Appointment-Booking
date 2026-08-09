import { Table, Spinner } from "react-bootstrap";

function ListTable({
  columns,
  items,
  loading = false,
  emptyMessage = "No items found.",
  className = "",
}) {
  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!items || items.length === 0) {
    return <p className="mb-0 text-muted">{emptyMessage}</p>;
  }

  return (
    <div className={`table-wrapper ${className}`}>
      <div className="table-responsive">
        <Table hover responsive className="mb-0 align-middle app-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ListTable;
