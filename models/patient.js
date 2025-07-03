const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        patientNumber: {
            type: String,
            unique: true,
        },
        patientName: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        comments: {
            type: String,
            trim: true,
        },
        recievedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        assignedTo: {
            type: String,
            trim: true,
        },
        patientCalled: {
            type: Boolean,
            default: false
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate patient number before saving
patientSchema.pre('save', async function (next) {
    if (this.patientNumber) return next(); // Skip if patientNumber already exists

    const lastPatient = await mongoose.model('Patient').findOne().sort({ createdAt: -1 });

    let newPatientNumber = 'A0001'; // Default start

    if (lastPatient && lastPatient.patientNumber) {
        const lastNumber = lastPatient.patientNumber;
        const letter = lastNumber[0]; // Extract letter (e.g., 'A')
        let num = parseInt(lastNumber.slice(1), 10); // Extract number (e.g., '0001')

        if (num < 9999) {
            num += 1; // Increment number
        } else if (letter < 'Z') {
            num = 1; // Reset number
            newPatientNumber = String.fromCharCode(letter.charCodeAt(0) + 1) + '0001'; // Next letter
        } else {
            throw new Error('Patient number limit reached!'); // Prevent overflow beyond Z9999
        }

        if (!newPatientNumber.startsWith('Z')) {
            newPatientNumber = `${letter}${num.toString().padStart(4, '0')}`;
        }
    }

    this.patientNumber = newPatientNumber;
    next();
});

module.exports = mongoose.model('Patient', patientSchema);