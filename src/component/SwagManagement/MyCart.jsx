import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

function MyCart({
  swagOrders,
  decreaseSwagOrder,
  increaseSwagOrder,
  removeSwagOrder,
}) {
  const navigate = useNavigate();

  const handleDecrease = (id, quantity) => {
    if (quantity > 1) {
      decreaseSwagOrder(id);
    } else {
      removeSwagOrder(id);
    }
  };

  return (
    <Stack spacing={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Swag Name</TableCell>
            <TableCell align="left">Ordered Quantity</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(swagOrders).map((swagOrder) => (
            <TableRow key={swagOrder.id}>
              <TableCell align="left">{swagOrder.name}</TableCell>
              <TableCell align="left">
                <Stack direction="row" alignItems="center" spacing={3}>
                  <RemoveIcon
                    className="clickable"
                    onClick={() =>
                      handleDecrease(swagOrder.id, swagOrder.quantity)
                    }
                  />
                  <div>{swagOrder.quantity}</div>
                  <AddIcon
                    className="clickable"
                    onClick={() => increaseSwagOrder(swagOrder.id)}
                  />
                </Stack>
              </TableCell>
              <TableCell align="left">
                <DeleteIcon
                  className="clickable"
                  onClick={() => removeSwagOrder(swagOrder.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Stack direction="row" justifyContent="right">
        <Button
          disabled={!Object.values(swagOrders).length}
          onClick={() => navigate("/check-out")}
        >
          Check out
        </Button>
      </Stack>
    </Stack>
  );
}

export default MyCart;
