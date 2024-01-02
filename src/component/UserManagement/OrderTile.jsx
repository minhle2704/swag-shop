import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function OrderTile({ order }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Oder Number # {order.ref["@ref"].id}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Swag ID</TableCell>
              <TableCell align="right">Swag Name</TableCell>
              <TableCell align="right">Order Quantity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(order.data.order).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
}

export default OrderTile;
