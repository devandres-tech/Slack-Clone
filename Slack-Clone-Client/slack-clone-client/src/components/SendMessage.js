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
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`Message #${channelName}`}
      />
    </div>
);

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (values, { props: { onClose, teamId, createMessage }, setSubmitting }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    const response = await createMessage({ variables: { teamId, name: values.name } });
    console.log(response);
    onClose();
    setSubmitting(false);
  },
})(SendMessage);
