import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header";
import { CONTRACT_ADDRESS } from "./utils/constants";
import TronWeb from "tronweb";
import Dialog from "./components/dialog";
import { ToastContainer, toast } from "react-toastify";
import background from "./assets/background2.jpg";
import { useHistory } from "react-router-dom";

import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import img from "./images/copy.png";
import {
  Grid,
  Paper,
  makeStyles,
  Box,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  useTheme,
  IconButton,
  TableHead,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Typography, createMuiTheme, Input } from "@material-ui/core";

import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";

import { useStyles } from "./styles";
import moment from "moment";
import {
  LastPage,
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import TronGrid from "trongrid";

const useStyles2 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  table: {
    minWidth: 500,
  },
}));

const App = () => {
  let mainAccount = "";
  const history = useHistory();

  const { t, i18n } = useTranslation();

  const [accountAddress, setAccountAddress] = useState("");

  const [poolPrize, setPoolPrize] = useState("");
  const [dateObj, setDateObj] = useState("....");
  const [dateSObj, setDateSObj] = useState("....");

  const [soldTickets, setSoldTickets] = useState("....");
  const [totalTickets, setTotalTickets] = useState("....");
  const [boughtTickets, setBoughtTickets] = useState("....");
  const [myReferal, setMyReferal] = useState("....");
  const [trxtBalance, setTrxBalance] = useState("0");
  const [openModel, setOpenModel] = useState(false);

  const classes = useStyles();
  const useStyles2 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(0),
    },
    table: {
      minWidth: 200,
    },
  }));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModel = () => {
    setOpenModel(true);
  };
  const handleCloseModel = () => {
    setOpenModel(false);
  };
  async function Ethereum() {
    try {
      mainAccount = await window?.tronWeb?.defaultAddress?.base58;

      if (mainAccount) {
        setAccountAddress(mainAccount);
        localStorage.setItem("mainAccount", mainAccount);
        setTimeout(() => {
          getData();
          getBalanceOfAccount();
          getTicketsData();
          getUserDetails();
          getContractTransferEventsByUser();
        }, 100);
      } else {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider("https://api.trongrid.io");
        const solidityNode = new HttpProvider("https://api.trongrid.io");
        const eventServer = "https://api.trongrid.io/";
        const gettronWeb = new TronWeb(fullNode, solidityNode, eventServer);
        setTimeout(() => {
          getData();
        }, 100);

        toast.warning("Please login or install tron wallet!");
      }
    } catch (error) {
      toast.error(error.message);

      console.log("error", error.message);
    }
  }
  async function getTicketsData() {
    try {
      let contract = await window?.tronWeb?.contract().at(CONTRACT_ADDRESS);
      let soldT = await contract.GetSoldTickets().call();
      setSoldTickets(parseInt(soldT));

      let totalT = await contract.Get_Ticket_Amount().call();
      setTotalTickets(parseInt(totalT));
    } catch (e) {
      console.log(e);
    }
  }
  async function getData() {
    try {
      let contract = await window?.tronWeb?.contract().at(CONTRACT_ADDRESS);
      let winnerLength = await contract.getWinnersLength().call();
      winnerLength = parseInt(winnerLength);
      let pool_prize = await contract.Get_Prize_Pool().call();
      setPoolPrize(pool_prize?._hex / 1000000);
    } catch (error) {
      console.log("error", error);
    }
  }
  const getBalanceOfAccount = async () => {
    try {
      await window.tronWeb.trx.getBalance(mainAccount, function (err, res) {
        var blnc = parseInt(res) / 1000000;
        setTrxBalance(blnc.toFixed(3));
      });
    } catch (e) {
      console.log("blnc", e);
    }
  };

  const getUserDetails = async () => {
    try {
      let contract = await window?.tronWeb?.contract().at(CONTRACT_ADDRESS);

      let winnerLength = await contract.UserDetail().call();

      setMyReferal(parseInt(winnerLength.Referrals));
      setBoughtTickets(parseInt(winnerLength.BoughtTickets));
    } catch (error) {
      console.log("getUserDetails", error);
    }
  };
  const getContractTransferEventsByUser = async (eventName) => {
    let result = [];
    let tronGrid = new TronGrid(window?.tronWeb);
    try {
      let continueToken = "";
      let res = await tronGrid.contract.getEvents(CONTRACT_ADDRESS, {
        only_confirmed: true,
        event_name: "Winner1Status",
        limit: 30,
      });

      let newArr = [];
      let i = 0;

      let resreferal = await tronGrid.contract.getEvents(CONTRACT_ADDRESS, {
        only_confirmed: true,
        event_name: "Winner1referral",
        limit: 30,
      });

      let res2 = await tronGrid.contract.getEvents(CONTRACT_ADDRESS, {
        only_confirmed: true,
        event_name: "Winner2Status",
        limit: 30,
      });
      let res2referal = await tronGrid.contract.getEvents(CONTRACT_ADDRESS, {
        only_confirmed: true,
        event_name: "Winner2referral",
        limit: 30,
      });
      while (i < res.data.length) {
        newArr.push({
          msg: res.data[i].result._msg,
          transaction_id: window.tronWeb.address.fromHex(
            res.data[i].result.player
          ),
          token: res.data[i].result.amount,
          source: res.data[i].block_timestamp,
        });
        newArr.push({
          msg: resreferal.data[i].result._msg,
          transaction_id: window.tronWeb.address.fromHex(
            resreferal.data[i].result.player
          ),
          token: resreferal.data[i].result.amount,
          source: resreferal.data[i].block_timestamp,
        });
        newArr.push({
          msg: res2.data[i].result._msg,
          transaction_id: window.tronWeb.address.fromHex(
            res2.data[i].result.player
          ),
          token: res2.data[i].result.amount,
          source: res2.data[i].block_timestamp,
        });
        newArr.push({
          msg: res2referal.data[i].result._msg,
          transaction_id: window.tronWeb.address.fromHex(
            res2referal.data[i].result.player
          ),
          token: res2referal.data[i].result.amount,
          source: res2referal.data[i].block_timestamp,
        });
        i++;
      }

      setRows([...newArr]);
    } catch (error) {
      console.error(error);
    } finally {
      return result;
    }
  };
  const copyReferralLink = () => {
    let get = document.getElementById("refer").select();
    document.execCommand("copy");
    toast.success("Copied!");
  };

  useEffect(() => {
    setTimeout(() => {
      Ethereum();
    }, 2000);
    // getData()
  }, []);

  const DrawTicket = async () => {
    if (accountAddress && accountAddress !== "") {
      let contract = await window?.tronWeb?.contract().at(CONTRACT_ADDRESS);
      contract
        .Draw_Ticket()
        .send({
          shouldPollResponse: true,
        })
        .then((output) => {
          console.log("- Output:", output, "\n");
          toast.success("Transaction is complete");
        })
        .catch((e) => {
          toast.error(e.message);
        });
    } else {
      toast.error("TronLink is not connected");
    }
  };
  const handleExplorePage = () => {
    history.push("/explore");
  };
  const [dox, setDox] = useState("/assets/FQAs.pdf");
  const [cdox, setcDox] = useState("/assets/CFQAs.pdf");
  const [fdox, setfDox] = useState("/assets/F-FQAs.pdf");
  const [kdox, setkDox] = useState("/assets/K-FQAs.pdf");
  const [sdox, setsDox] = useState("/assets/S-FQAs.pdf");
  const [doc, setDocs] = useState(dox);

  const checkDox = () => {
    let res = i18n.use(LanguageDetector);
    var lang = res.language;

    switch (lang) {
      case "en":
        setDocs(dox);
        break;
      case "sp":
        setDocs(sdox);
        break;
      case "fr":
        setDocs(fdox);
        break;
      case "chi":
        setDocs(cdox);
        break;
      case "ko":
        setDocs(kdox);
        break;
    }
  };

  return (
    <div
      className="App"
      style={{
        background: ` lightblue url(${background}) no-repeat fixed center`,
      }}
    >
      <Dialog
        accountAddress={accountAddress}
        handleCloseModel={handleCloseModel}
        open={openModel}
      />
      <Header />
      <ToastContainer hideProgressBar={true} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table>
          <tr style={{ border: "#fff solid 1px" }}>
            <th>
              {" "}
              <a
                id="subscribeTypeform"
                href={doc}
                target="_blank"
                rel="noopener"
                className="scrollTo mt-3 animated-button1"
                style={{
                  fontSize: ".9em",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onClick={checkDox}
              >
                {t("explore.1")}
              </a>
            </th>
            <td>
              {t("youraddress.1")}
              <br />
              {accountAddress &&
                accountAddress.slice(0, 5) +
                  "..." +
                  accountAddress.slice(
                    accountAddress.length - 5,
                    accountAddress.length
                  )}
            </td>
            <td>
              {t("Balance.1")}
              <br />
              {trxtBalance}
            </td>
          </tr>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p style={{ maxWidth: "450px", padding: "25px" }}>{t("text.1")}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <span
            id="subscribeTypeform"
            href="#"
            target="_blank"
            rel="noopener"
            className="scrollTo mt-3 animated-button1"
            style={{
              fontSize: ".9em",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={handleOpenModel}
          >
            {t("JOIN.1")}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table>
          <tr>
            <th className="center" colSpan={2}>
              {t("smart.1")}
            </th>
          </tr>
          <tr>
            <td className="center">{t("contect.1")}</td>
            <td className="center">
              <a
                target="_blank"
                href={`https://tronscan.io/#/contract/${CONTRACT_ADDRESS}`}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "#C7B8FF",
                }}
              >
                {CONTRACT_ADDRESS &&
                  CONTRACT_ADDRESS.slice(0, 5) +
                    "..." +
                    CONTRACT_ADDRESS.slice(
                      CONTRACT_ADDRESS.length - 5,
                      CONTRACT_ADDRESS.length
                    )}
              </a>
            </td>
          </tr>
          <tr>
            <td className="center">{t("daat.1")}</td>
            <td className="center">{poolPrize}</td>
          </tr>
          <tr>
            <td className="center">{t("sold.1")}</td>
            <td className="center">{soldTickets}</td>
          </tr>
          <tr>
            <td className="center">{t("tiket.1")}</td>
            <td className="center">{totalTickets}</td>
          </tr>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "50px 0px 0px 0px",
        }}
      >
        <table>
          <tr>
            <th className="center" colSpan={2}>
              {t("info.1")}
            </th>
          </tr>
          <tr>
            <td className="center">{t("address.1")}</td>
            <td className="center">
              <a
                target="_blank"
                href={`https://tronscan.io/#/contract/${accountAddress}`}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "#C7B8FF",
                }}
              >
                {accountAddress &&
                  accountAddress.slice(0, 5) +
                    "..." +
                    accountAddress.slice(
                      accountAddress.length - 5,
                      accountAddress.length
                    )}
              </a>
            </td>
          </tr>
          <tr>
            <td className="center">{t("balence.1")}</td>
            <td className="center">{trxtBalance}</td>
          </tr>
          <tr>
            <td className="center">{t("Bought.1")}</td>
            <td className="center">{boughtTickets}</td>
          </tr>
          <tr>
            <td className="center">{t("Refferals.1")}</td>
            <td className="center">{myReferal}</td>
          </tr>

          <tr>
            <td className="center">{t("Link.1")}</td>
            <td className="center">
              <Input
                style={{ color: "rgb(142, 205, 241)" }}
                type="text"
                id="refer"
                value={`${window.location.protocol}//${window.location.host}/login?ref=${accountAddress}`}
                readonly
              />
            </td>
          </tr>
          <tr>
            <th className="center" colSpan={2}>
              <button className="btnreferal" onClick={copyReferralLink}>
                {" "}
                {t("copy.1")}
              </button>
            </th>
          </tr>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2em 0em 4em 0em",
          margin: "0 ",
        }}
      >
        <Grid item xs={9}>
          <div>
            <h6 className="white rafflecenter" style={{}}>
              {t("Raffle.1")}
            </h6>
          </div>
          <TableContainer>
            <Table
              className={classes.table}
              aria-label="custom pagination table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    className="center"
                    style={{
                      width: 160,
                      border: "1px solid #fff",
                      padding: "10px",
                      color: "#fff",
                      position: "relative",
                      fontSize: "1.2rem",
                      marginBottom: "0rem",
                      fontWeight: "500",
                    }}
                    align="center"
                  >
                    {t("Winners.1")}
                  </TableCell>
                  <TableCell
                    className="center"
                    style={{
                      width: 160,
                      border: "1px solid #fff",
                      padding: "10px",
                      color: "#fff",
                      position: "relative",
                      fontSize: "1.2rem",
                      marginBottom: "0rem",
                      fontWeight: "500",
                    }}
                    align="center"
                  >
                    {t("add.1")}
                  </TableCell>
                  <TableCell
                    className="center"
                    style={{
                      width: 160,
                      border: "1px solid #fff",
                      padding: "10px",
                      color: "#fff",
                      position: "relative",
                      fontSize: "1.2rem",
                      marginBottom: "0rem",
                      fontWeight: "500",
                    }}
                    align="center"
                  >
                    {t("Prize.1")}
                  </TableCell>
                  <TableCell
                    className="center"
                    style={{
                      width: 160,
                      border: "1px solid #fff",
                      padding: "10px",
                      color: "#fff",
                      position: "relative",
                      fontSize: "1.2rem",
                      marginBottom: "0rem",
                      fontWeight: "500",
                    }}
                    align="center"
                  >
                    {t("Date.1")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row, index) => (
                  <TableRow key={row.transaction_id}>
                    <TableCell
                      className="center"
                      style={{
                        border: "1px solid #fff",
                        padding: "10px",
                        color: "#c7b8ff",
                        position: "relative",
                        fontSize: "1.2rem",
                        marginBottom: "0rem",
                        fontWeight: "500",
                      }}
                      align="center"
                    >
                      {/* {index + 1} */}
                      {row.msg}
                    </TableCell>
                    <TableCell
                      className="center"
                      style={{
                        border: "1px solid #fff",
                        padding: "10px",
                        color: "#c7b8ff",
                        position: "relative",
                        fontSize: "1.2rem",
                        marginBottom: "0rem",
                        fontWeight: "500",
                      }}
                      align="center"
                    >
                      {row.transaction_id.slice(0, 8) +
                        "..." +
                        row.transaction_id.slice(56, 64)}
                    </TableCell>
                    <TableCell
                      className="center"
                      style={{
                        border: "1px solid #fff",
                        padding: "10px",
                        color: "#c7b8ff",
                        position: "relative",
                        fontSize: "1.2rem",
                        marginBottom: "0rem",
                        fontWeight: "500",
                      }}
                      scope="row"
                      align="center"
                    >
                      {row.token / 1000000}
                    </TableCell>

                    <TableCell
                      className="center"
                      style={{
                        border: "1px solid #fff",
                        padding: "10px",
                        color: "#c7b8ff",
                        position: "relative",
                        fontSize: "1.2rem",
                        marginBottom: "0rem",
                        fontWeight: "500",
                      }}
                      align="center"
                    >
                      {moment(row.source).format("MMM/DD/YYYY").toString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    style={{
                      color: "white",
                      backgroundColor: "rgba(255,255,255, 0.3)",
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={4}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      backgroundColor: "white",
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          {/* </Box> */}
        </Grid>
      </div>
      <div></div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p style={{ maxWidth: "450px" }}>{t("does.1")}</p>
      </div>
      <div
        style={{ display: "flex", marginTop: "30px", justifyContent: "center" }}
      >
        <p
          style={{
            maxWidth: "450px",
            padding: "20px",
            fontWeight: "700",
          }}
        >
          &copy;{t("cop.1")}
        </p>
      </div>
    </div>
  );
};

export default App;

function TablePaginationActions(props) {
  const classes = useStyles2();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? (
          <LastPage style={{ color: "white" }} />
        ) : (
          <FirstPage style={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight style={{ color: "white" }} />
        ) : (
          <KeyboardArrowLeft style={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft style={{ color: "white" }} />
        ) : (
          <KeyboardArrowRight style={{ color: "white" }} />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? (
          <FirstPage style={{ color: "white" }} />
        ) : (
          <LastPage style={{ color: "white" }} />
        )}
      </IconButton>
    </div>
  );
}
