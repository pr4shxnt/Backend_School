const mongoose =  require('mongoose');

const newContactMailSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
},{
    timestamps: true
})

const NewContactMail = mongoose.model('NewContactMail', newContactMailSchema);
module.exports = NewContactMail;