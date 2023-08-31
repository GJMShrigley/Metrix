import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ClassIcon from "@mui/icons-material/Class";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { toggleSidebar } from "../../store/displaySlice";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <MenuItem
        to={to}
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

const CustomSidebar = () => {
  const userCategories = useSelector((state) => state.userData.categories);
  const userData = useSelector((state) => state.userData.metrics);
  const sidebarState = useSelector((state) => state.display.displaySidebar);
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("");

  const categoryItems = userCategories.map((category, i) => {
    return (
      <Item
        key={`${i}`}
        title={`${category.categoryId}`}
        to={`/category/${i}`}
        icon={<ClassIcon />}
        selected={selected}
        setSelected={setSelected}
      />
    );
  });

  const dataItems = userData.map((data, i) => (
    <Item
      key={`${i}`}
      title={`${data.id}`}
      to={`/chart/${i}`}
      icon={<TimelineOutlinedIcon />}
      selected={selected}
      setSelected={setSelected}
    />
  ));

  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 10000,
      }}
    >
      <Sidebar
        onBackdropClick={() => dispatch(toggleSidebar())}
        toggled={sidebarState}
        breakPoint="all"
        backgroundColor={colors.primary[400]}
      >
        <Menu
          iconShape="square"
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0) {
                return {
                  color: disabled ? "#eee" : "#455A64",
                  backgroundColor: active ? "#335B8C" : undefined,
                  "&:hover": {
                    backgroundColor: "#335B8C !important",
                    color: "white !important",
                    fontWeight: "bold !important",
                  },
                };
              }
            },
          }}
        >
          {/* *LOGO AND MENU ICON */}
          <Box
            display="flex"
            justifyContent="center"
            justifyItems="center"
            alignItems="center"
          >
            <Typography variant="h3" m="20px">
              NAVIGATION
            </Typography>
            <MenuItem
              onClick={() => dispatch(toggleSidebar())}
              icon={<MenuOutlinedIcon />}
              style={{
                color: colors.grey[100],
              }}
            ></MenuItem>
          </Box>
          {/* MENU ITEMS */}
          <Box >
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Journal
            </Typography>
            <Item
              title="Journal"
              to="/journal"
              icon={<MenuBookIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Categories
            </Typography>
            {categoryItems}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Metrics
            </Typography>
            {dataItems}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default CustomSidebar;
