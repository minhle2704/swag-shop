import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

function SwagDialog({ swag, swagData, setSwagData, onClose }) {
  const [swagName, setSwagName] = useState(swag?.data.name || "");
  const [swagQuantity, setSwagQuantity] = useState(swag?.data.quantity || "");
  const [swagCategory, setSwagCategory] = useState(swag?.data.category || "");
  const [swagImage, setSwagImage] = useState(swag?.data.image || "");

  const handleSave = () => {
    if (swag?.ref["@ref"].id) {
      handleEditSwag();
    } else {
      handleAddSwag();
    }
  };

  // Add swag
  const handleAddSwag = async () => {
    const payload = {
      name: swagName,
      quantity: swagQuantity,
      category: swagCategory,
      image: swagImage,
    };
    const response = await fetch(".netlify/functions/add-swag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      const addedSwag = await response.json();
      setSwagData([...swagData, addedSwag.message]);
      onClose();
    }
  };

  // Edit swag
  const handleEditSwag = async () => {
    const payload = {
      ref: swag.ref["@ref"].id,
      name: swagName,
      quantity: swagQuantity,
      category: swagCategory,
      image: swagImage,
    };
    const response = await fetch(".netlify/functions/edit-swag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      const editedSwag = await response.json();
      setSwagData(
        swagData.map((swagItem) =>
          swagItem.ref["@ref"].id === swag.ref["@ref"].id
            ? editedSwag.message
            : swagItem
        )
      );
      onClose();
    }
  };

  const dialogTitle = swag?.ref["@ref"].id ? "Edit Swag Item" : "Add Swag Item";

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Swag Name"
            variant="standard"
            value={swagName}
            onChange={(event) => setSwagName(event.target.value)}
          />
          <TextField
            label="Swag Quantity"
            variant="standard"
            value={swagQuantity}
            onChange={(event) => setSwagQuantity(event.target.value)}
          />
          <TextField
            label="Swag Category"
            variant="standard"
            value={swagCategory}
            onChange={(event) => setSwagCategory(event.target.value)}
          />
          <TextField
            label="Swag Image"
            variant="standard"
            value={swagImage}
            onChange={(event) => setSwagImage(event.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SwagDialog;
