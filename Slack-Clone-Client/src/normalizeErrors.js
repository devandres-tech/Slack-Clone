/**
 * Creates a list of Error Messages in an Object
 * [{path: 'email', message: 'some message..'}] -->
 * {
 *   email: ['error1', 'error2'...]
 * }
 */
export default errors => errors.reduce((accumulator, currentValue) => {
  if (currentValue.path in accumulator) {
    accumulator[currentValue.path].push(currentValue.message);
  } else {
    accumulator[currentValue.path] = [currentValue.message];
  }
  return accumulator;
}, {});
