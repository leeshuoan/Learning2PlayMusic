// ----------------------------------------------------------------------

export default function Link(theme) {
  return {
    MuiLink: {
      styleOverrides: {
        root: {
          "&:hover": {
            cursor: "pointer",
          },
        }
      },
    },
  };
}
