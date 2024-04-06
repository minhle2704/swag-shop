import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

function Header({
  user,
  swagOrders,
  handleClickOpenAddSwagDialog,
  postSwagOrdersInCart,
  resetData,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false);
  const buttonRef = useRef();
  const upMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const handleClick = () => {
    setShouldOpenMenu(true);
  };
  const handleClose = () => {
    setShouldOpenMenu(false);
  };

  const handleClickLogOut = async () => {
    handleClose();
    postSwagOrdersInCart();
    resetData();
    navigate("/sign-in");
  };

  const handleClickMyOrder = () => {
    handleClose();
    navigate("/my-order");
  };

  const handleClickMyProfile = () => {
    handleClose();
    navigate("/my-profile");
  };

  return (
    <AppBar position="sticky">
      <Stack
        direction={upMd ? "row" : "column"}
        justifyContent="space-between"
        alignItems="center"
        padding={3}
        spacing={3}
      >
        <Typography variant="h4" color="white.main">
          Swag Shop Order
        </Typography>

        {pathname !== "/sign-in" &&
          pathname !== "/sign-up" &&
          pathname !== "/forget-password" &&
          pathname !== "/reset-password" && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button ref={buttonRef} onClick={handleClick} color="white">
                Hello {user?.firstName}
              </Button>
              <Menu
                anchorEl={buttonRef.current}
                open={shouldOpenMenu}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClickMyProfile}>My Profile</MenuItem>
                <MenuItem onClick={handleClickMyOrder}>My Order</MenuItem>
                <MenuItem onClick={handleClickLogOut}>Logout</MenuItem>
              </Menu>

              <Divider
                color="white"
                orientation="vertical"
                variant="middle"
                flexItem
              />

              {pathname !== "/" && (
                <HomeIcon className="clickable" onClick={() => navigate("/")} />
              )}

              <Badge
                badgeContent={Object.keys(swagOrders).length}
                color="secondary"
                onClick={() => navigate("/my-cart")}
              >
                <ShoppingCartIcon className="clickable" />
              </Badge>

              {user?.role === "admin" && (
                <>
                  <Divider
                    color="white"
                    orientation="vertical"
                    variant="middle"
                    flexItem
                  />

                  <Fab size="small" color="secondary">
                    <AddIcon
                      fontSize="small"
                      onClick={handleClickOpenAddSwagDialog}
                    />
                  </Fab>
                </>
              )}
            </Stack>
          )}
      </Stack>
    </AppBar>
  );
}

export default Header;
