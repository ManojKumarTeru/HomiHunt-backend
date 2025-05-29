const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
    },
    lastName: {
      type: String,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({id:user._id},process.env.JWT_SECRET);
    return token;
}

userSchema.methods.validatePassword=async function(passwordGivenByUser){
    const user=this;
    const passwordHash=user.password;

    const isPasswordValid=await bcrypt.compare(passwordGivenByUser,passwordHash);
    return isPasswordValid;
}


export default mongoose.model("User", userSchema);
