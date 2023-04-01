import ChatIcon from "@mui/icons-material/Chat";
import Logout from "@mui/icons-material/Logout";
import { AppBar, Avatar, Box, Container, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { Auth, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const AdminAppBar = ({ userInfo, handleResetUserInfo }) => {
  const pages = ["Announcements", "Courses", "Users", "Enrolments"];
  const { category } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (userInfo.profileImage != "none") {
      Storage.get(userInfo.profileImage, { level: "protected" })
        .then((res) => {
          setImage(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userInfo]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleResetUserInfo();
    Auth.signOut()
      .then(() => {
        console.log("Signed out");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

  return (
    <>
      {
        <AppBar position="sticky" sx={{ bgcolor: theme.palette.background.paper, zIndex: 9999 }}>
          <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
            <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* MOBILE NAV */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={() => navigate(`/admin/${page.toLowerCase()}`)}>
                      <Typography textAlign="center" variant="body2">
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* left part of Nav bar */}
              {/* normal */}
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  disableRipple
                  onClick={() => {
                    navigate("/admin");
                  }}>
                  <img src="/l2pm_logo.png" width="150px" />
                </IconButton>
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => navigate(`/admin/${page.toLowerCase()}`)}>
                    <Typography textAlign="center" variant="body2">
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
              {/* mobile */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  disableRipple
                  onClick={() => {
                    navigate("/admin");
                  }}>
                  <img src="/l2pm_logo.png" width="150px" />
                </IconButton>
              </Box>
              {/* end left part of Nav bar */}

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
                      ml: 1.6,
                      width: 32,
                      height: 32,
                      bgcolor: "grey[100]",
                      "&:hover": { cursor: "pointer" },
                    }}>
                    <ChatIcon onClick={() => navigate("/chat")} />
                  </Avatar>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
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
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}>
                    <Avatar src={image} />
                    My Profile
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

export default AdminAppBar;
