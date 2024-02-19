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
  /** < -------------------- For Customer ----------------------------------- > */

  // staff
  staffCreated: 'Staff Account is Created',
  staffUpdated: 'Staff information has been updated',
  staffDeleted: 'Staff Account is deleted',

  // department
  departmentCreated: 'Department is Created',
  departmentUpdated: 'Department information has been updated',
  departmentDeleted: 'Department is deleted',

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

  /** --------------------------- For Admin -------------------------- */

  //Status
  statusOn: 'Staff status is on!',
  statusOff: 'Staff status is off!',

  unauthorized: ['Unauthorized', 'ဤလုပ်ဆောင်ချက်အား လုပ်ဆောင်ခွင့်မရှိပါ။'],
  contactToAdmin: ['Contact to admin!', 'စီမံခန့်ခွဲသူကို ဆက်သွယ်ပါ'],
  somethingWentWrong: ['Something went wrong', 'အချက်အလက် တချို့ မှားယွင်းနေသည်။'],
  alreadyExists: ['Already exists', 'ဤလုပ်ဆောင်ချက်သည် ရှိနေပြီးသားဖြစ်သည်။'],
  badRequest: ['Bad Request', 'ပို့ဆောင်ချက် မှားယွင်းနေပါသည်။'],
  forbiddenAction: ['Forbidden action', 'ဤအရာသည် တားမြစ်ထားပါသည်။'],

  invalidValue: ['Invalid values', 'မမှန်ကန်သော အချက်အလက်များဖြစ်နေပါသည်။'],
  updated: ['Updated', 'အချက်အလက်များ ပြင်ဆင်ပြီးပါပြီ'],
  created: ['Created', 'အောင်မြင်စွာ စာရင်းသွင်းနိုင်ခဲ့သည်'],
  notified: ['Notified', 'အောင်မြင်စွာ စာရင်းသွင်းနိုင်ခဲ့သည်'],
  fileNotFound: [`File not found`, 'ဖိုင်ရှာမတွေ့ပါ'],
  codeDoesNotMatch: [`Code doesn't match`, 'ကုဒ် မတူပါ'],
  listSuccessful: [`List`, `စာရင်း`],
  cannotDelete: [`This data can not be deleted`, `ဤ ဒေတာကို ဖျက်၍မရပါ`],
  cannotRejected: [`can not reject`, ``],
  deleted: [`Deleted`, `ဖျက်သိမ်းခဲ့သည်`],
  cannotLogin: [`You can not login at the moment`, `လက်တလော အကောင့်ဝင်၍မရပါ`],
  cannotSendOtp: [`Your cannot send otp at the moment`, `လက်တလော OTP ကုဒ် ပို့လို့မရပါ`],
  optSent: [`OTP was sent`, `OTP ကုဒ် ပို့ထားခဲ့သည်`],
  optAlreadyUsed: [`OTP was already used`, `အသုံးပြု့ပြီးသော OTP ကုဒ်ဖြစ်သည်`],
  optExpired: [`OTP is expired`, ` OTP  ကုဒ် သက်တမ်းကုန်သွားပါပြီ`],
  invalidOtp: [`Wrong OTP`, `OTP မှားယွင်းနေပါသည်`],
  passwordReset: [
    `Password has been reset successfully`,
    `စကားဝှက်ကို အောင်မြင်စွာ ပြင်ဆင်သတ်မှတ်ပြီးပါပြီ`
  ],
  notFound: ['Not Found', 'ရှာမတွေ့ပါ ', ''],
  incorrectPassword: [`Password is incorrect`, `လျှို့ဝှက်ကုဒ် မှားယွင်းနေပါသည်`],
  incorrectPhoneNumber: [`Phone number is incorrect`, `ဖုန်းနံပါတ် မှားယွင်းနေပါသည်`],
  incorrectEmail: [`Phone number is incorrect`, `အီးလ်မေး မှားယွင်းနေပါသည်`],
  incorrectUsername: [`Username is incorrect`, `အမည် မှားယွင်းနေပါသည်`],
  match: [`Match`, `ပါဝင်သည်`],
  doesnotmatch: [`Doesn't match`, `အချက်အလက်များ မကိုက်ညီပါ`]

  /** --------------------------- -------------------------- */
};

export default AppMessage;
