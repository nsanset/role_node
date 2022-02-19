const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const singleFileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    }
}, {timestamps: true});

singleFileSchema.pre('remove', function (next) {
    var project = this;
    project.model('User').updateOne(
        { files: project._id }, 
        { $pull: { files: project._id } }, 
        { multi: true }, 
        next);
});

module.exports = mongoose.model('SingleFile', singleFileSchema);