import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ToteInConsumed.css";
import { useNavigate } from "react-router-dom";

const ToteInConsumed = () => {
  const [toteNo, setToteNo] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noOpenTasks, setNoOpenTasks] = useState(false);
  const [packingRecords, setPackingRecords] = useState([]);
  const [allocationRecords, setAllocationRecords] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const jwtToken = "Bearer " + localStorage.getItem("jwtToken");

  const navigate = useNavigate();
  useEffect(() => {
    // console.log(localStorage.getItem("jwtToken"));
    if (!localStorage.getItem("jwtToken")) {
      navigate("/Login");
    }
  }, []);

  const updateExptime = () => {
    localStorage.setItem("expireTime", Date.now() + 10000);
  };

  const checkForInactivity = () => {
    const expireTime = localStorage.getItem("expireTime");
    if (expireTime < Date.now()) {
      console.log("Inactive");
      localStorage.removeItem("jwtToken");
      alert("Session Time out. Please Login Again");
      navigate("/Login");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactivity();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateExptime();

    window.addEventListener("click", updateExptime);
    window.addEventListener("keypress", updateExptime);
    window.addEventListener("dblclick", updateExptime);
    window.addEventListener("mousemove", updateExptime);
    window.addEventListener("scroll", updateExptime);

    return () => {
      window.addEventListener("click", updateExptime);
      window.addEventListener("keypress", updateExptime);
      window.addEventListener("dblclick", updateExptime);
      window.addEventListener("mousemove", updateExptime);
      window.addEventListener("scroll", updateExptime);
    };
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:7373/fetchTaskDtl/${toteNo}/${jwtToken}`
      );
      setData(response.data);
      setSuccessMessage([]);
      if (response.data.length === 0) {
        setNoOpenTasks(true);
        await fetchOtherAPIs();
      }
    } catch (error) {
      console.error("Error fetching data from the Task Table", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherAPIs = async () => {
    try {
      // Fetch open packing records from the first additional API
      const response1 = await axios.post(
        `http://localhost:7373/checkPackedOrders/${toteNo}/${jwtToken}`
      );
      setPackingRecords(response1.data);
      console.log(response1.data);

      // Fetch open allocation records from the second additional API
      const response2 = await axios.post(
        `http://localhost:7373/CheckAllocation/${toteNo}/${jwtToken}`
      );
      setAllocationRecords(response2.data);

      if (response1.data.length > 0 && response2.data.length > 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      console.error("Error fetching data from additional APIs", error);
    }
  };

  const uniqueTaskIds = Array.from(new Set(data.map((task) => task.task_id))); // Get unique task_ids
  const formattedTaskIds = uniqueTaskIds.join(", "); // Join task_ids with commas
  const uniqueTcOrderIds = new Set();

  // Create a new array to store unique packing records
  const uniquePackingRecords = [];

  // Iterate over each record in packingRecords to filter out duplicates based on tc_order_id
  packingRecords.forEach((record) => {
    if (!uniqueTcOrderIds.has(record.tc_order_id)) {
      uniqueTcOrderIds.add(record.tc_order_id);
      uniquePackingRecords.push(record);
    }
  });

  const handleButtonClick = async () => {
    // Call the API to update tote status
    await axios
      .post(`http://localhost:7373/updateTotetoAlloc/${toteNo}/${jwtToken}`)
      .then((response) => {
        // Handle success
        console.log("Tote moved to allocated and pulled");
        setSuccessMessage("Tote moved to allocated and pulled");
        setData([]);
        setPackingRecords([]); // Clear data
        setNoOpenTasks(false); // Reset the state
        setAllocationRecords([]); // Clear allocation data
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating Tote:", error);
      });
  };

  return (
    <div className="tote-container container">
      <h1 className="tote-title">Tote Stuck in Consumed Status.</h1>
      <label className="tote-label label">
        Tote No:
        <input
          className="tote-input input"
          type="text"
          value={toteNo}
          onChange={(e) => setToteNo(e.target.value)}
        />
      </label>
      <button className="fetch-button button" onClick={fetchTasks}>
        Fetch Tasks
      </button>

      {loading && <p className="loading-text text">Loading...</p>}

      {uniqueTaskIds.length > 0 && (
        <div className="open-tasks">
          <h2 className="open-tasks-title">Open Tasks for Tote {toteNo}</h2>
          <p className="open-tasks-message">
            There are open tasks with task_ids: {formattedTaskIds}. Please
            complete the tasks.
          </p>
        </div>
      )}

      {noOpenTasks && (
        <div className="no-open-tasks">
          <h2 className="no-open-tasks-title">
            No Open Tasks for Tote {toteNo}
          </h2>
          {packingRecords.length > 0 && (
            <div className="open-packing-records">
              <h3 className="open-packing-records-title">
                Open Packing Records:
              </h3>
              <table className="table packingTable">
                <thead>
                  <tr>
                    <th>Tc Order Id</th>
                    <th>Do Status</th>
                  </tr>
                </thead>
                <tbody className="packingTableBody">
                  {uniquePackingRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.tc_order_id}</td>
                      <td>{record.do_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {allocationRecords.length > 0 && (
            <div className="open-allocation-records">
              <h3 className="open-allocation-records-title">
                There is open Allocation for this Tote .
              </h3>
            </div>
          )}
        </div>
      )}

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {showButton && (
        <button className="move-button button" onClick={handleButtonClick}>
          Move Tote to Allocated and Pulled
        </button>
      )}
    </div>
  );
};

export default ToteInConsumed;
