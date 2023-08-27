import React from "react";
import { Link } from "react-router-dom";
import CustomCard from "./CardComponent"; // Import the custom card component
import Grid from "@mui/material/Grid"; // Import the Grid component
import "./home.css";

function Home({ handleSignOut }) {
  const cardData = [
    {
      title: "ASN Page",
      content: "View and manage Advanced Shipping Notices.",
      link: "/ASN"
    },
    {
      title: "Tote in Consumed",
      content: "Manage totes that have been consumed.",
      link: "/ToteInConsumed"
    },
    {
      title: "Task In AllocaAndPulled",
      content: "Manage tasks .",
      link: "/ToteInAllocAndPulled"
    },
    {
      title: "Olpn in Packing",
      content: "Manage Olpns in Packing process.",
      link: "/OlpnInPacking"
    },
    {
      title: "Task In Assigned Page",
      content: "Manage tasks that got stuck in assigned state.",
      link: "/TaskInAssigned"
    }
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