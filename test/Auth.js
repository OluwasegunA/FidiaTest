/* eslint-disable no-undef */
const chai, { expect } = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const {app} = require('../app');
const {User} = require('../db/models/User');
const {codes} = require('../helpers/statusCodes');

chai.use(chaiHttp);

const aUser = {
  firstname: 'Segun',
  lastname: 'Samuel',
  email: 'oluwasegunayobami7@gmail.com.com',
  password: 'iamsamuel',
  isValidatedUser: true
};

let token = '';

describe('Login a user: POST /login', () => {
  before(async () => {
    const password = bcrypt.hashSync(aUser.password, 10);
    await User.create({ ...aUser, password });
  });

  after(async () => {
    await User.deleteMany({ email: aUser.email });
  });

  it('should successfully login a user', async () => {
    const response = await chai.request(app)
      .post('/api/v1/users/login').send({
        email: aUser.email,
        password: aUser.password,
      });

    // eslint-disable-next-line prefer-destructuring
    token = response.body.data.token;

    expect(response.status).to.eqls(codes.success);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.success);
    expect(response.body.data.token).to.be.a('string');
    expect(response.body.data.user).to.be.an('object');
    expect(response.body.data.user.firstname).to.eqls(aUser.firstname);
    expect(response.body.data.user.lastname).to.eqls(aUser.lastname);
    expect(response.body.data.user._id).to.be.a('string');
  });

  it('should fail to login a user with incorrect details', async () => {
    const response = await chai.request(app)
      .post('/api/v1/users/login').send({
        email: 'random@email.com',
        password: 'Userpassword',
      });

    expect(response.status).to.eqls(codes.unAuthorized);
    expect(response.body.status).to.eqls(codes.unAuthorized);
    expect(response.body.error).eqls('Invalid email address or password.');
  });
});

describe('Sign up a user: POST /signup', () => {
  after(async () => {
    await User.deleteOne({ email: aUser.email });
  });

  it('should successfully signup a new user', async () => {
    const response = await chai.request(app).post('/api/v1/users/signup').send(aUser).set('authorization', token);

    expect(response.status).to.eqls(codes.created);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.eqls(codes.created);
    expect(response.body.data.message).to.eqls('The user account has been created successfully and user notified.');
  }).timeout(5000);

  it('should fail to create a user without a name', async () => {
    const aUser2 = { ...aUser, email: 'ken@ken.com' };
    delete aUser2.firstname;
    const response = await chai.request(app).post('/api/v1/users/signup').send(aUser2).set('authorization', token);

    expect(response.status).to.eqls(codes.badRequest);
    expect(response.body.status).to.eqls(codes.badRequest);
    expect(response.body.error).eqls('Validation errors.');
    expect(response.body.fields.firstname).eqls('Firstname is required.');
  });
});

