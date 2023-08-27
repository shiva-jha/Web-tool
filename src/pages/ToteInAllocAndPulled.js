import React, { useState } from "react";
import axios from "axios";

const ToteInAllocaAndPulled = () => {
  const [toteNo, setToteNo] = useState("");
  const [toteStatus, setToteStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const [openPackingRecords, setOpenPackingRecords] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [task, setTask] = useState([]);

  const fetchToteStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:7373/fetchTcLpnId/${toteNo}`);
      setToteStatus(response.data);
      setShowTable(true);
      setShowClearButton(true);
    } catch (error) {
      console.error("Error fetching tote status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToteClear = async () => {
    try {
      // Check for open tasks
      const openTaskResponse = await axios.post(`http://localhost:7373/allTaskDetails/${toteNo}`);
      if (openTaskResponse.data.length > 0) {
        setOpenTask(openTaskResponse.data);
        return;
      }

      // Check for open packing records
      const openPackingResponse = await axios.post(`http://localhost:7373/notPacked/${toteNo}`);
      setOpenPackingRecords(openPackingResponse.data);

      if (openPackingResponse.data.length > 0) {
        return;
      }

      // If no open tasks or packing records, update tote status
      await axios.post(`http://localhost:7373/UpdateTcLpnId/${toteNo}`);
      setSuccessMessage("Tote moved to consumed status successfully!");
      console.log("Tote status updated successfully!");
    } catch (error) {
      console.error("Error clearing tote:", error);
    }
  };

  const getToteStatus = (lpnFacilityStatus) => {
    if (lpnFacilityStatus === 64) {
      return "Allocated and Pulled";
    } else if (lpnFacilityStatus === 95) {
      return "Consumed";
    } else {
      return "Unknown";
    }
  };
  const uniqueTaskIds = openTask ? Array.from(new Set(openTask.map(task => task.task_id))) : [];
  const formattedTaskIds = uniqueTaskIds.join(", ");
  return (
    <div className="tote-container container">
      <h1 className="tote-title">Tote Stuck In Allocated And Pulled Status</h1>
      <label className="tote-label label">
        Tote No:
        <input
          className="tote-input input"
          type="text"
          value={toteNo}
          onChange={(e) => setToteNo(e.target.value)}
        />
      </label>
      <button className="fetch-button button" onClick={fetchToteStatus}>
        Fetch Tote Status
      </button>

      {loading && <p className="loading-text text">Loading...</p>}

      {showTable && ( 
        <table className="table">
          <thead>
            <tr>
              <th>Inbound/Outbound</th>
              <th>TOTE No.</th>
              <th>Lpn Status</th>
              <th>Lpn FACILITY Status</th>
              <th>Tote Status</th>
              
            </tr>
          </thead>
          <tbody>
            {toteStatus.map((item, index) => (
              <tr key={index}>
                <td>{item.inbound_outbound_indicator}</td>
                <td>{item.tc_LPN_ID}</td>
                <td>{item.lpn_STATUS}</td>
                <td>{item.lpn_FACILITY_STATUS}</td>
                <td>{getToteStatus(item.lpn_FACILITY_STATUS)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showClearButton && (
        <button className="clear-button button" onClick={handleToteClear}>
          Clear Tote
        </button>
      )}

      {openTask && (
        <div className="open-task">
          <h2 className="open-task-title">Open Task for Tote {toteNo}</h2>
          <p className="open-task-message">There is an open task with task_id: {formattedTaskIds}. Please complete the task.</p>
        </div>
      )}

      {openPackingRecords.length > 0 && (
        <div className="open-packing-records">
          <h2 className="open-packing-records-title">Open Packing Records for Tote {toteNo}</h2>
          <table className="packing-table">
            <thead>
              <tr>
                <th>Tc Order ID</th>
                <th>DO Status</th>
              </tr>
            </thead>
            <tbody>
              {openPackingRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.tc_order_id}</td>
                  <td>{record.do_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ToteInAllocaAndPulled;