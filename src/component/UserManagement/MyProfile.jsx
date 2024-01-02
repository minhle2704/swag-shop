import React from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import { USER_PROP_STRINGS } from "../../constants";

function MyProfile({ user }) {
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Stack spacing={4} width="50ch">
      <Table>
        <TableBody>
          {Object.entries(user)
            .filter(([key]) => USER_PROP_STRINGS[key])
            .map(([key, val]) => (
              <TableRow key={key}>
                <TableCell>{USER_PROP_STRINGS[key]}</TableCell>
                <TableCell align="left">{val}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell>Password</TableCell>
            <TableCell align="left">
              <Button onClick={() => navigate("/change-password")}>
                Change Password
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}

export default MyProfile;
