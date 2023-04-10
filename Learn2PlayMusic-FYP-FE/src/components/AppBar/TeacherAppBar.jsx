import { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, IconButton, Menu, Container, MenuItem, useTheme, Avatar, Divider, ListItemIcon, Tooltip } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import { Auth, Storage } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const TeacherAppBar = ({ userInfo, handleResetUserInfo }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (userInfo.profileImage != "none") {
      Storage.get(userInfo.profileImage, { level: "protected" }).then((res) => {
        setImage(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [userInfo])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleResetUserInfo()
    Auth.signOut().then(() => {
      console.log("Signed out")
      navigate('/')
    }).catch((err) => console.log(err))
  };

  return (
    <>
      {
        <AppBar
          position="sticky"
          sx={{ bgcolor: theme.palette.background.paper }}>
          <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
            <Toolbar
              disableGutters
              sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* MOBILE NAV */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <Avatar
                  sx={{
                    display: { xs: "flex", md: "none" },
                    ml: 1,
                    width: 32,
                    height: 32,
                    bgcolor: "grey[100]",
                    "&:hover": { cursor: "pointer" }
                  }}>
                  <ChatIcon onClick={() => navigate("/chat")} />
                </Avatar>
              </Box>

              <IconButton disableRipple onClick={() => { navigate("/teacher") }}>
                <img src="/l2pm_logo.png" width="150px" />
              </IconButton>

              {/* USER MENU */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}>
                  <Avatar
                    sx={{
                      display: { xs: "none", md: "flex" },
                      ml: 1.6,
                      width: 32,
                      height: 32,
                      bgcolor: "grey[100]",
                      "&:hover": { cursor: "pointer" }
                    }}>
                    <ChatIcon onClick={() => navigate("/chat")} />
                  </Avatar>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 1 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}>
                      <Avatar sx={{ width: 32, height: 32 }} src={image}></Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 25,
                        height: 25,
                        ml: -0.5,
                        mr: 2,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                  <MenuItem onClick={() => { navigate("/profile") }}>
                    <Avatar src={image} />My Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      }
    </>
  );
};

export default TeacherAppBar;
