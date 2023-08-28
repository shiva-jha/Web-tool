import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OlpnInPacking = () => {
  const [tcRefLpnId, setTcRefLpnId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openAllocation, setOpenAllocation] = useState("");
  const [openTasks, setOpenTasks] = useState([]);
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

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setData([]);
    setSuccessMessage("");
    setOpenAllocation("");
    setOpenTasks([]);

    try {
      const response = await axios.post(
        `http://localhost:7373/checkLPNStatus/${tcRefLpnId}/${jwtToken}`
      );
      setData(response.data);
    } catch (error) {
      setError("Error fetching data from the API");
    } finally {
      setLoading(false);
    }
  };

  const isLpnPacked = data.length > 0 && data[0].lpn_FACILITY_STATUS >= 20;

  const handlePacking = async () => {
    if (!isLpnPacked) {
      try {
        const responseOpenAllocation = await axios.post(
          `http://localhost:7373/checkOpenAllocationByTcReferenceLpnId/${tcRefLpnId}/${jwtToken}`
        );
        if (Array.isArray(responseOpenAllocation.data)) {
          setOpenAllocation(responseOpenAllocation.data);
        } else {
          setOpenAllocation([responseOpenAllocation.data]);
        }
      } catch (error) {
        setOpenAllocation([]);
      }

      try {
        const responseOpenTasks = await axios.post(
          `http://localhost:7373/checkOpenAllocation/${tcRefLpnId}/${jwtToken}`
        );
        setOpenTasks(responseOpenTasks.data);
      } catch (error) {
        setOpenTasks([]);
      }

      if (openAllocation.length === 0 && openTasks.length === 0) {
        try {
          // Call three APIs for status checks
          const responseStatus1 = await axios.post(
            `http://localhost:7373/checkOrderLineItemByItemId/${tcRefLpnId}/${jwtToken}`
          );
          const responseStatus2 = await axios.post(
            `http://localhost:7373/checkOrderLineItemByReferenceId/${tcRefLpnId}/${jwtToken}`
          );
          const responseStatus3 = await axios.post(
            `http://localhost:7373/checkOpenLpnDetails/${tcRefLpnId}/${jwtToken}`
          );

          if (responseStatus3.data.length > 0) {
            await axios.post(
              `http://localhost:7373/updateLpnDetails/${tcRefLpnId}/${jwtToken}`
            );
          }
          if (responseStatus1.data.length > 0) {
            await axios.post(
              `http://localhost:7373/updateOrderLineItemUserCancelledQtyLineItemId/${tcRefLpnId}/${jwtToken}`
            );
            await axios.post(
              `http://localhost:7373/updateOrderLineItemStatusByLineItemId/${tcRefLpnId}/${jwtToken}`
            );
          }
          if (responseStatus2.data.length > 0) {
            await axios.post(
              `http://localhost:7373/updateOrderLineItemUserCancelledQtyReferenceLineItemId/${tcRefLpnId}/${jwtToken}`
            );
            await axios.post(
              `http://localhost:7373/updateOrderLineItemStatusByReferenceLineItemId/${tcRefLpnId}/${jwtToken}`
            );
          }
          await axios.post(
            `http://localhost:7373/updateLpnsToPackedStatus/${tcRefLpnId}/${jwtToken}`
          );
          setSuccessMessage("Packing completed successfully");
        } catch (error) {
          setError("Error while performing updates");
        }
      }
    }
  };
  const uniqueTaskIds = Array.from(
    new Set(openTasks.map((task) => task.task_id))
  ); // Get unique task_ids
  const formattedTaskIds = uniqueTaskIds.join(", ");

  return (
    <div className="container">
      <h1>OLPN in Packing</h1>
      <div>
        <label className="label">
          Enter tc_reference_lpn_id:{" "}
          <input
            className="input"
            type="text"
            value={tcRefLpnId}
            onChange={(e) => setTcRefLpnId(e.target.value)}
          />
        </label>
        <button className="button" onClick={fetchData}>
          Fetch Data
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && data.length > 0 && (
        <div>
          <h2>Results:</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Inbound/Outbound</th>
                <th>tc_reference_lpn_id</th>
                <th>lpn_STATUS</th>
                <th>lpn_FACILITY_STATUS</th>
                <th>tc_LPN_ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.inbound_outbound_indicator}</td>
                  <td>{item.tc_reference_lpn_id}</td>
                  <td>{item.lpn_STATUS}</td>
                  <td>{item.lpn_FACILITY_STATUS}</td>
                  <td>{item.tc_LPN_ID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLpnPacked && data.length > 0 && (
        <div>
          <button className="button" onClick={handlePacking}>
            Perform Packing
          </button>
          {successMessage && <h3>{successMessage}</h3>}
          {/* {openAllocation && <p>There is open allocation. Please complete it.</p>} */}
          {openAllocation.length > 0 && (
            <div>
              <p>
                There is an open allocation with IDs:{" "}
                {openAllocation
                  .map((alloc) => alloc.alloc_invn_dtl_id)
                  .join(", ")}
                . Please complete them.
              </p>
            </div>
          )}
          {openTasks.length > 0 && (
            <div>
              {/* <p>There is an open task with task IDs: {openTasks.map(task => task.task_id).join(", ")}. Please complete them.</p> */}
              <p>
                There are open tasks with task_ids: {formattedTaskIds}. Please
                complete the tasks.
              </p>
            </div>
          )}
        </div>
      )}

      {isLpnPacked && (
        <div>
          <h3>OLPN is already packed</h3>
        </div>
      )}
    </div>
  );
};

export default OlpnInPacking;
