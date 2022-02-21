const registerRules = [
  {
    field: 'firstname',
    rules: 'required',
  },
  {
    field: 'lastname',
    rules: 'required',
  },
  {
    field: 'email',
    rules: 'required|email|unique',
    unique: 'User',
    messages: {
      required: 'Email address is required.',
      // email: 'A valid email address is required.',
      unique: 'Email address already exists.',
    },
  },
];

const loginRules = [
  {
    field: 'email',
    rules: 'required',
    messages: {
      required: 'Email address is required.',
    },
  },
  {
    field: 'password',
    rules: 'required',
  },
];


exports.registerRules=registerRules;
exports.loginRules=loginRules;