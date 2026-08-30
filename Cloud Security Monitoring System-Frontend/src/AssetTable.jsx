import { useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./AssetTable.css";

function AssetTable({
  assets = [],
  onView,
  onEdit,
  onDelete,
}) {
  const tableRef = useRef(null);

  const scroll = (direction) => {
    if (tableRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500;
      tableRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Support Mouse Wheel / Trackpad horizontal scrolling
  useEffect(() => {
    const tableEl = tableRef.current;
    if (!tableEl) return;

    const handleWheel = (e) => {
      // If horizontal trackpad gesture or Shift+Wheel, let container scroll left/right
      if (e.deltaX !== 0) {
        return; // Native trackpad 2-finger swipe handles this automatically
      }
      if (e.shiftKey) {
        e.preventDefault();
        tableEl.scrollLeft += e.deltaY;
      }
    };

    tableEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => tableEl.removeEventListener("wheel", handleWheel);
  }, []);

  if (assets.length === 0) {
    return (
      <div className="no-data">
        <h3>No Assets Found</h3>
        <p>No assets available in the inventory.</p>
      </div>
    );
  }

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="table-wrapper">
      {/* Scroll Slider Controls */}
      <div className="table-scroll-controls">
        <span className="scroll-hint">💡 Use buttons or swipe trackpad horizontally to view all columns</span>
        <div className="scroll-btn-group">
          <button className="table-scroll-btn" onClick={() => scroll("left")} title="Scroll Left">
            <FaChevronLeft /> Scroll Left
          </button>
          <button className="table-scroll-btn" onClick={() => scroll("right")} title="Scroll Right">
            Scroll Right <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="table-container" ref={tableRef}>
        <table className="asset-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-name">Asset Name</th>
              <th className="col-type">Type</th>
              <th className="col-hostname">Hostname</th>
              <th className="col-ip">IP Address</th>
              <th className="col-os">Operating System</th>
              <th className="col-owner">Owner</th>
              <th className="col-dept">Department</th>
              <th className="col-health">Health</th>
              <th className="col-status">Status</th>
              <th className="col-risk">Risk</th>
              {hasActions && <th className="col-actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="col-id">{asset.id}</td>
                <td className="col-name cell-bold">{asset.assetName}</td>
                <td className="col-type">{asset.assetType}</td>
                <td className="col-hostname cell-mono-cyan">{asset.hostname}</td>
                <td className="col-ip cell-mono-blue">{asset.ipAddress}</td>
                <td className="col-os">{asset.operatingSystem}</td>
                <td className="col-owner">{asset.owner}</td>
                <td className="col-dept">{asset.department}</td>
                <td className="col-health">
                  <div className="status-badge-container">
                    <span className={`pulse-dot ${asset.health?.toLowerCase() || ""}`} />
                    <span className="badge-text">{asset.health}</span>
                  </div>
                </td>
                <td className="col-status">
                  <div className="status-badge-container">
                    <span className={`pulse-dot ${asset.status?.toLowerCase() || ""}`} />
                    <span className="badge-text">{asset.status}</span>
                  </div>
                </td>
                <td className="col-risk">
                  <span
                    className={
                      asset.riskScore >= 80
                        ? "risk-high"
                        : asset.riskScore >= 50
                        ? "risk-medium"
                        : "risk-low"
                    }
                  >
                    {asset.riskScore}%
                  </span>
                </td>
                {hasActions && (
                  <td className="col-actions action-buttons">
                    {onEdit && (
                      <button className="edit-btn" onClick={() => onEdit(asset)}>
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button className="delete-btn" onClick={() => onDelete(asset.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetTable;