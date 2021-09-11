import * as yup from 'yup';

const registerValidationSchema = yup.object().shape({
  username: yup.string().required().min(4).max(20),
  password: yup.string().required().min(6).max(40),
});

export default registerValidationSchema;
