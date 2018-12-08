/*
Leaf Ciap (alpha)
Web  app para busca de códigos e termos CIAP2 desenvolvido por Leonardo Canela Almeida
*/

// Importando dependências
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Grow from "@material-ui/core/Grow";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import List from "react-virtualized/dist/commonjs/List";
import normalize from "normalize-text";
import Data from "./assets/ciap2.min.json";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "", listLength: Data.length, isOpen: false, isInfoOpen: false };
    this.list = React.createRef();
  }

  //Array com a lista d
  currentList = [];
  componentWillMount() {
    this.currentList = Data;
  }

//abre o cartão de informação de cada CIAP e passa as informações
  handleCard = id => {
    this.setState({ isOpen: true, modalInfo: this.currentList[id] });
    this.modalRender();
  };
  modalRender = () => (
    <React.Fragment>
      {this.state.modalInfo ? (
        <CardHeader
          title={this.state.modalInfo.desc}
          subheader={this.state.modalInfo.codigo}
          style={{ backgroundColor: "#FCD9DF" }}
        />
      ) : null}
      <div
        style={{
          marginTop: "-14px",
          background: "#fff",
          borderRadius: "12px",
          height: "24px",
          width: "100%"
        }}
      />
      <div>
        <ListSubheader>Também pode ser usado para:</ListSubheader>
        {this.renderInfoList("inclusao")}
      </div>
      <ListSubheader>Não deve ser utilizado para:</ListSubheader>
      {this.renderInfoList("exclusao")}
      <div />
    </React.Fragment>
  );
  renderInfoList = prop => {
    let listArr = [];
    if (this.state.modalInfo) {
      for (let i = 0; i < this.state.modalInfo[prop].split(",").length; i++) {
        listArr.push(
          <ListItem key={Math.random() + i} divider>
            {this.state.modalInfo[prop]
              .split(",")[i].trim()
              .charAt(0)
              .toUpperCase() +
              this.state.modalInfo[prop]
                .split(",")[i].trim()
                .slice(1)}
          </ListItem>
        );
      }
    }
    return listArr;
  };

  //Filtra o array de CIAPs de acordo com o texto digitado
  handleSearch = async e => {
    await this.setState({ query: e.target.value });
    let query = new RegExp(normalize(this.state.query));

    let filteredList = Data.filter(
      obj =>
        query.test(normalize(obj.codigo)) || query.test(normalize(obj.desc))
    );
    this.currentList = filteredList;
    this.setState({ listLength: filteredList.length });
  };

  renderRows = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <div style={style} className="li-container" key={key}>
        <ListItem
          onClick={() => this.handleCard(index)}
          divider
          style={{
            paddingTop: "30px",
            lineHeight: "40px",
            height: "100%",
            width: "100%"
          }}
          button
        >
          <ListItemText>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "1em",
                padding: "10px",
                marginRight: "10px",
                borderRadius: "10px",
                background: "#effff1"
              }}
            >
              {this.currentList[index] ? this.currentList[index].codigo : null}
            </label>
            <label
              style={{
                fontSize: "1em"
              }}
            >
              {this.currentList[index] ? this.currentList[index].desc : null}
            </label>
          </ListItemText>
        </ListItem>
      </div>
    );
  };

  render() {
    return (
      <Grid container direction="column" alignItems="center">
        <div
          className="topbar"
          style={{
            background: "#1CAD73",
            width: "100%",
            height: "18px",
            position: "fixed",
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99
          }}
        >
          <Typography style={{ color: "#fff", fontWeight: "bold" }}>
            Leaf Ciap 2.0
          </Typography>
        </div>
        <AppBar
          style={{
            flex: 1,
            top: "18px",
            background: "#1CAD73",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row"
          }}
          position="fixed"
          color="default"
        >
          <Toolbar
            className="search-toolbar"
            variant="dense"
            style={{
              display: "flex",
              height: "40px",
              flex: 1,
              justifyContent: "center",
              flexDirection: "row"
            }}
            disableGutters
          >

            <div style={{ flexGrow: 1 }} />

            <div
              style={{
                transition: "all .7s ease-out",
                width: "200px",
                borderRadius: "8px",
                padding: "3px",
                background: "#fafafa",
                justifySelf: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <SearchIcon />
              <InputBase
                value={this.state.query}
                className="searchInput"
                fullWidth
                style={{ paddingLeft: "5px" }}
                onChange={e => this.handleSearch(e)}
                onFocus={e => {
                  e.target.parentElement.parentElement.style.animation =
                    "typing .6s forwards cubic-bezier(0.795, 0.120, 0.000, 1.480)";

                  document.querySelector(".close-icon").style.opacity = 0.6;
                }}
                onBlur={e => {
                  e.target.parentElement.parentElement.style.animation =
                    "blurSearch .6s forwards ease-in-out";

                  document.querySelector(".close-icon").style.opacity = 0;
                }}
                placeholder="Search…"
              />
              <CloseIcon
                onClick={async e => {
                  e.preventDefault();
                  await this.setState({ query: "" });
                  console.log(this.state);
                }}
                className="close-icon"
                style={{
                  width: "15px",
                  height: "15px",
                  cursor: "pointer",
                  marginRight: "5px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  opacity: 0,
                  transition: ".5 linear"
                }}
              />
            </div>

            <div style={{ flexGrow: 1 }} />
            <IconButton onClick={() => this.setState({isInfoOpen: true})}>
              <InfoIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid style={{ width: "100%" }} item>
          <List
            ref={this.list}
            height={window.innerHeight * 0.9}
            rowCount={this.state.listLength}
            rowHeight={80}
            rowRenderer={this.renderRows}
            width={window.innerWidth}
            overscanColumnCount={10}
            className="list-container"
          />
        </Grid>
<Modal open={this.state.isInfoOpen} disableAutoFocus style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
           <Card
              onClick={() => this.setState({ isInfoOpen: false })}
              style={{
                borderRadius: "8px",
                width: "370px",
                height: "45%",
                background: "#fff",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'

              }}
            >
            <CardContent>
              Web App desenvolvido por Leonardo Canela Almeida.
            </CardContent>
            </Card>
          </Modal>
        <Modal
          disableAutoFocus
          onClick={() => this.setState({ isOpen: false })}
          open={this.state.isOpen}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Grow in={this.state.isOpen} timeout={500}>
            <Card
              style={{
                overflowY: "scroll",
                borderRadius: "11px",
                width: "375px",
                height: "82%",
                background: "#fff"
              }}
            >
              <div>{this.modalRender()}</div>
            </Card>
          </Grow>
        </Modal>
      </Grid>
    );
  }
}

