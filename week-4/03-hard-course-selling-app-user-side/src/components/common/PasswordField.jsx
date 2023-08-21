import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

function PasswordField({
  password,
  setPassword,
  label = 'Password',
  error = false,
  helperText = '',
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl variant='outlined'>
      <InputLabel htmlFor={'outlined-adornment-password' + label}>
        {label}
      </InputLabel>
      <OutlinedInput
        disabled={disabled}
        required
        id={'outlined-adornment-password' + label}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        error={error ? true : false}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onMouseDown={() => {
                setShowPassword(true);
              }}
              onMouseUp={() => {
                setShowPassword(false);
              }}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />

      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default PasswordField;
