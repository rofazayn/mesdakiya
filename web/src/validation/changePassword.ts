import * as yup from 'yup';

const changePasswordValidationSchema = yup.object().shape({
  newPassword: yup.string().required().min(6).max(40).label('new password'),
});

export default changePasswordValidationSchema;
