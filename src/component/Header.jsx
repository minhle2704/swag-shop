import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <h1>Swag Shop Order</h1>

      {pathname !== "/sign-in" &&
        pathname !== "/sign-up" &&
        pathname !== "/forget-password" &&
        pathname !== "/reset-password" && (
          <Stack direction="row" spacing={4} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Button ref={buttonRef} onClick={handleClick}>
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
            </Stack>

            {user?.role === "admin" && (
              <Fab size="small" color="secondary">
                <AddIcon
                  fontSize="small"
                  onClick={handleClickOpenAddSwagDialog}
                />
              </Fab>
            )}
          </Stack>
        )}
    </Stack>
  );
}

export default Header;
