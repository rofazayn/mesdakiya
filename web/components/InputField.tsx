import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';
import React, { InputHTMLAttributes, ReactElement } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  inputSize?: 'sm' | 'md' | 'lg' | 'xs';
};

function InputField({
  label,
  inputSize,
  ...props
}: InputFieldProps): ReactElement {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error} id={field.name}>
      <FormLabel>{label}</FormLabel>
      <Input {...field} {...props} size={inputSize} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}

export default InputField;
