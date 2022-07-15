import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

const TextInput = ({ formInput, onChange, ...rest }) => {
  const { type, name, value, Icon, validationError,isRequired, errorMessage , label} =
    formInput;
  return (
    <Box noValidate autoComplete="off">
      <FormControl fullWidth>
        <TextField
          required={isRequired}
          id={name}
          name={name}
          label={label}
          type={type}
          value={value}
          onChange={onChange}
          {...rest}
          error={validationError}
          // form="novalidatedform"
          fullWidth
          variant="outlined"
          fontSize="50px"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {<Icon color="primary" />}
              </InputAdornment>
            ),
          }}
        />

        <FormHelperText sx={{ color: "error.main" }}>{errorMessage}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default TextInput;
