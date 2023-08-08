import React, { useState } from "react";
import axios from "axios";
import "./asn.css";

const ASN = () => {
  const [tcAsnId, setTcAsnId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverifySuccess, setUnverifySuccess] = useState(false); // New state for unverify success

  const fetchData = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post(`http://localhost:7373/fetchTcAsnId/${tcAsnId}`);
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
        .post(`http://localhost:7373/UnVerifyAsn/${tcAsnId}`)
        .then((response) => {
          // Handle success
          console.log("ASN Unverified successfully");
          setUnverifySuccess(true); // Set unverify success state
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
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="asnTableBody">
              {data.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, idx) => (
                    <td key={idx}>{JSON.stringify(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {unverifySuccess && (
        <div className="unverifySuccessMessage">
          ASN Unverified successfully
        </div>
      )}

      {data.length > 0 && data[0].asn_status === 40 && (
        <div className="unverifyButtonContainer">
          <button className="button unverifyButton" onClick={handleUnverify}>
            Unverify ASN
          </button>
        </div>
      )}
    </div>
  );
};

export default ASN;