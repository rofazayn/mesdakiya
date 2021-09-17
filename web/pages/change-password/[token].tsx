import { Box, Button, Container } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import InputField from '../../src/components/InputField';
import { useChangePasswordMutation } from '../../src/generated/graphql';
import { createURQLCLient } from '../../src/utils/createURQLClient';
import changePasswordValidationSchema from '../../src/validation/changePassword';

interface ChangePasswordProps {}

function ChangePasswordPage({}: ChangePasswordProps): ReactElement {
  const [globalError, setGlobalError] = useState();
  const router = useRouter();
  const { token } = router.query;
  const [_, changePassword] = useChangePasswordMutation();
  return (
    <Container maxWidth='sm'>
      <Formik
        initialValues={{ newPassword: '' }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={changePasswordValidationSchema}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token: token as string,
          });

          if (response.data?.changePassword.errors) {
            const serverErrors = response.data.changePassword.errors;
            if (serverErrors[0].field === 'global') {
              setGlobalError(serverErrors[0].message as any);
            }
          } else {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              type='password'
              label='New password'
              placeholder='New password'
            />
            {!globalError ? null : (
              <Box
                py={3}
                px={4}
                mb={3}
                bgColor='red.50'
                color='red.500'
                borderRadius='lg'
              >
                {globalError}
              </Box>
            )}
            <Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default withUrqlClient(createURQLCLient, { ssr: false })(
  ChangePasswordPage
);
