import { Box, Button, Container } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { ReactElement, useState } from 'react';
import InputField from '../../src/components/InputField';
import { createURQLCLient } from '../../src/utils/createURQLClient';

interface ChangePasswordProps {}

function ChangePasswordPage({}: ChangePasswordProps): ReactElement {
  const [globalError, setGlobalError] = useState();
  return (
    <Container maxWidth='sm'>
      <Formik
        initialValues={{ newPassword: '' }}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setErrors }) => {}}
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
              Send link
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
