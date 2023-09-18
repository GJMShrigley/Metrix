import { Box, MenuItem, SvgIcon, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";

import ClassIcon from "@mui/icons-material/Class";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import { toggleSidebar } from "../../store/displaySlice";
import { tokens } from "../../theme";

const Item = ({ title, to, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      component={Link}
      to={to}
      sx={{
        color: colors.grey[100],
        display: "flex",
        width: "100%",
        gap: "1rem",
        marginLeft: "1.5rem",
      }}
    >
      <SvgIcon component={icon} />
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const CustomSidebar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userCategories = useSelector((state) => state.userData.categories);
  const userData = useSelector((state) => state.userData.metrics);
  const sidebarState = useSelector((state) => state.display.displaySidebar);

  const categoryItems = userCategories.map((category, i) => {
    return (
      <Item
        icon={ClassIcon}
        key={`${i}`}
        title={`${category.categoryId}`}
        to={`/category/${i}`}
      />
    );
  });

  const dataItems = userData.map((data, i) => (
    <Item
      icon={TimelineOutlinedIcon}
      key={`${i}`}
      title={`${data.id}`}
      to={`/chart/${i}`}
    />
  ));

  return (
    <Box
      sx={{
        bottom: 0,
        display: "flex",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Sidebar
        backgroundColor={colors.primary[400]}
        breakPoint="all"
        onBackdropClick={() => dispatch(toggleSidebar())}
        toggled={sidebarState}
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
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <MenuItem
              onClick={() => dispatch(toggleSidebar())}
              sx={{
                color: colors.grey[100],
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ margin: "1rem" }} variant="h3">
                NAVIGATION
              </Typography>
              <SvgIcon component={MenuOutlinedIcon} sx={{ margin: "2rem" }} />
            </MenuItem>
          </Box>
          {/* MENU ITEMS */}
          <Box>
            <Item icon={HomeOutlinedIcon} title="Dashboard" to="/" />
            <Typography
              sx={{ color: colors.grey[300], margin: "1.5rem 0 1rem 2rem" }}
              variant="h6"
            >
              Journal
            </Typography>
            <Item icon={MenuBookIcon} title="Journal" to="/journal" />
            <Typography
              sx={{ color: colors.grey[300], margin: "1.5rem 0 1rem 2rem" }}
              variant="h6"
            >
              Categories
            </Typography>
            {categoryItems}
            <Typography
              sx={{ color: colors.grey[300], margin: "1.5rem 0 1rem 2rem" }}
              variant="h6"
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
