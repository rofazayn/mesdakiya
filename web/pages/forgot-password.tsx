import { Container, Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { ReactElement, useState } from 'react';
import InputField from '../src/components/InputField';
import { createURQLCLient } from '../src/utils/createURQLClient';

interface ForgotPasswordPageProps {}

function ForgotPasswordPage({}: ForgotPasswordPageProps): ReactElement {
  const [globalError, setGlobalError] = useState();
  return (
    <Container maxWidth='sm'>
      <Formik
        initialValues={{ email: '' }}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {}}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='email'
              type='email'
              label='Email'
              placeholder='Email linked to your account'
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
              Send link
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default withUrqlClient(createURQLCLient, { ssr: false })(
  ForgotPasswordPage
);
