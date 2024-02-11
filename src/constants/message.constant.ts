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

const AppMessage = {
  /** < -------------------- For Customer ----------------------------------- > */

  //Banker
  adminBankerCreated: [
    'Successfuly Admin Account Registration to Banker',
    'စီမံခန့်ခွဲသူမှ သင့်၏အကောင့်အား အောင်မြင်စွာ စာရင်းသွင်းပြီးပါပြီ'
  ],
  adminBankerNotFound: ['Banker Account not Found', 'သင့်၏အကောင့်ကို မတွေ့ရှိပါ'],
  adminBankerUpdate: [
    'Admin information has been updated to Banker',
    'စီမံခန့်ခွဲသူမှ သင်၏အချက်အလက်များ အောင်မြင်စွာပြင်ဆင်ပြီးပါပြီ'
  ],
  AdminDeleteCustomer: [
    'Admin deleted to Customer Account ',
    'စီမံခန့်ခွဲသူမှ သင့်၏အကောင့်အား ဖျက်သိမ်းခဲ့ပါသည်။'
  ],
  adminBankerAlreadyExists: ['Banker Account already exists', 'ဤအကောင့်သည် ရှိနေပြီးသားဖြစ်ပါသည်။'],

  //OTP
  sendOTP: ['Send OTP your phone', 'သင်၏  ဖုန်းနံပါတ်ကို OTP ကုဒ် ပို့ထားပါသည်'],
  verifyOTP: ['Verify OTP is successful ', 'OTP စစ်ဆေးချက် အောင်မြင်ပါသည်'],
  notFoundOTP: ['OTP not Found', 'OTP ကုဒ် မတွေ့ရှိပါ'],
  forgetPassword: [
    'Forget password is successful',
    ' လျှို့ဝှက်ကုဒ် ပြန်လည်တောင်းဆိုမှု အောင်မြင်သည်'
  ],

  //Login
  invalidCredentials: ['Invalid username or password', ' အမည် (သို့) လျှို့ဝှက်ကုဒ် မှားနေပါသည်'],
  invalidCredentialsWithPhone: [
    'Invalid phone no or phone number',
    'သင်၏ အမည် (သို့) ဖုန်းနံပါတ် မှားနေပါသည်'
  ],
  validCredentials: ['Successfully login', 'အကောင့်ဝင်ရောက်မှု့ အောင်မြင်သည်'],

  /** --------------------------- For Admin -------------------------- */

  //admin
  userCreated: ['User Account Created', 'စီမံခန့်ခွဲသူအကောင့် အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ'],
  userUpdate: [
    'User information has been updated',
    'စီမံခန့်ခွဲသူအချက်အလက်များကို ပြင်ဆင်ပြီးပါပြီ'
  ],
  userDelete: ['Admin deleted', 'စီမံခန့်ခွဲသူအကောင့်ဖျက်သိမ်းခြင်းလုပ်ဆောင်ချက် ပြီးပါပြီ'],

  //Status
  statusOn: ['Status on', 'ဖွင့်ထားသည်'],
  statusOff: ['Status off', 'ပိတ်ထားသည်'],

  unauthorized: ['Unauthorized', 'ဤလုပ်ဆောင်ချက်အား လုပ်ဆောင်ခွင့်မရှိပါ။'],
  contactToAdmin: ['Contact to admin!', 'စီမံခန့်ခွဲသူကို ဆက်သွယ်ပါ'],
  somethingWentWrong: ['Something went wrong', 'အချက်အလက် တချို့ မှားယွင်းနေသည်။'],
  alreadyExists: ['Already exists', 'ဤလုပ်ဆောင်ချက်သည် ရှိနေပြီးသားဖြစ်သည်။'],
  badRequest: ['Bad Request', 'ပို့ဆောင်ချက် မှားယွင်းနေပါသည်။'],
  forbiddenAction: ['Forbidden action', 'ဤအရာသည် တားမြစ်ထားပါသည်။'],
  retrievedSuccessful: ['Retrieved successful', 'လုပ်ဆောင်ချက် အောင်မြင်သည်။'],
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
  doesnotmatch: [`Doesn't match`, `အချက်အလက်များ မကိုက်ညီပါ`],

  /** --------------------------- -------------------------- */

  customerNotFound: ['Customer Account not Found', 'သင့်၏ အကောင့်ကို မတွေ့ရှိပါ'],

  customerUpdate: [
    'Customer information has been updated',
    'သင်၏အချက်အလက်များ အောင်မြင်စွာပြင်ဆင်ပြီးပါပြီ'
  ],

  customerDelete: ['Customer Account deleted', 'သင့် အကောင့်အား ဖျက်သိမ်းခဲ့ပါသည်။'],
  customerAlreadyExists: ['Customer Account already exists', 'ဤအကောင့်သည် ရှိနေပြီးသားဖြစ်ပါသည်။']
};

export default AppMessage;
