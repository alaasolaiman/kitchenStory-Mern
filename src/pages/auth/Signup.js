import { useCallback, useState } from "react";
import axios from "axios";

import TextInput from "../../components/inputs/TextInput";
import DateInput from "../../components/inputs/DateInput";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ShortTextIcon from "@mui/icons-material/ShortText";
import Container from "@mui/system/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import { areValid } from "../../helpers.js/index.js";

const SignUp = () => {
  const navigate = useNavigate();

  const formInputsInitialState = {
    firstName: {
      type: "text",
      name: "firstName",
      label: "First Name",
      isRequired: true,
      value: "",
      Icon: ShortTextIcon,
    },
    lastName: {
      type: "text",
      name: "lastName",
      label: "Last Name",
      isRequired: true,
      value: "",
      Icon: ShortTextIcon,
    },
    username: {
      type: "text",
      name: "username",
      label: "Username",
      isRequired: true,
      value: "",
      Icon: PersonIcon,
    },
    email: {
      type: "email",
      name: "email",
      label: "Email",
      isRequired: true,
      value: "",
      Icon: EmailIcon,
    },
    password: {
      type: "password",
      name: "password",
      label: "Password",
      isRequired: true,
      value: "",
      Icon: LockIcon,
      minLength: "8",
      maxLength: "32",
    },
    phoneNumber: {
      type: "password",
      name: "password",
      value: "",
      Icon: <LockIcon />,
    },
    bio: {
      type: "password",
      name: "password",
      value: "",
      Icon: <LockIcon />,
    },
    gender: {
      type: "password",
      name: "password",
      value: "",
      Icon: <LockIcon />,
    },
    dateOfBirth: {
      type: "password",
      name: "password",
      value: "",
      Icon: <LockIcon />,
    },
  };

  const [formInputs, setFormInputs] = useState(formInputsInitialState);

  const onFormInputsChangeHandler = useCallback((event) => {
    const { name, value } = event.target;
    setFormInputs((previousState) => ({
      ...previousState,
      [name]: {
        ...previousState[name],
        value: value,
      },
    }));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (areValid(formInputs, setFormInputs)) {
      const instance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
      });

      instance.interceptors.request.use(
        (config) => {
          console.log(config);
          return config;
        },
        (error) => {
          console.log(error);
          return Promise.reject(error);
        }
      );

      instance.interceptors.response.use(
        (config) => {
          console.log(config);
          return config;
        },
        (error) => {
          if (
            (error?.response?.status === 409 ||
            error?.response?.status === 400) &&
              error?.response?.data?.message === "validation error" &&
              error?.response?.data?.hint
          ) {
            for (const key in error?.response?.data?.hint) {
              setFormInputs((previousState) => ({
                ...previousState,
                [key]: {
                  ...previousState[key],
                  validationError: true,
                  errorMessage: error.response.data.hint[key],
                },
              }));
            }
          }
          return Promise.reject(error);
        }
      );
      instance
        .post(
          "/auth/signup",
          {
            firstName: formInputs.firstName.value,
            lastName: formInputs.lastName.value,
            username: formInputs.username.value,
            email: formInputs.email.value,
            password: formInputs.password.value,
          },
          { withCredentials: true }
        )
        .then((res) => {
          axios.interceptors.request.use((request) => {
            console.log("Starting Request", JSON.stringify(request, null, 2));
            return request;
          });
          console.log(res);
          if (res.status === 201) {
            axios({
              url: "http://localhost:5000/auth/login",
              method: "post",
              data: {
                username: formInputs.username.value,
                password: formInputs.password.value,
              },
              withCredentials: true,
            })
              .then((res) => {
                if (res.status === 200) {
                  alert("account created");
                  navigate("/dashboard");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Container>
      <form>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: "20px",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "primary.main",
          }}
        >
          Sign Up
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextInput
              formInput={formInputs.firstName}
              onChange={onFormInputsChangeHandler}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextInput
              formInput={formInputs.lastName}
              onChange={onFormInputsChangeHandler}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              formInput={formInputs.username}
              onChange={onFormInputsChangeHandler}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              formInput={formInputs.email}
              onChange={onFormInputsChangeHandler}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              formInput={formInputs.password}
              onChange={onFormInputsChangeHandler}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6}>
            <DateInput formInput={formInputs.dateOfBirth} />
          </Grid>
          <Grid item xs={12} sx={{ mx: "auto" }}>
            <Button
              type="submit"
              sx={{ mx: "auto", display: "block" }}
              variant="contained"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SignUp;
