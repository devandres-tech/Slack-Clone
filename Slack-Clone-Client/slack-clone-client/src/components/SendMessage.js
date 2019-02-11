import React from 'react';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';

const ENTER_KEY = 13;
const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <div className="sendMessage">
      <Input
        onKeyDown={(e) => {
          if (e.keyCode === ENTER_KEY && !isSubmitting) {
            handleSubmit(e);
          }
        }}
        value={values.message}
        fluid
        name="message"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`Message #${channelName}`}
      />
    </div>
);

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (values, { props: { channelId, createMessage }, setSubmitting, resetForm }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    await createMessage({ variables: { channelId, text: values.message } });
    resetForm(false);
  },
})(SendMessage);
