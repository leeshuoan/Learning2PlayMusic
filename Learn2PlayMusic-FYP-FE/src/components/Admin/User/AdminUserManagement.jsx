import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Backdrop, Box, Button, CircularProgress, Container, IconButton, Switch, Tooltip, Typography } from "@mui/material";
import { API, Auth } from "aws-amplify";
import MaterialReactTable from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import TransitionModal from "../../utils/TransitionModal";
import CreateUserForm from "./CreateUserForm";
import EnrolUserForm from "./EnrolUserForm";
import UnenrolUserForm from "./UnenrolUserForm";
import UserPrompt from "./UserPrompt";

const AdminUserManagement = (userInfo) => {
  // table data
  const [data, setData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  // const [userIds, setUserIds] = useState([]); // all userIds of users in table (used to fetch for courses the user is enrolled in)
  const [userCoursesEnrolled, setUserCoursesEnrolled] = useState([{ userid: [{ PK: "", SK: "", CourseSlot: "", CourseName: "", TeacherId: "" }] }]);
  // const [userCoursesEnrolled, setUserCoursesEnrolled] = useState([{ userid: "", CourseSlot: "", CourseName: "", }]);

  // loading screen
  const [open, setOpen] = useState(true);
  // enrol user ala carte
  const [openEnrolUser, setOpenEnrolUser] = useState(false);
  const [toEnrolUser, setToEnrolUser] = useState("");
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

  // enrol user ala carte================================================================================================================================================================================================================================================================================
  const enrolUser = async (user) => {
    setOpenEnrolUser(true);
    setToEnrolUser(user);
  };
  const enrolSingleUserSuccessClose = () => {
    setToEnrolUser("");
    setReloadData(!reloadData);
    setOpenEnrolUser(false);
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
  const enrolMultipleUsersSuccessClose = () => {
    setOpenEnrolMultipleUser(false);
    setUserNameToIdMap({});
    setDisplayText("");
    setToMultipleEnrolUsers([]);
    setReloadData(!reloadData);
  };
  // UN-enrol user ===============================================================================================================================================================================================================================================================================
  const unEnrolUser = async (course, user) => {
    setOpenUnEnrolUser(true);
    console.log(course);
    console.log(user);
    setToUnEnrolCourse(course);
    setToUnEnrolUser(user);
  };
  const unEnrolSingleUserSuccessClose = () => {
    setToUnEnrolCourse("");
    setToUnEnrolUser("");
    setReloadData(!reloadData);
    setOpenUnEnrolUser(false);
  };
  // disable user================================================================================================================================================================================================================================================================================
  const openDisableUserModal = async (user) => {
    setOpenDisableUser(true);
    setToDisableUser(user);
    console.log(toDisableUser);
  };
  const disableUserSuccessClose = () => {
    setOpenDisableUser(false);
    setReloadData(!reloadData);
  };
  // enable user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const openEnableUserModal = async (user) => {
    setOpenEnableUser(true);
    setToEnableUser(user);
    console.log(toEnableUser);
  };
  const enableUserSuccessClose = () => {
    setOpenEnableUser(false);
    setReloadData(!reloadData);
  };
  // delete user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const openDeleteUserModal = async (user) => {
    setOpenDeleteUser(true);
    setToDeleteUser(user);
  };
  const deleteUserSuccessClose = () => {
    setOpenDeleteUser(false);
    setReloadData(!reloadData);
  };
  // created user ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  const createUserSuccessClose = () => {
    setOpenCreateUser(false);
    setReloadData(!reloadData);
  };
  // useEffect ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  useEffect(() => {
    listUsers();
    listGroups();
    setOpen(false);
    return () => {};
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
          row.original.Attributes.Role != "Admin" ? (
            <Tooltip title={row.original.Enabled == "Disabled" ? "Enable user" : "Disable user"} placement="bottom">
              <Switch
                color="success"
                checked={row.original.Enabled == "Enabled"}
                onChange={(event) => {
                  if (event.target.checked) {
                    openEnableUserModal(row.original);
                  } else {
                    openDisableUserModal(row.original);
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
        Cell: ({ cell, row }) =>
          row.original.Attributes.Role != "Admin" ? (
            <Tooltip title="Delete user forever" placement="bottom">
              <IconButton
                variant="contained"
                color="error"
                disabled={row.original.Enabled == "Enabled" ? true : false}
                onClick={() => {
                  openDeleteUserModal(row.original);
                }}>
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          ) : null,
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
          <CreateUserForm roles={roles} handleClose={() => createUserSuccessClose()} />
        </TransitionModal>

        {/* delete user ========================================================================================== */}
        <TransitionModal open={openDeleteUser} handleClose={() => setOpenDeleteUser(false)} style={modalStyle(smallModalWidth)}>
          <UserPrompt type="Delete" selectedUser={toDeleteUser} handleClose={() => deleteUserSuccessClose()} />
        </TransitionModal>
        {/* enable user ========================================================================================== */}
        <TransitionModal open={openEnableUser} handleClose={() => setOpenEnableUser(false)} style={modalStyle(smallModalWidth)}>
          <UserPrompt type="Enable" selectedUser={toEnableUser} handleClose={() => enableUserSuccessClose()} />
        </TransitionModal>
        {/* disable user ========================================================================================== */}
        <TransitionModal open={openDisableUser} handleClose={() => setOpenDisableUser(false)} style={modalStyle(smallModalWidth)}>
          <UserPrompt type="Disable" selectedUser={toDisableUser} handleClose={() => disableUserSuccessClose()} />
        </TransitionModal>

        {/* enrol user ala carte========================================================================================== */}
        <TransitionModal open={openEnrolUser} handleClose={() => setOpenEnrolUser(false)} style={modalStyle(largeModalWidth)}>
          <EnrolUserForm type="single" toEnrolUser={toEnrolUser} handleClose={() => enrolSingleUserSuccessClose()} displayText="" userNameToIdMap="" />
        </TransitionModal>
        {/* enrol multiple users========================================================================================== */}
        <TransitionModal open={openEnrolMultipleUsers} handleClose={() => setOpenEnrolMultipleUser(false)} style={modalStyle(largeModalWidth)}>
          <EnrolUserForm type="multiple" toEnrolUser={toMultipleEnrolUsers} handleClose={() => enrolMultipleUsersSuccessClose()} displayText={displayText} userNameToIdMap={userNameToIdMap} />
        </TransitionModal>

        {/* un-enrol user from course ========================================================================================== */}
        <TransitionModal open={openUnEnrolUser} handleClose={() => setOpenUnEnrolUser(false)} style={modalStyle(largeModalWidth)}>
          <UnenrolUserForm toUnEnrolUser={toUnEnrolUser} toUnEnrolCourse={toUnEnrolCourse} handleClose={() => unEnrolSingleUserSuccessClose()} />
        </TransitionModal>

        {/* main ========================================================================================== */}
        <Typography variant="h5" sx={{ m: 1, mt: 4 }}>
          User Management
        </Typography>
        <MaterialReactTable
          enableHiding={false}
          enableFullScreenToggle={false}
          enableMultiRowSelection={true}
          positionToolbarAlertBanner="bottom"
          enableRowSelection={(row) => row.original.Attributes.Role != "Admin"}
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
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default AdminUserManagement;
