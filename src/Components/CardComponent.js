import React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./CustomCard.css"; // Import your custom styles

const CustomCard = ({ title, content, children }) => {
  return (
    <div className="card">
      <CardContent className="card-content">
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        {children}
      </CardContent>
    </div>
  );
};

export default CustomCard;