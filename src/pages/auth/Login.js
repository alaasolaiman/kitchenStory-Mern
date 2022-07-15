import { useCallback, useState, useContext} from "react";
import axios from "axios";

import TextInput from "../../components/inputs/TextInput";
import { areValid } from "../../helpers.js";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Container from "@mui/system/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { AuthContext } from "../../contexts/AuthProvider";

const Login = () => {
  const { callRefresh } = useContext(AuthContext);


  const formInputsInitialState = {
    username: {
      type: "text",
      name: "username",
      label: "Username or Email",
      isRequired: true,
      value: "",
      Icon: PersonIcon,
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
          console.log(config.data.data.token.expiry);
          if (config.status === 200) {
            localStorage.setItem("timeToCallToken", JSON.stringify(1000));
           axios.get(`${process.env.REACT_APP_BASE_URL}/token/refresh`, {withCredentials:true});
          }
          return config;
        },
        (error) => {
          console.log(error.response.status);
          if (
            error.response.status === 409 &&
            error.response.data.message === "invalid username or password"
          ) {
            setFormInputs((previousState) => ({
              ...previousState,
              username: {
                ...previousState["username"],
                validationError: true,
              },
            }));

            setFormInputs((previousState) => ({
              ...previousState,
              password: {
                ...previousState["password"],
                validationError: true,
                errorMessage: error.response.data.message,
              },
            }));
          }

          if (
            error.response.status === 404 &&
            error.response.data.message === "user not found"
          ) {
            setFormInputs((previousState) => ({
              ...previousState,
              username: {
                ...previousState["username"],
                validationError: true,
                errorMessage: error.response.data.message,
              },
            }));
          }
          return Promise.reject(error);
        }
      );
      instance.post(
        "/auth/login",
        {
          username: formInputs.username.value,
          password: formInputs.password.value,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    }
  };

  return (
    <Container>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              align="center"
              sx={{
                display: "block",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "primary.main",
              }}
            >
              Login
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              formInput={formInputs.username}
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
          <Grid item xs={12}>
            <Link
              sx={{
                ml: "10px",
                mb: "20px",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "primary.main",
                fontSize: "15px",
              }}
              href="/signup"
              underline="hover"
            >
              signup?
            </Link>
          </Grid>
          <Grid item xs={12} sx={{ mx: "auto" }}>
            <Button
              type="submit"
              sx={{ mx: "auto", display: "block" }}
              variant="contained"
              onClick={handleSubmit}
            >
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
