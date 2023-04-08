import { useState } from "react";
import { List, ListItemButton, ListItemText, Box, IconButton } from "@mui/material";
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@mui/icons-material";

const itemsPerPage = 8;

const PaginatedContactList = ({ contacts, startChat }) => {
  const [page, setPage] = useState(0);
  const numPages = Math.ceil(contacts.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFirstPageButtonClick = () => {
    handlePageChange(0);
  };

  const handleBackButtonClick = () => {
    handlePageChange(page - 1);
  };

  const handleNextButtonClick = () => {
    handlePageChange(page + 1);
  };

  const handleLastPageButtonClick = () => {
    handlePageChange(numPages - 1);
  };

  const menuItems = contacts
    .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
    .map((contact) => (
      <ListItemButton key={contact.id} onClick={() => startChat(contact)}>
        <ListItemText primary={`[${contact.role}] ${contact.name}`} />
      </ListItemButton>
    ));

  return (
    <List component="nav" aria-label="contacts list">
      {menuItems}
      {numPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
            <FirstPage />
          </IconButton>
          <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={handleNextButtonClick} disabled={page === numPages - 1}>
            <KeyboardArrowRight />
          </IconButton>
          <IconButton onClick={handleLastPageButtonClick} disabled={page === numPages - 1}>
            <LastPage />
          </IconButton>
        </Box>
      )}
    </List>
  );
};

export default PaginatedContactList;
