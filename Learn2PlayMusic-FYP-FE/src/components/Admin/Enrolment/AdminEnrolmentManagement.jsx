import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Container, IconButton, Tooltip, Typography } from "@mui/material";
import { API, Auth } from "aws-amplify";
import MaterialReactTable from "material-react-table";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Loader from "../../utils/Loader";
const TransitionModal = lazy(() => import("../../utils/TransitionModal"));
const EnrolUserForm = lazy(() => import("./EnrolUserForm"));
const UnenrolUserForm = lazy(() => import("./UnenrolUserForm"));

const AdminEnrolmentManagement = ({ userInfo }) => {
  // table data
  const [data, setData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [userCoursesEnrolled, setUserCoursesEnrolled] = useState([{ userid: [{ PK: "", SK: "", CourseSlot: "", CourseName: "", TeacherId: "" }] }]);

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

  const listNonAdminUsers = async () => {
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
    let nonAdminUsersData = [];
    userData.forEach((user) => {
      const userAttributes = user.Attributes.reduce((usr, { Name, Value }) => {
        if (Name.startsWith("custom:")) {
          let k = Name.split(":")[1];
          usr[k.charAt(0).toUpperCase() + k.slice(1)] = Value;
        } else {
          usr[Name] = Value;
        }
        return usr;
      }, {});
      user.Attributes = userAttributes;
      if (user.Attributes.Role != "Admin" && user.Enabled) {
        fetchedUserIds.push(user.Username);
        user.UserStatus = user.UserStatus == "FORCE_CHANGE_PASSWORD" ? "Change Password" : "Confirmed";
        let date = new Date(user.UserCreateDate);
        let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        user.UserCreateDate = formattedDate;
        nonAdminUsersData.push(user);
      }
    });
    // settle courses user is enrolled in
    let userCoursesDict = await postAPIWithBody(`${import.meta.env.VITE_API_URL}/user/course/enrolled`, { userIds: fetchedUserIds });
    setUserCoursesEnrolled(userCoursesDict);
    setData(nonAdminUsersData);
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
    setToUnEnrolCourse(course);
    setToUnEnrolUser(user);
  };
  const unEnrolSingleUserSuccessClose = () => {
    setToUnEnrolCourse("");
    setToUnEnrolUser("");
    setReloadData(!reloadData);
    setOpenUnEnrolUser(false);
  };
  // useEffect ==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
  useEffect(() => {
    let start = new Date().getTime();
    Promise.all([listNonAdminUsers()]).then(() => {
      setOpen(false);
      console.log("time taken to load users: " + (new Date().getTime() - start) / 1000 + "s");
    });

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
        accessorKey: "Attributes.email",
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
        accessorKey: "",
        id: "enrol",
        header: "Enrol",
        Cell: ({ cell, row }) =>
          row.original.Attributes.Role != "Admin" ? (
            <Tooltip title="Enrol user to course" placement="bottom">
              <IconButton
                variant="contained"
                color="info"
                onClick={() => {
                  enrolUser(row.original);
                }}>
                <AddCircleIcon />
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
      <Suspense fallback={<Loader open={open} />}>
        <Box m={2}>
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
            Course Enrolment Management
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
            initialState={{
              density: "compact",
              sorting: [
                { id: "role", desc: false },
                { id: "name", desc: false },
              ],
            }}
            renderTopToolbarCustomActions={({ table }) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}>
                  <Button variant="contained" onClick={enrolMultipleUsers} disabled={table.getSelectedRowModel().flatRows.length === 0}>
                    Enrol Users
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
              </Box>
            )}></MaterialReactTable>
        </Box>
        <Typography variant="body2" sx={{ m: 1, mt: 4 }}>
          <b>Note:</b> Admin users cannot be enrolled in courses.
        </Typography>
        <Loader open={open} />
      </Suspense>
    </Container>
  );
};

export default AdminEnrolmentManagement;
