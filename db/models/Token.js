/**
 * Token model - To store token data
 */
 const { mongoose } = require('../mongoose');

 const { Schema } = mongoose;
 
 const tokenSchema = new Schema(
   {
     token: { type: String, trim: true },
     referenceId: String,
     expiry: Date,
     isValid: {type: Boolean, default: true},
   },
   {
     timestamps: true,
   }
 );
 
 const Token = mongoose.model('Token', tokenSchema);
 
 exports.Token = Token;
 