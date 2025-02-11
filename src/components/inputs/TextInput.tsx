import React, { useState } from 'react';
import { FormControl, FormHelperText, Grid, TextField } from '@mui/material';

interface TextInputPropsType {
  label: string | React.ReactElement;
  error: string;
  value: string;
  setValue: (value: string) => unknown;
  type?: string;
  size?: 'small' | 'medium';
}

const TextInput = (props: TextInputPropsType) => {
  const [blurred, setBlurred] = useState(false);

  return (
    <Grid item xs={12}>
      <FormControl fullWidth variant="outlined">
        <TextField
          variant="outlined"
          size={props.size ? props.size : 'medium'}
          label={props.label}
          error={props.error !== '' && blurred}
          onBlur={() => setBlurred(true)}
          type={props.type ? props.type : 'text'}
          value={props.value}
          onChange={(event) => props.setValue(event.target.value)}
          autoComplete="off"
        />
      </FormControl>
      {blurred ? (
        <FormHelperText error id="accountId-error">
          {props.error}
        </FormHelperText>
      ) : null}
    </Grid>
  );
};

export default TextInput;
