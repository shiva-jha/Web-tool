import React, { useState, useEffect } from "react";
import axios from "axios";
import formatHeader from "../Components/HeaderFormatter";
import RemoveDoubleQuotes from "../Components/RemoveDoubleQuote";
import "./TaskInAssigned.css";
import { useNavigate } from "react-router-dom";

function TaskInAssigned() {
  const [taskId, setTaskId] = useState("");
  const [taskHdrResult, setTaskHdrResult] = useState(null);
  const [taskDtlResult, setTaskDtlResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const jwtToken = "Bearer " + localStorage.getItem("jwtToken");
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiPort = process.env.REACT_APP_API_PORT;
  const apiUrlBase = `${apiUrl}:${apiPort}`;
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

  const handleFetch = async () => {
    if (!taskId) {
      alert("Please enter a valid task ID.");
      return;
    }

    setLoading(true);

    try {
      const taskHdrResponse = await axios.post(
        `${apiUrlBase}/CheckTaskIdInTaskHdr/${taskId}/${jwtToken}`
      );
      setTaskHdrResult(taskHdrResponse.data);

      const taskDtlResponse = await axios.post(
        `${apiUrlBase}/checkStatusInTaskDtl/${taskId}/${jwtToken}`
      );
      setTaskDtlResult(taskDtlResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const shouldRenderButton =
    taskHdrResult &&
    taskHdrResult.length > 0 &&
    taskHdrResult[0].stat_code === 30 &&
    !taskHdrResult[0].mhe_ord_state &&
    taskDtlResult &&
    taskDtlResult.every((item) => item.misc_alpha_field_2 === null);

  // console.log(RemoveDoubleQuotes("E1 AS1 Ecom Letdown"));
  const handleReleaseTask = () => {
    axios
      .post(`${apiUrlBase}/updateTaskHdrStatus/${taskId}/${jwtToken}`)
      .then((response) => {
        // Handle success
        console.log("Task moved to Released status successfully");
        setSuccessMessage("Task moved to Released status successfully");
        //   setData([]); // Clear data
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating Task:", error);
      });
  };
  return (
    <div className=" task-in-assigned-container">
      <h1 className="heading">Task Fetcher</h1>
      <input
        type="text"
        className="input-field task-input"
        placeholder="Enter Task ID"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
      />
      <button
        className=" button fetch-button"
        onClick={handleFetch}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Result"}
      </button>
      {taskHdrResult && (
        <div>
          <h2>Task Header Result</h2>
          <div className="table-container">
            <table className="table taskHdrTable">
              <thead>
                <tr>
                  {Object.keys(taskHdrResult[0]).map((key) => (
                    <th key={key}>{formatHeader(key)}</th>
                  ))}
                  <th>Task Status</th>
                  <th>Tote No</th>
                </tr>
              </thead>
              <tbody className="taskHdrTableBody">
                {taskHdrResult.map((item, index) => (
                  <tr key={index}>
                    {Object.entries(item).map(([key, value], idx) => (
                      <td key={idx}>
                        {key === "task_desc" ||
                        key === "task_genrtn_ref_nbr" ? (
                          <RemoveDoubleQuotes value={value} />
                        ) : (
                          JSON.stringify(value)
                        )}
                      </td>
                    ))}
                    <td key={"task status"}>
                      {item.stat_code === 30
                        ? "Assigned"
                        : item.stat_code === 10
                        ? "Released"
                        : item.stat_code === 99
                        ? "Cancelled"
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {successMessage && (
            <div className="successMessage">{successMessage}</div>
          )}
          {shouldRenderButton && (
            <button
              className=" button PerformTask-button"
              onClick={handleReleaseTask}
            >
              Perform Action
            </button>
          )}
        </div>
      )}
      {/* {taskDtlResult && (
        <div>
          <h2>Task Detail Result</h2>
          <pre>{JSON.stringify(taskDtlResult, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}

export default TaskInAssigned;
