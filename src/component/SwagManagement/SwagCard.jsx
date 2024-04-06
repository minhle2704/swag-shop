import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Menu from "@mui/material/Menu";
import Paper from "@mui/material/Paper";

import SwagDialog from "./SwagDialog";
import DeleteSwagDialog from "./DeleteSwagDialog";
import { Typography } from "@mui/material";

function SwagCard({
  user,
  swag,
  swagData,
  orderQuantity,
  setSwagData,
  updateSwagOrders,
}) {
  const [quantity, setQuantity] = useState(orderQuantity || "");
  const [shouldOpenManageSwagMenu, setShouldOpenManageSwagMenu] =
    useState(false);
  const [shouldOpenEditSwagDialog, setShouldOpenEditSwagDialog] =
    useState(false);
  const [shouldOpenDeleteSwagDialog, setshouldOpenDeleteSwagDialog] =
    useState(false);

  const manageSwagButton = useRef();

  const handleQuantityChange = (input) => {
    if (input === "") {
      setQuantity(input);
      return;
    }

    const quantity = parseInt(input);

    if (isNaN(quantity)) {
      return;
    }

    setQuantity(quantity);
  };

  const handleAddToCart = () => {
    updateSwagOrders(swag, quantity);
  };

  const handleClickOpenManageSwagMenu = () => {
    setShouldOpenManageSwagMenu(true);
  };

  const handleCloseManageSwagMenu = () => {
    setShouldOpenManageSwagMenu(false);
  };

  const handleClickOpenEditSwagDialog = () => {
    setShouldOpenManageSwagMenu(false);
    setShouldOpenEditSwagDialog(true);
  };

  const handleCloseEditSwagDialog = () => {
    setShouldOpenEditSwagDialog(false);
  };

  const handleOpenDeleteSwagDialog = () => {
    setshouldOpenDeleteSwagDialog(true);
  };

  const handleCloseDeleteSwagDialog = () => {
    setShouldOpenManageSwagMenu(false);
    setshouldOpenDeleteSwagDialog(false);
  };

  const canAddToCart = quantity > 0;
  const canManageSwag = user.role === "admin";

  return (
    <Paper elevation={1}>
      <Stack padding={1} alignItems="center" spacing={2}>
        <Typography variant="h6" textAlign="center">
          {swag.data.name}
        </Typography>

        <img className="swag-card-image" alt="" src={swag.data.image} />

        <Typography variant="body">Stock: {swag.data.quantity}</Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="quantity-label">Quantity</InputLabel>
            <Select
              labelId="quantity-label"
              value={quantity}
              label="Quantity"
              onChange={(event) => handleQuantityChange(event.target.value)}
            >
              {[...Array(Math.min(10, swag.data.quantity)).keys()]
                .map((x) => x + 1)
                .map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {canAddToCart && (
            <AddShoppingCartIcon
              className="clickable"
              onClick={handleAddToCart}
            />
          )}

          {canManageSwag && (
            <>
              <Button
                color="secondary"
                ref={manageSwagButton}
                onClick={handleClickOpenManageSwagMenu}
              >
                Manage Swag
              </Button>
              <Menu
                anchorEl={manageSwagButton.current}
                open={shouldOpenManageSwagMenu}
                onClose={handleCloseManageSwagMenu}
              >
                <MenuItem onClick={handleClickOpenEditSwagDialog}>
                  Edit Swag
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteSwagDialog}>
                  Delete Swag
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>

        {shouldOpenEditSwagDialog && (
          <SwagDialog
            swag={swag}
            swagData={swagData}
            setSwagData={setSwagData}
            onClose={handleCloseEditSwagDialog}
          />
        )}

        {shouldOpenDeleteSwagDialog && (
          <DeleteSwagDialog
            swag={swag}
            setSwagData={setSwagData}
            handleCloseDeleteSwagDialog={handleCloseDeleteSwagDialog}
          />
        )}
      </Stack>
    </Paper>
  );
}

export default SwagCard;
