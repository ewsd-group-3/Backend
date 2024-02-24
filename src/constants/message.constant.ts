export const AppMessageNotFound = (url: string) => {
  return [`Not Found - ${url}`, `ရှာမတွေ့ပါ - ${url}`, ``];
};

export const AppMessageModelNotFound = (model: string) => {
  return [`${model} not found`, `${model} မတွေ့ရှိပါ`, ``];
};

export const CannotBeUpdated = (field: string) => {
  return [`${field} cannot be updated`, `${field} ကို ပြင်ဆင်၍မရပါ`, ``];
};

export const AlreadyExists = (field: string, data: string) => {
  return [`${field} '${data}' Already exists`, `ဤ ${field} '${data} သည် ရှိနေပြီးသားဖြစ်သည်။`];
};

export const fileNotFound = (() => {
  return [`File not found`, 'ဖိုင်မတွေ့ပါ', ''];
})();

export const defaultPassword = '123456';

const AppMessage = {
  // staff
  staffCreated: 'Staff Account is Created',
  staffUpdated: 'Staff information has been updated',
  staffDeleted: 'Staff Account is deleted',

  // department
  departmentCreated: 'Department is Created',
  departmentUpdated: 'Department information has been updated',
  departmentDeleted: 'Department is deleted',

  // category
  categoryCreated: 'Category is Created',
  categoryUpdated: 'Category information has been updated',
  categoryDeleted: 'Category is deleted',

  // category
  ideaCreated: 'Idea is Created',
  ideaUpdated: 'Idea information has been updated',
  ideaDeleted: 'Idea is deleted',

  // OTP
  sendOTP: 'Send OTP your phone',
  verifyOTP: 'Verify OTP is successful',
  notFoundOTP: 'OTP is not Found',
  forgetPassword: 'Forget password is successful',

  // Login
  invalidCredentials: 'Invalid username or password',
  invalidCredentialsWithPhone: 'Invalid phone no or phone number',
  loggedIn: 'Successfully Logged In!',
  loggedOut: 'Successfully Logged Out!',

  // Get
  retrievedSuccessful: 'Retrieved successful',

  // Status
  statusOn: 'Staff status is on!',
  statusOff: 'Staff status is off!'
};

export default AppMessage;
