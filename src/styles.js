import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    paddingRight: "5px",
    width: "100%",
  },
  card: {
    borderRadius: 0,
    backgroundSize: "cover",
    backgroundColor: "#222a31",
    // opacity: 0.8,
    width: "100%",
    padding: 10,
    height: "auto",
    display: "flex",
    flexDirection: "row",
  },
  paper: {
    backgroundColor: "transparent",
    border: 0,
  },
  left: {
    backgroundColor: "#08d765",
    height: 90,
    width: 90,
    borderRadius: 0,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 20,
  },
  tableBox: {
    borderRadius: 20,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)",
    backgroundSize: "cover",
    backgroundColor: "#222a31",
    // padding: 25
  },
  btn: {
    backgroundColor: "#1282C2",
    borderRadius: 20,
    fontSize: 10,
    float: "right",
    color: "white",
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
    "&:hover": {
      backgroundColor: "#1282C2",
    },
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2px solid #19B5CD",
    padding: 25,
  },
  table: {
    minWidth: 500,
  },
  tableTransparnet: {
    padding: 25,
    borderRadius: 20,
    opacity: ".5",
    backgroundColor: "#222a31",
    backgroundSize: "cover",
    // backgroundColor: "#326BB1",
  },
  tableHeader: {
    backgroundColor: "#222a31",
  },
  tableBody: {},
}));
