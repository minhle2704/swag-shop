import React, { useEffect, useCallback } from "react";
import Stack from "@mui/material/Stack";

import OrderTile from "./OrderTile";

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
    <>
      <h3>My Order</h3>
      <Stack spacing={1}>
        {orderData.map((order) => (
          <OrderTile key={Object.keys(order)[0]} order={order} />
        ))}
      </Stack>
    </>
  );
}

export default MyOrder;
