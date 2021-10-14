import * as yup from 'yup';

const forgotPasswordValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export default forgotPasswordValidationSchema;
