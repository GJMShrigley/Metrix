import { useState } from "react";

import { Formik } from "formik";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { changeTitle, saveFile } from "../store/userDataSlice";
import { tokens } from "../theme";

const initialValues = {
  title: "",
};

const userSchema = yup.object().shape({
  title: yup.string().required("required"),
});

const Header = ({ title, isCategory, permanent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);

  const openEdit = () => {
    setIsEdit(!isEdit);
  };

  const editTitle = (values) => {
    dispatch(
      changeTitle({ isCategory, selectionId: title, values: values.title })
    );
    openEdit();
    dispatch(saveFile());
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: colors.primary[400],
        display: "flex",
        gap: ".5rem",
        justifyContent: "center",
        textAlign: "center",
        width: isLandscape ? "auto" : "100%",
      }}
    >
      {isEdit ? (
        <Formik
          initialValues={initialValues}
          onSubmit={editTitle}
          validationSchema={userSchema}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  gap: ".2rem",
                }}
              >
                <TextField
                  error={!!touched.title && !!errors.title}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="New Title"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.title}
                  variant="filled"
                />
                <Button color="secondary" type="submit" variant="contained">
                  CONFIRM
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      ) : (
        <Box>
          <Typography
            sx={{
              color: colors.grey[100],
              fontWeight: "bold",
            }}
            variant="h2"
          >
            {title}
          </Typography>
        </Box>
      )}
      {title === "Dashboard" || permanent ? null : (
        <EditOutlinedIcon onClick={openEdit} />
      )}
    </Box>
  );
};

export default Header;
