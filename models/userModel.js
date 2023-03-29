const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: [true, "Account already exist with this email"],
        },
        username: {
            type: String,
            required: [true, "Username is required."],
            unique: [true, "An account with this username already exists."],
            minlength: [3, "Username must be 4-15 characters."],
            maxlength: [15, "Username must be 4-15 characters."],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password cannot be Blank"],
        },
        balance: {
            type: Number,
            required: true,
            default: 1000000,
        },
        tokens: [],
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
})


userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject._id ;
    delete userObject.createdAt ;
    delete userObject.__v ;
    delete userObject.updatedAt
    return userObject;
}

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if(!user) throw new Error('Invalid Email or Password');
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid Email or Password');

    return user
}

userSchema.methods.generateAuthToken = async function(){
    const User = this ;
    const token = jwt.sign({ _id: User._id.toString()}, 'appSecret') ;
    User.tokens = User.tokens.concat({token}) ;
    await User.save();
    return token ;
}

const User = mongoose.model('User', userSchema);

module.exports = User ;

