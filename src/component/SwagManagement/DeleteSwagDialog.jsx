import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function DeleteSwagDialog({ swag, setSwagData, handleCloseDeleteSwagDialog }) {
  const handleDeleteSwag = async () => {
    const payload = {
      id: swag.ref["@ref"].id,
    };
    const response = await fetch("/.netlify/functions/archive-swag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      const result = await response.json();
      setSwagData(result.message);
    }
  };

  return (
    <Dialog open={true} onClose={handleCloseDeleteSwagDialog}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Do you want to delete this swag item?</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteSwagDialog}>Cancel</Button>
        <Button onClick={handleDeleteSwag} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteSwagDialog;
