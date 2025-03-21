import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";
import {
  Avatar,
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  Button,
} from "@mantine/core";
const AuthDetails = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthDetails must be used within an AuthProvider");
  }

  const { user, logOutUser } = context;

  return (
    <div>
      {user ? (
        <Menu closeOnClickOutside closeOnItemClick>
          <MenuTarget>
            <Avatar bg="white" color="#3d8d7a" radius="xl" />
          </MenuTarget>
          <MenuDropdown>
            <MenuItem component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem>
              <Button variant="subtle" onClick={logOutUser} fullWidth>
                Sign Out
              </Button>
            </MenuItem>
          </MenuDropdown>
        </Menu>
      ) : (
        <Menu closeOnClickOutside closeOnItemClick>
          <MenuTarget>
            <Avatar radius="xl" />
          </MenuTarget>
          <MenuDropdown>
            <MenuItem component={Link} to="/signin">
              Log In
            </MenuItem>
            <MenuItem component={Link} to="/signup">
              Register
            </MenuItem>
          </MenuDropdown>
        </Menu>
      )}
    </div>
  );
};

export default AuthDetails;
