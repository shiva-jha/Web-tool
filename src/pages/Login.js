import React, { useRef, useState, useEffect } from "react";

import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
// import logger from "../../logger";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;



const Login = ({ setAuthenticated }) => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  // const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiPort = process.env.REACT_APP_API_PORT;
  const apiUrlBase = `${apiUrl}:${apiPort}`;
  const LOGIN_URL = `${apiUrlBase}/api/v1/auth/authenticate`;

  const [userName, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setErrMsg("");
  }, [userName, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ userName, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      localStorage.setItem("jwtToken", response.data.jwtToken);
      setSuccess(true);
      // logger.info(`User "${userName}" logged in at: ${new Date().toLocaleString()}`);
      // Set authentication status to true
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("userName", userName);
      localStorage.setItem("expireTime", Date.now() + 10000);

      
      // Redirect to Home after successful login
       navigate("/Home");
      
  
     
      // Clear state and controlled inputs
      setUser("");
      setPwd("");
    } catch (err) {
      if (!err?.response) {
        // logger.error(`Login failed for user "${userName}": No server response`);
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        // logger.error(`Login failed for user "${userName}": Username taken`);
        setErrMsg("Username Taken");
      } else {
        // logger.error(`Login failed for user "${userName}": Login Failed - ${err.message}`);
        setErrMsg("Login Failed");
      }
     
      errRef.current.focus();
    }
  };


  return (
    <div className="center-container">
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#" className="loginLink">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Lululemon DC Support</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Enter WM Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !userName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={userName}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && userName && !validName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Enter Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !password ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <button disabled={!validName || !validPwd ? true : false}>
              Login
            </button>
          </form>
          <p>
            New User? Please <a href="/Register">Sign Up</a> Here
          </p>
        </section>
      )}
    </div>
  );
};

export default Login;
