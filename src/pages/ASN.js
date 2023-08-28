import React, { useEffect, useState } from "react";
import axios from "axios";
import "./asn.css";
import formatHeader from "../Components/HeaderFormatter";
import RemoveDoubleQuotes from "../Components/RemoveDoubleQuote";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const ASN = () => {
  const [tcAsnId, setTcAsnId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Single state for success message
  const navigate = useNavigate();
  const expireTime = localStorage.getItem("expireTime");

  useEffect(() => {
    // console.log(localStorage.getItem("jwtToken"));
    if (!localStorage.getItem("jwtToken")) {
      navigate("/Login");
    }
  }, []);

  const updateExptime = () => {
    localStorage.setItem("expireTime", Date.now() + 30000);
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

  const jwtToken = "Bearer " + localStorage.getItem("jwtToken");
  const fetchData = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage(""); // Clear success message
    setData([]); // Clear data

    try {
      const response = await axios.post(
        `http://localhost:7373/fetchTcAsnId/${tcAsnId}/${jwtToken}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );
      setData(response.data);
    } catch (error) {
      setError("Error fetching data from the ASN Table");
    } finally {
      setLoading(false);
    }
  };

  const handleUnverify = () => {
    if (data[0].asn_status === 40) {
      axios
        .post(`http://localhost:7373/UnVerifyAsn/${tcAsnId}/${jwtToken}`)
        .then((response) => {
          // Handle success
          console.log("ASN Unverified successfully");
          setSuccessMessage("ASN Unverified successfully");
          setData([]); // Clear data
        })
        .catch((error) => {
          // Handle error
          console.error("Error updating ASN:", error);
        });
    }
  };

  const handleVerify = () => {
    if (data[0].asn_status === 30) {
      axios
        .post(`http://localhost:7373/VerifyAsn/${tcAsnId}/${jwtToken}`)
        .then((response) => {
          // Handle success
          console.log("ASN Verified successfully");
          setSuccessMessage("ASN Verified successfully");
          setData([]); // Clear data
        })
        .catch((error) => {
          // Handle error
          console.error("Error updating ASN:", error);
        });
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Fetch ASN Data</h1>
      <div className="form-group">
        <label className="label asnLabel">
          Enter tc_asn_id:{" "}
          <input
            type="text"
            className="input-field asnInput"
            value={tcAsnId}
            onChange={(e) => setTcAsnId(e.target.value)}
          />
        </label>
        <button className="button asnButton" onClick={fetchData}>
          Fetch Data
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {data.length > 0 && (
        <div className="table-container">
          <table className="table asnTable">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{formatHeader(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="asnTableBody">
              {data.map((item, index) => (
                <tr key={index}>
                  {Object.entries(item).map(([key, value], idx) => (
                    <td key={idx}>
                      {key === "tc_asn_id" ? (
                        <RemoveDoubleQuotes value={value} />
                      ) : key === "asn_status" ? (
                        value === 40 ? (
                          "Verified"
                        ) : value === 30 ? (
                          "Unverified"
                        ) : (
                          JSON.stringify(value)
                        )
                      ) : key === "is_CLOSED" ? (
                        value === 1 ? (
                          "Yes"
                        ) : (
                          "No"
                        )
                      ) : (
                        JSON.stringify(value)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {successMessage && <div className="successMessage">{successMessage}</div>}

      {data.length > 0 && data[0].asn_status === 40 && (
        <div className="actionButtonContainer">
          <button className="button unverifyButton" onClick={handleUnverify}>
            Unverify ASN
          </button>
        </div>
      )}

      {data.length > 0 && data[0].asn_status === 30 && (
        <div className="actionButtonContainer">
          <button className="button verifyButton" onClick={handleVerify}>
            Verify ASN
          </button>
        </div>
      )}
    </div>
  );
};

export default ASN;
