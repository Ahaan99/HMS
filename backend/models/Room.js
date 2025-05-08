const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Triple'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  occupiedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

roomSchema.statics.createSampleRooms = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    const sampleRooms = [
      {
        roomNumber: '101',
        floor: 1,
        type: 'Double',
        capacity: 2,
        status: 'Available',
        price: 5000
      },
      {
        roomNumber: '102',
        floor: 1,
        type: 'Triple',
        capacity: 3,
        status: 'Available',
        price: 4500
      },
      {
        roomNumber: '201',
        floor: 2,
        type: 'Single',
        capacity: 1,
        status: 'Available',
        price: 6000
      }
    ];

    await this.insertMany(sampleRooms);
  }
};

module.exports = mongoose.model('Room', roomSchema);
