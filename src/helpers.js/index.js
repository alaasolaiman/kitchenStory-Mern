
const validateEmail = (email) => {
    const check = email.match(
      // eslint-disable-next-line
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return check
}
export const areValid = (formInputs, setFormInputs) => {


  let allValid = true;

  for (const key in formInputs) {
    setFormInputs((previousState) => ({
      ...previousState,
      [key]: {
        ...previousState[key],
        validationError: false,
        errorMessage: "",
      },
    }));

    if (!formInputs[key]["value"] && formInputs[key]["isRequired"]) {
      setFormInputs((previousState) => ({
        ...previousState,
        [key]: {
          ...previousState[key],
          validationError: true,
          errorMessage: `${formInputs[key]["label"]} is a required field`,
        },
      }));
      allValid = false;
    }

    if (
      key === "email" &&
      !validateEmail(formInputs[key]["value"]) &&
      formInputs[key]["value"]
    ) {
      setFormInputs((previousState) => ({
        ...previousState,
        email: {
          ...previousState["email"],
          validationError: true,
          errorMessage: "Invalid Email Format",
        },
      }));
      allValid = false;
    }

    if (
      formInputs[key]["minLength"] &&
      formInputs[key]["value"].length < formInputs[key]["minLength"] &&
      formInputs[key]["value"]
    ) {
      setFormInputs((previousState) => ({
        ...previousState,
        [key]: {
          ...previousState[key],
          validationError: true,
          errorMessage: `${formInputs[key]["label"]} must be greater than ${formInputs[key]["minLength"] - 1} characters`,
        },
      }));
      allValid = false;
    }

    if (
      formInputs[key]["maxLength"] &&
      formInputs[key]["value"].length > formInputs[key]["maxLength"] &&
      formInputs[key]["value"]
    ) {
      setFormInputs((previousState) => ({
        ...previousState,
        [key]: {
          ...previousState[key],
          validationError: true,
          errorMessage: `${formInputs[key]["label"]} must be less than ${formInputs[key]["maxLength"]} characters`,
        },
      }));

      allValid = false;
    }
  }
  return allValid;
};
