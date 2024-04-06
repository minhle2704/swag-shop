import React, { useEffect, useCallback } from "react";
import Stack from "@mui/material/Stack";

import OrderTile from "./OrderTile";
import { Typography } from "@mui/material";

function MyOrder({ user, orderData, setOrderData }) {
  const fetchOrderData = useCallback(async () => {
    const payload = { userId: user.id };
    const response = await fetch("/.netlify/functions/my-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const swagOrderData = result.message.data;
    setOrderData(swagOrderData);
  }, [user, setOrderData]);

  // Fetch orderData
  useEffect(() => {
    if (user) {
      fetchOrderData();
    }
  }, [fetchOrderData, user]);

  return (
    <Stack padding={2} spacing={2}>
      <Typography variant="h4" color="blue.main">
        My Order
      </Typography>

      <Stack spacing={1}>
        {orderData.map((order) => (
          <OrderTile key={Object.keys(order)[0]} order={order} />
        ))}
      </Stack>
    </Stack>
  );
}

export default MyOrder;
