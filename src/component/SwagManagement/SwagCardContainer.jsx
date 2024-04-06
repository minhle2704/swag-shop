import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

import SwagCard from "./SwagCard";

function SwagCardContainer({
  user,
  swagData,
  swagOrders,
  setSwagData,
  updateSwagOrders,
}) {
  return (
    <Grid container spacing={4} padding={6}>
      {swagData.map((swag) => (
        <Grid key={swag.ref["@ref"].id} item xs={12} sm={6} md={4}>
          <SwagCard
            user={user}
            swag={swag}
            swagData={swagData}
            swagOrders={swagOrders}
            orderQuantity={swagOrders[swag.ref["@ref"].id]?.quantity}
            setSwagData={setSwagData}
            updateSwagOrders={updateSwagOrders}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default SwagCardContainer;
