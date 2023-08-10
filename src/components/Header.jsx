import { Typography, Box, useTheme, TextField, Button } from "@mui/material";
import { tokens } from "../theme";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { saveFile, changeTitle } from "../store/userDataSlice";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const Header = ({ title, subtitle, isCategory, isDate }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);

    const initialValues = {
        title: ""
    };

    const userSchema = yup.object().shape({
        title: yup.string().required("required")
    });

    const openEdit = () => {
        setIsEdit(!isEdit)
    }

    const editTitle = (values) => {
        dispatch(changeTitle({ values: values.title, selectionId: title, isCategory }))
        openEdit()
        dispatch(saveFile());
    }

    return (
        <Box m="5px" width="auto" display="flex" gap="10px" justifyContent="center">
            <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                sx={{ color: colors.grey[100] }}
            >
                {isEdit ? <Formik
                    onSubmit={editTitle}
                    initialValues={initialValues}
                    validationSchema={userSchema}
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="flex"
                                gap="5px"
                                sx={{
                                    "& > div": { gridRow: isNonMobile ? undefined : "span 2" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="New Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    name="title"
                                    error={!!touched.title && !!errors.title}
                                    helperText={touched.title && errors.title}
                                    sx={{ gridRow: "span 1" }}
                                />
                                <Button type="submit" color="secondary" variant="contained">
                                    CONFIRM
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
                    :
                    <Box>
                        <Typography
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ mb: "5px" }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[400]}>
                            {subtitle}
                        </Typography>
                    </Box>}
            </Typography>
            {isDate ? <Box></Box> : <EditOutlinedIcon onClick={openEdit} />}
        </Box>
    )
}

export default Header;

{/* <Typography
variant="h2"
color={colors.grey[100]}
fontWeight="bold"
sx={{ mb: "5px"}}
>
    {title}
</Typography>
<Typography variant="h5" color={colors.greenAccent[400]}>
    {subtitle}
</Typography> */}