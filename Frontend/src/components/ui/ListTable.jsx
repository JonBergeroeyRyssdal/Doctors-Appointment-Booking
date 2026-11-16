import { Table } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import AppIcon from "./AppIcon";

function ListTable({
  columns,
  items,
  loading = false,
  emptyMessage = "No items found.",
  className = "",
  caption = "Records",
}) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!items || items.length === 0) {
    return <div className="content-state content-state-empty"><span className="dashboard-icon"><AppIcon name="search" /></span><p>{emptyMessage}</p></div>;
  }

  return (
    <div className={`table-wrapper ${className}`}>
      <div className="table-responsive" role="region" aria-label={caption} tabIndex={0}>
        <Table hover className="mb-0 align-middle app-table">
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">{column.label}</th>
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
