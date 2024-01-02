import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function CheckOut({ user, swagOrders, clearSwagOrders }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [date, setDate] = useState(null);
  const [shouldOpenConfirmOrderDialog, setShouldOpenConfirmOrderDialog] =
    useState(false);
  const [hasErrorConfirmOrder, setHasErrorConfirmOrder] = useState(false);

  const navigate = useNavigate();

  const handleClickOpenConfirmOrderDialog = () => {
    setShouldOpenConfirmOrderDialog(true);
  };

  const handleCloseConfirmOrderDialog = async () => {
    setShouldOpenConfirmOrderDialog(false);
  };

  const handleConfirmOrder = async () => {
    const confirmedOrderNumber = await updateSwagData();

    if (confirmedOrderNumber) {
      clearSwagOrders();
      sendEmail(confirmedOrderNumber);
      navigate("/my-order");
    }
  };

  // Update swag data after customer order
  const updateSwagData = async () => {
    const payload = {
      userId: user.id,
      swagOrders: swagOrders,
      deliveryAddress,
      phoneNumber,
      date,
    };

    const response = await fetch("/.netlify/functions/commit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.status === 200) {
      setHasErrorConfirmOrder(false);
      return result.message.ref["@ref"].id;
    } else {
      setHasErrorConfirmOrder(true);
    }
  };

  // Send email of order confirmation
  const sendEmail = (confirmedOrderNumber) => {
    const payload = {
      user,
      confirmedOrderNumber,
    };

    fetch("/.netlify/functions/send-order-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <Stack spacing={4} width="50ch">
      <Stack spacing={1} width="50ch">
        <TextField
          color="secondary"
          label="Name"
          variant="standard"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          color="secondary"
          label="Phone Number"
          variant="standard"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />

        <TextField
          color="secondary"
          label="Deliver Address"
          variant="standard"
          value={deliveryAddress}
          onChange={(event) => setDeliveryAddress(event.target.value)}
        />
      </Stack>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          color="secondary"
          label="Delivery Date"
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <Button
        color="secondary"
        variant="outlined"
        onClick={handleClickOpenConfirmOrderDialog}
      >
        Confirm Order
      </Button>

      <Dialog
        open={shouldOpenConfirmOrderDialog}
        onClose={handleCloseConfirmOrderDialog}
      >
        <DialogContent>
          <DialogContentText>Click OK to confirm order</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmOrderDialog}>Cancel</Button>
          <Button onClick={handleConfirmOrder} autoFocus>
            OK
          </Button>
        </DialogActions>

        {hasErrorConfirmOrder && (
          <Alert severity="error">
            Failed to place order. Please try again!
          </Alert>
        )}
      </Dialog>
    </Stack>
  );
}

export default CheckOut;
