import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import CustomCard from "./CardComponent"; // Import the custom card component
import Grid from "@mui/material/Grid"; // Import the Grid component
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(localStorage.getItem("jwtToken"));
    if (!localStorage.getItem("jwtToken")) {
      navigate("/Login");
    }
  }, []);

  const updateExptime = () => {
    localStorage.setItem("expireTime", Date.now() + 300000);
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

  const cardData = [
    {
      title: "ASN Page",
      content: "View and manage Advanced Shipping Notices.",
      link: "/ASN",
    },
    {
      title: "Tote in Consumed",
      content: "Manage totes that have been consumed.",
      link: "/ToteInConsumed",
    },
    {
      title: "Tote in Allocated and Pulled",
      content: "Change Tote status .",
      link: "/ToteInAllocAndPulled",
    },
    {
      title: "Olpn in Packing",
      content: "Manage Olpns in Packing process.",
      link: "/OlpnInPacking",
    },
    {
      title: "Task in Assigned Page",
      content: "Manage tasks .",
      link: "/TaskInAssigned",
    },
    // Add more card data objects as needed
  ];

  return (
    <div className="home-container">
      <h1 className="heading">Welcome to the Home Page</h1>
      <div className="card-container">
        <Grid container spacing={2}>
          {cardData.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CustomCard title={data.title} content={data.content}>
                <Link to={data.link}>Go to {data.title}</Link>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      </div>
      {/* <button onClick={handleSignOut}>Sign Out</button> */}
    </div>
  );
}

export default Home;
