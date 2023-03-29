import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Container, Grid, IconButton, Switch, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { API, Auth } from "aws-amplify";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import TransitionModal from "../utils/TransitionModal";
import CreateUserForm from "./CreateUserForm";

const AdminUserManagement = (userInfo) => {
  const theme = useTheme();
  // table data
  const [data, setData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  // const [userIds, setUserIds] = useState([]); // all userIds of users in table (used to fetch for courses the user is enrolled in)
  const [userCoursesEnrolled, setUserCoursesEnrolled] = useState([{ userid: [{ PK: "", SK: "", CourseSlot: "", CourseName: "", TeacherId: "" }] }]);
  // const [userCoursesEnrolled, setUserCoursesEnrolled] = useState([{ userid: "", CourseSlot: "", CourseName: "", }]);

  // loading screen
  const [open, setOpen] = useState(true);
  // all courses -> as options for enroling users to course
  const [allCourses, setAllCourses] = useState([]);
  // enrol user ala carte
  const [openEnrolUser, setOpenEnrolUser] = useState(false);
  const [toEnrolUser, setToEnrolUser] = useState("");
  const [toEnrolCourse, setToEnrolCourse] = useState(""); // used for batch too
  // enrol multiple users;
  const [rowSelection, setRowSelection] = useState([]);
  const [openEnrolMultipleUsers, setOpenEnrolMultipleUser] = useState(false);
  const [toMultipleEnrolUsers, setToMultipleEnrolUsers] = useState([]);
  const [displayText, setDisplayText] = useState("");
  const [userNameToIdMap, setUserNameToIdMap] = useState({});
  //  un-enrol user from course
  const [openUnEnrolUser, setOpenUnEnrolUser] = useState(false);
  const [toUnEnrolUser, setToUnEnrolUser] = useState("");
  const [toUnEnrolCourse, setToUnEnrolCourse] = useState("");
  // create user
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [roles, setRoles] = useState([]);
  // diable user
  const [openDisableUser, setOpenDisableUser] = useState(false);
  const [toDisableUser, setToDisableUser] = useState("");
  // enable user
  const [openEnableUser, setOpenEnableUser] = useState(false);
  const [toEnableUser, setToEnableUser] = useState("");
  // delete user
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [toDeleteUser, setToDeleteUser] = useState("");

  function modalStyle(w) {
    return {
      position: "relative",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: w,
      bgcolor: "background.paper",
      borderRadius: 2,
      p: 4,
    };
  }
  const largeModalWidth = { xs: "90%", sm: "60%", md: "40%", lg: "40%", xl: "40%" };
  const smallModalWidth = { xs: "60%", sm: "40%", md: "30%", lg: "25%", xl: "20%" };

  // list groups ================================================================================================================================================================================================================================================================================
  const listGroups = async () => {
    let apiName = "AdminQueries";
    let path = "/listGroups";
    let myInit = {
      queryStringParameters: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    };
    let groups = await API.get(apiName, path, myInit);
    var rs = [];
    for (let idx in groups.Groups) {
      let groupName = groups.Groups[idx].GroupName;
      rs.push(groupName.substr(0, groupName.length - 1));
    }
    setRoles(rs);
  };
  // list users ================================================================================================================================================================================================================================================================================
  const listUsers = async () => {
    let apiName = "AdminQueries";
    let path = "/listUsers";
    let myInit = {
      queryStringParameters: {},
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
    };
    let users = await API.get(apiName, path, myInit);
    let userData = users.Users;
    let fetchedUserIds = [];
    for (let idx in userData) {
      fetchedUserIds.push(userData[idx].Username);
      for (let attributeIdx in userData[idx]["Attributes"]) {
        if (userData[idx]["Attributes"][attributeIdx]["Name"] == "email") {
          userData[idx]["Attributes"].Email = userData[idx]["Attributes"][attributeIdx]["Value"];
        } else if (userData[idx]["Attributes"][attributeIdx]["Name"] == "custom:name") {
          userData[idx]["Attributes"].Name = userData[idx]["Attributes"][attributeIdx]["Value"];
        } else if (userData[idx]["Attributes"][attributeIdx]["Name"] == "custom:role") {
          userData[idx]["Attributes"].Role = userData[idx]["Attributes"][attributeIdx]["Value"];
        }
      }
      userData[idx]["Enabled"] = userData[idx]["Enabled"] ? "Enabled" : "Disabled";
      userData[idx]["UserStatus"] = userData[idx]["UserStatus"] == "FORCE_CHANGE_PASSWORD" ? "Change Password" : "Confirmed";

      let date = new Date(userData[idx]["UserCreateDate"]);
      let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      userData[idx]["UserCreateDate"] = formattedDate;
    }
    // settle courses user is enrolled in
    let userCoursesDict = await postAPIWithBody(`${import.meta.env.VITE_API_URL}/user/course/enrolled`, { userIds: fetchedUserIds });
    setUserCoursesEnrolled(userCoursesDict);
    console.log(userData);
    setData(userData);
  };
  // enrol multiple users================================================================================================================================================================================================================================================================================
  function enrolMultipleUsers() {
    let toEnrolUsers = Object.keys(rowSelection).map((key) => data[key]);
    let temp = "";
    let tempMap = {};
    for (let i = 0; i < toEnrolUsers.length; i++) {
      // add to username & userid mapping
      tempMap[toEnrolUsers[i].Username] = toEnrolUsers[i].Attributes.Name;
      // add to display text for confirmation screen
      if (i == toEnrolUsers.length - 1) {
        temp += toEnrolUsers[i].Attributes.Name;
      } else {
        temp += toEnrolUsers[i].Attributes.Name + ", ";
      }
    }
    setDisplayText(temp);
    setUserNameToIdMap(tempMap);
    setToMultipleEnrolUsers(toEnrolUsers);
    setOpenEnrolMultipleUser(true);
  }

  const confirmEnrolMultipleUsers = async () => {
    setOpen(true);
    if (toEnrolCourse == null) {
      toast.error("Please select a course");
      return;
    }
    let endpoint = `${import.meta.env.VITE_API_URL}/user/course/enrol`;
    let myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: toEnrolCourse.id,
        userIds: toMultipleEnrolUsers.map((user) => user.Username),
      }),
    };
    let res = await fetch(endpoint, myInit);
    const response = await res.json();
    setOpen(false);
    if (res.status == 200 || (res.status == 202 && response.alreadyEnrolled.length == 0 && response.doesNotExist.length == 0)) {
      toast.success("Successfully enrolled all the selected users");
    } else if (res.status == 202) {
      if (response.alreadyEnrolled.length != 0) {
        const alreadyEnrolled = response.alreadyEnrolled.map((user) => userNameToIdMap[user]).join(", ");
        toast.warning(`The following users are already enrolled in the course: ${alreadyEnrolled}`);
      }
      if (response.doesNotExist.length != 0) {
        const doesNotExist = response.doesNotExist.map((usr) => userNameToIdMap[usr].join(", "));
        toast.error(`The following users with the user IDs do not exist: ${doesNotExist}`);
      }
      if (response.enrolled.length != 0) {
        const successfullyEnrolled = response.enrolled.map((usr) => userNameToIdMap[urs].join(", "));
        toast.success("Successfully enrolled all these users: " + successEnrolTxt.substring(0, successEnrolTxt.length - 2));
      }
    } else {
      toast.error(response.messsage);
    }
    // reset
    setOpenEnrolMultipleUser(false);
    setUserNameToIdMap({});
    setDisplayText("");
    setToMultipleEnrolUsers([]);
    return;
  };

  // enrol user ala carte================================================================================================================================================================================================================================================================================
  const enrolUser = async (user) => {
    setOpenEnrolUser(true);
    setToEnrolUser(user);
  };

  const confirmEnrolUser = async () => {
    if (toEnrolCourse == null) {
      toast.error("Please select a course");
      return;
    }
    let endpoint = `${import.meta.env.VITE_API_URL}/user/course?courseId=${toEnrolCourse.id}&userId=${toEnrolUser.Username}`;
    let myInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(endpoint, myInit);
    let data = await res.json();
    if (res.status == 202) {
      toast.warning(toEnrolUser.Attributes.Name + " has already been enrolled  in " + toEnrolCourse.courseDetails);
    } else if (res.status == 400) {
      toast.error(data.message);
    } else if (res.status == 200) {
      toast.success(toEnrolUser.Attributes.Name + " successfully enrolled in " + toEnrolCourse.courseDetails);
    }
    setToEnrolCourse("");
    setToEnrolUser("");
    setReloadData(!reloadData);
    setOpenEnrolUser(false);
    return;
  };
  // UN-enrol user ===============================================================================================================================================================================================================================================================================
  const unEnrolUser = async (course, user) => {
    setOpenUnEnrolUser(true);
    console.log(course);
    console.log(user);
    setToUnEnrolCourse(course);
    setToUnEnrolUser(user);
  };
  const confirmUnenrolUserFromCourse = async () => {
    let endpoint = `${import.meta.env.VITE_API_URL}/user/course?courseId=${toUnEnrolCourse.SK.split("#")[1]}&userId=${toUnEnrolUser.Username}`;
    let myInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(endpoint, myInit);
    let data = await res.json();
    if (res.status == 202) {
      toast.warning(toUnEnrolUser.Attributes.Name + " has already been unenrolled from " + toUnEnrolCourse.courseDetails);
    } else if (res.status == 400) {
      toast.error(data.message);
    } else if (res.status == 200) {
      toast.success(toUnEnrolUser.Attributes.Name + " successfully unenrolled from " + toUnEnrolCourse.courseDetails);
    }
    setToUnEnrolCourse("");
    setToUnEnrolUser("");
    setReloadData(!reloadData);
    setOpenUnEnrolUser(false);
    return;
  };

  // disable user================================================================================================================================================================================================================================================================================
  const disableUser = async (user) => {
    setOpenDisableUser(true);
    setToDisableUser(user);
    console.log(toDisableUser);
  };

  const confirmDisableUser = async () => {
    let apiName = "AdminQueries";
    let path = "/disableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: toDisableUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    if (success.message) {
      toast.success("User disabled successfully");
      setReloadData(!reloadData);
      setOpenDisableUser(false);
    }
  };
  // enable user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const enableUser = async (user) => {
    setOpenEnableUser(true);
    setToEnableUser(user);
    console.log(toEnableUser);
  };

  const confirmEnableUser = async () => {
    let apiName = "AdminQueries";
    let path = "/enableUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: toEnableUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    console.log(success);
    if (success.message) {
      toast.success("User enabled successfully");
      setReloadData(!reloadData);
      setOpenEnableUser(false);
    }
  };
  // delete user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const deleteUser = async (user) => {
    setOpenDeleteUser(true);
    setToDeleteUser(user);
  };

  const confirmDeleteUser = async () => {
    let apiName = "AdminQueries";
    let path = "/deleteUser";
    let myInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      body: {
        username: toDeleteUser.Username,
      },
    };
    let success = await API.post(apiName, path, myInit);
    if (success.message) {
      toast.success("User deleted successfully");
      setReloadData(!reloadData);
      setOpenDeleteUser(false);
    }
  };

  const createdUser = () => {
    setOpenCreateUser(false);
    setReloadData(!reloadData);
  };

  // useEffect ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  async function postAPIWithBody(endpoint, body) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
  async function getAPI(endpoint) {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  // const getUserCoursesEnrolledAPI = ;
  const getCourses = getAPI(`${import.meta.env.VITE_API_URL}/course`);

  useEffect(() => {
    async function fetchData() {
      const [courses] = await Promise.all([getCourses]);
      // const [userCoursesEnrolled, courses] = await Promise.all([ getCourses]);
      var fetchedCourses = courses.map((course) => {
        const id = course.SK.split("Course#")[1];
        const courseDetails = course.CourseName + " on " + course.CourseSlot;
        return { id, courseDetails };
      });
      setAllCourses(fetchedCourses);
    }

    listUsers();
    listGroups();
    fetchData();
    setOpen(false);
    return () => { };
  }, [reloadData]);

  // table columns ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const columns = useMemo(
    () => [
      {
        accessorKey: "Attributes.Name",
        id: "name",
        header: "Name",
        minSize: 100,
      },
      {
        accessorKey: "Attributes.Email",
        id: "email",
        header: "Email",
        minSize: 100,
      },
      {
        accessorKey: "Attributes.Role",
        id: "role",
        header: "Role",
        size: 30,
      },
      {
        accessorKey: "Enabled",
        id: "enabled",
        header: "Enabled",
        maxSize: 20,
        Cell: ({ cell, row }) =>
          row.original.Username != userInfo.userInfo.id ? (
            <Tooltip title={row.original.Enabled == "Disabled" ? "Enable user" : "Disable user"} placement="bottom">
              <Switch
                color="success"
                checked={row.original.Enabled == "Enabled"}
                onChange={(event) => {
                  if (event.target.checked) {
                    enableUser(row.original);
                  } else {
                    disableUser(row.original);
                  }
                }}></Switch>
            </Tooltip>
          ) : null,
      },
      {
        accessorKey: "",
        id: "enrol",
        header: "Enrol",
        Cell: ({ cell, row }) =>
          row.original.Attributes.Role != "Admin" ? (
            <Tooltip title="Enrol user to course" placement="bottom">
              <IconButton
                variant="contained"
                color="info"
                disabled={row.original.Enabled == "Enabled" ? false : true}
                onClick={() => {
                  enrolUser(row.original);
                }}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          ) : null,
        maxSize: 20,
      },
      {
        accessorKey: "",
        id: "delete",
        header: "Delete",
        Cell: ({ cell, row }) => (
          row.original.Username != userInfo.userInfo.id ? (
            <Tooltip title="Delete user forever" placement="bottom">
              <IconButton
                variant="contained"
                color="error"
                disabled={row.original.Enabled == "Enabled" ? true : false}
                onClick={() => {
                  deleteUser(row.original);
                }}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          ) : null
        ),
        maxSize: 20,
      },
    ],
    []
  );
  // end table columns ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  return (
    <Container maxWidth="xl" sx={{ width: { xs: 1, sm: 0.9 } }}>
      <Box m={2}>
        {/* create user ========================================================================================== */}
        <TransitionModal open={openCreateUser} handleClose={() => setOpenCreateUser(false)} style={modalStyle(largeModalWidth)}>
          {<CreateUserForm roles={roles} handleClose={() => createdUser()} />}
        </TransitionModal>
        {/* delete user ========================================================================================== */}
        <TransitionModal open={openDeleteUser} handleClose={() => setOpenDeleteUser(false)} style={modalStyle(50)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Delete User?
                </Typography>
                <Typography align="center" color="error" variant="subtitle1">
                  Warning: This action cannot be undone.
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {toDeleteUser && toDeleteUser.Attributes.Name}
                </Box>
                <Box>
                  <b>Email:</b> {toDeleteUser && toDeleteUser.Attributes.Email}
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenDeleteUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmDeleteUser()}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* enable user ========================================================================================== */}
        <TransitionModal open={openEnableUser} handleClose={() => setOpenEnableUser(false)} style={modalStyle(50)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Enable User?
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {toEnableUser && toEnableUser.Attributes.Name}
                </Box>
                <Box>
                  <b>Email:</b> {toEnableUser && toEnableUser.Attributes.Email}
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenEnableUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1, color: "black" }} color="success" onClick={() => confirmEnableUser()}>
                  Enable
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* disable user ========================================================================================== */}
        <TransitionModal open={openDisableUser} handleClose={() => setOpenDisableUser(false)} style={modalStyle(50)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Disable User?
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {toDisableUser && toDisableUser.Attributes.Name}
                </Box>
                <Box>
                  <b>Email:</b> {toDisableUser && toDisableUser.Attributes.Email}
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenDisableUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmDisableUser()}>
                  Disable
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* un-enrol user from course ========================================================================================== */}
        <TransitionModal open={openUnEnrolUser} handleClose={() => setOpenUnEnrolUser(false)} style={modalStyle(largeModalWidth)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Un-enrol the following user from course?
                </Typography>
                <Typography align="center" color="error" variant="subtitle1">
                  Warning: This action cannot be undone and will remove all user data from the course forever.
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {toUnEnrolUser && toUnEnrolUser.Attributes.Name}
                </Box>
                <Box>
                  <b>Email:</b> {toUnEnrolUser && toUnEnrolUser.Attributes.Email}
                </Box>
                <Box>
                  <b>Course to be un-enrolled from:</b> {toUnEnrolCourse ? toUnEnrolCourse.CourseName + " on " + toUnEnrolCourse.CourseSlot : null}
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenUnEnrolUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} color="error" onClick={() => confirmUnenrolUserFromCourse()}>
                  Un-enrol
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* enrol user ala carte========================================================================================== */}
        <TransitionModal open={openEnrolUser} handleClose={() => setOpenEnrolUser(false)} style={modalStyle(largeModalWidth)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Enrol User?
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {toEnrolUser && toEnrolUser.Attributes.Name}
                </Box>
                <Box>
                  <b>Email:</b> {toEnrolUser && toEnrolUser.Attributes.Email}
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "left", mt: 1 }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  name="course"
                  id="course"
                  options={allCourses}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.courseDetails}
                  renderInput={(params) => <TextField {...params} label="Course *" />}
                  onChange={(event, newValue) => {
                    setToEnrolCourse(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenEnrolUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnrolUser()}>
                  Enrol
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* enrol multiple users========================================================================================== */}
        <TransitionModal open={openEnrolMultipleUsers} handleClose={() => setOpenEnrolMultipleUser(false)} style={modalStyle(largeModalWidth)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Enrol the following users?
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {displayText}
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "left", mt: 1 }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  name="course"
                  id="course"
                  options={allCourses}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.courseDetails}
                  renderInput={(params) => <TextField {...params} label="Course *" />}
                  onChange={(event, newValue) => {
                    setToEnrolCourse(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenEnrolMultipleUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnrolMultipleUsers()}>
                  Enrol
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* enrol user ala carte ========================================================================================== */}
        <TransitionModal open={openEnrolUser} handleClose={() => setOpenEnrolUser(false)} style={modalStyle(largeModalWidth)}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Enrol User?
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}>
                <Box>
                  <b>Name:</b> {toEnrolUser && toEnrolUser.Attributes.Name}
                </Box>
                <Box>
                  <b>Email:</b> {toEnrolUser && toEnrolUser.Attributes.Email}
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "left", mt: 1 }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  name="course"
                  id="course"
                  options={allCourses}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.courseDetails}
                  renderInput={(params) => <TextField {...params} label="Course *" />}
                  onChange={(event, newValue) => {
                    setToEnrolCourse(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "lightgrey", color: "black", boxShadow: theme.shadows[10], ":hover": { backgroundColor: "hovergrey" } }}
                  onClick={() => {
                    setOpenEnrolUser(false);
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} onClick={() => confirmEnrolUser()}>
                  Enrol
                </Button>
              </Grid>
            </Grid>
          </>
        </TransitionModal>
        {/* main ========================================================================================== */}
        <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
          User Management
        </Typography>
        <MaterialReactTable
          enableHiding={false}
          enableFullScreenToggle={false}
          enableMultiRowSelection={true}
          enableRowSelection={true}
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          enableDensityToggle={false}
          columns={columns}
          data={data}
          initialState={{ density: "compact" }}
          renderTopToolbarCustomActions={({ table }) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenCreateUser(true);
                  }}>
                  Add User
                </Button>
                <Button variant="contained" onClick={enrolMultipleUsers} disabled={table.getSelectedRowModel().flatRows.length === 0}>
                  Enrol User(s)
                </Button>
              </Box>
            );
          }}
          renderDetailPanel={({ row }) => (
            <Box
              sx={{
                display: "grid",
                margin: "auto",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}>
              <Typography variant="body2">
                <b>User Creation Date:</b> {row.original.UserCreateDate}
                <br />
                <b>User Status:</b> {row.original.UserStatus}
              </Typography>
              {row.original.Attributes.Role == "Admin" ? null : (
                <Typography variant="body2">
                  <b>Courses enrolled in:</b>
                  {userCoursesEnrolled[row.original.Username].length == 0
                    ? " None"
                    : userCoursesEnrolled[row.original.Username].map((course) => {
                        return (
                          <span key={course.SK + course.PK}>
                            <br />
                            <IconButton onClick={() => unEnrolUser(course, row.original)}>
                              <CloseIcon fontSize="inherit" color="error"></CloseIcon>
                            </IconButton>
                            {course.CourseName} on {course.CourseSlot}
                          </span>
                        );
                      })}
                </Typography>
              )}

              {/* {data.map((user) => {
                return (
                  <Typography variant="body2" key={user.Username}>
                    {user["CoursesEnrolled"].map((course) => {
                      return (
                        <div key={course}>
                          {course.CourseName} {course.CourseSlot}
                        </div>
                      );
                    })}
                  </Typography>
                );
              })} */}
            </Box>
          )}></MaterialReactTable>
        {/* foot note ==========================================================================================*/}
        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          <b>NOTE:</b>
        </Typography>
        <Typography variant="body2">
          1. User must be disabled before they can be deleted forever.
          <br />
          2. You cannot enable/disable yourself.
        </Typography>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: 999 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default AdminUserManagement;
