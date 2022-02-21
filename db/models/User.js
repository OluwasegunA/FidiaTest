/**
 * User model - To store user data
 */
 const { mongoose } = require('../mongoose');

 const { Schema } = mongoose;
 
 const userSchema = new Schema(
   {
     firstname: { type: String, trim: true },
     lastname: { type: String, trim: true },
     email: { type: String, trim: true },
     password: String,
     isValidatedUser: {type: Boolean, default: false},
   },
   {
     timestamps: true,
   }
 );
 
 const User = mongoose.model('User', userSchema);
 
 exports.User = User;
 