const express = require('express');
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz-lts');
const { MongoClient, ServerApiVersion, ObjectId, Admin, Collection } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { permission } = require('process');
const saltRounds = 10; // You can adjust the salt rounds based on your security preference
// const { ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://project-fcc5c.web.app', 'https://glittering-zuccutto-6a0910.netlify.app', 'https://aquamarine-sable-129b90.netlify.app'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(cors());




// JWT Verify MiddleWare 

const verifyWebToken = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).send({ message: 'Unauthorized Access' })
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized Access' })

      }
      console.log(decoded)
      req.user = decoded
      next()

    })

  }
  console.log(token)


}



// Database Connection



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xyibc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const store_id = process.env.STORE_ID;
const store_passwd = process.env.PAYMENT_PASSWORD;
const is_live = false //true for live, false for sandbox



async function run() {
  try {

    // Database and Collection names

    // DataBase Related Collection 

    const UserCollection = client.db('VarsityProject').collection('User')
    const ProductCollection = client.db('VarsityProject').collection('Product')
    const TourCollection = client.db('VarsityProject').collection('Tour')
    const HotelCollection = client.db('VarsityProject').collection('Hotel')
    const VehicleCollection = client.db('VarsityProject').collection('Vehicle')
    const BookingCollection = client.db('VarsityProject').collection('Booking')





    //jwt generate

    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: '365d'
      })
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true })
    })



    // clear token on logout

    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
        console.log('Logout successful')
      } catch (err) {
        res.status(500).send(err)
      }
    })



    // ...................................................................................................................................


    //   Registration User Information Save Here 

    app.post('/registration', async (req, res) => {
      const { fullName, email, phoneNumber, nationality, image, password, confirmPassword, role, aproval, createDate, createTime } = req.body;

      try {
        // Check if the user already exists by email
        const existingUser = await UserCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password if provided
        let hashedPassword = password;
        if (password) {
          hashedPassword = await bcrypt.hash(password, saltRounds); // Salt rounds can be adjusted
        }

        // Insert user data into the User collection
        const newUser = {
          fullName, email, phoneNumber, nationality, image, password, confirmPassword, role, aproval, createDate, createTime

        };

        const result = await UserCollection.insertOne(newUser);

        if (result.acknowledged) {
          // Send a success response
          res.status(200).json({ success: true, message: 'User created successfully' });
        } else {
          res.status(500).json({ success: false, message: 'Error creating user' });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });


    //get the Register user data
    app.get('/registration', async (req, res) => {
      const result = await UserCollection.find().toArray()
      res.send(result)
    });



    // Update user role
    app.patch('/registration/:id', async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;

      try {
        // Validate role
        const validRoles = ['user', 'admin', 'agency'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }

        // Update role
        const result = await UserCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({ success: true, message: 'Role updated successfully' });
        } else {
          res.status(404).json({ success: false, message: 'User not found or no changes made' });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });




    // Add the route to handle the "Become an Agency" request
    app.put('/become-agency', async (req, res) => {
      const { email } = req.body; // Assuming the email is passed in the request body

      try {
        // Update the user's agency status to "pending"
        const result = await UserCollection.updateOne(
          { email: email }, // Find user by email
          { $set: { agency: "pending" } } // Add or update the "agency" field
        );

        if (result.modifiedCount === 0) {
          return res.status(400).json({ success: false, message: "User not found or already has agency status." });
        }

        res.status(200).json({ success: true, message: "Agency request successful!" });
      } catch (error) {
        console.error("Error updating user agency status:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });



    // Backend PUT request handler
    app.put('/registration/:id', async (req, res) => {
      const { id } = req.params;
      const { agency } = req.body; // Expecting agency field in the body

      if (!agency) {
        return res.status(400).json({ success: false, message: 'Agency status is required' });
      }

      try {
        const result = await UserCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { agency } } // Update the agency field
        );

        if (result.modifiedCount > 0) {
          return res.status(200).json({ success: true, message: 'User updated successfully' });
        } else {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
      }
    });









    // Product Collection Here

    // Product Publish Here ... 

    app.post('/product', async (req, res) => {
      const { productName, description, image, price, defaultPrice, category, createDate,
        createTime } = req.body;

      // Basic validation
      if (!productName || !description || !image || !defaultPrice || !price || !category) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      try {
        // Insert product post into the database
        const newProduct = {
          productName, description, image, defaultPrice, price, category, createDate, permission: 'no',
          createTime
        };
        const result = await ProductCollection.insertOne(newProduct);

        if (result.acknowledged) {
          return res.status(200).json({ success: true, message: 'product created successfully' });
        } else {
          return res.status(500).json({ success: false, message: 'Error creating product' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    });



    // Get all products
    app.get('/product', async (req, res) => {
      try {
        const blogs = await ProductCollection.find().toArray();
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });



    // Production details 
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ProductCollection.findOne(query);
      res.send(result);
    });



    // Backend: Delete product (DELETE)
    app.delete('/product-delete/:id', async (req, res) => {
      try {
        const { id } = req.params; // Extract the product ID from URL parameters

        // Delete the product from the database
        const result = await ProductCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
          res.status(200).send({ message: 'product deleted successfully' });
        } else {
          res.status(404).send({ message: 'product not found' });
        }
      } catch (error) {
        res.status(500).send({ message: 'An error occurred while deleting the product.', error });
      }
    });



    // PUT: product update details

    // PUT: product update details

    // PUT: product update details
    app.put('/product-update/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;  // Get the updated product data from the request body

      try {
        // Validate the ID (MongoDB ObjectId)
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid product ID' });
        }


        const result = await ProductCollection.updateOne(
          { _id: new ObjectId(id) }, // Find the product by ID
          { $set: updatedData } // Update the product with new data
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'product not found' });
        }

        res.status(200).send({ message: 'product updated successfully' });

      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ message: 'An error occurred while updating the product.' });
      }
    });





    // Tour plan Collection Here

    // Tour Plan Publish Here ...

    app.post('/tour', async (req, res) => {
      const {
        touristSpotName,
        touristSpotDetails,
        totalTourPrice,
        price,
        startDate,
        endDate,
        images,
        createDate,
        createTime
      } = req.body;

      // ভ্যালিডেশন
      if (!touristSpotName ||
        !touristSpotDetails ||
        !totalTourPrice ||
        !price ||
        !startDate ||
        !endDate ||
        !images ||
        images.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'সব ফিল্ড পূরণ করা আবশ্যক'
        });
      }

      try {
        // ডেটাবেজে ট্যুর তৈরি করুন
        const newTour = {
          touristSpotName,
          touristSpotDetails,
          totalTourPrice: `${totalTourPrice}৳`,
          price: `${price}`,
          startDate,
          endDate,
          images, // ইমেজ URL এর অ্যারে
          permission: 'no',
          createDate,
          createTime
        };

        const result = await TourCollection.insertOne(newTour);

        if (result.acknowledged) {
          return res.status(200).json({
            success: true,
            message: 'ট্যুর প্লান সফলভাবে তৈরি হয়েছে'
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'ট্যুর তৈরি করতে সমস্যা হয়েছে'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });




    app.get('/tour', async (req, res) => {
      try {
        const blogs = await TourCollection.find().toArray();
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });



    // tour details 
    app.get('/tour/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await TourCollection.findOne(query);
      res.send(result);
    });


    app.put('/tour/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await TourCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { permission: "yes" } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({
            success: true,
            message: 'Tour approved successfully'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Tour not found'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });




    // UPDATE tour
    app.put('/update-tour/:id', async (req, res) => {
      const { id } = req.params;
      const {
        touristSpotName,
        touristSpotDetails,
        totalTourPrice,
        price,
        startDate,
        endDate,
        images,
        updatedAt
      } = req.body;

      try {
        const updatedTour = {
          touristSpotName,
          touristSpotDetails,
          totalTourPrice,
          price,
          startDate,
          endDate,
          images,
          updatedAt,
          permission: 'no'
        };

        const result = await TourCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedTour }
        );

        if (result.modifiedCount > 0) {
          return res.status(200).json({
            success: true,
            message: 'Tour updated successfully'
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'Tour not found or no changes made'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });



    // Backend: Delete tourCollection (DELETE)
    app.delete('/tour-delete/:id', async (req, res) => {
      try {
        const { id } = req.params; // Extract the tour ID from URL parameters

        // Delete the tour from the database
        const result = await TourCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
          res.status(200).send({ message: 'tour deleted successfully' });
        } else {
          res.status(404).send({ message: 'tour not found' });
        }
      } catch (error) {
        res.status(500).send({ message: 'An error occurred while deleting the tour.', error });
      }
    });









    // Hotel Management System
    // Hotel room Publish Here ...

    app.post('/hotels', async (req, res) => {
      const {
        hotelName,
        location,
        district,
        description,
        price,
        roomType,
        amenities,
        capacity,
        images,
        createDate,
        createTime
      } = req.body;

      // ভ্যালিডেশন
      if (!hotelName ||
        !location ||
        !district ||
        !description ||
        !price ||
        !roomType ||
        !capacity ||
        !images ||
        images.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'সমস্ত প্রয়োজনীয় ফিল্ড পূরণ করুন'
        });
      }

      try {
        // ডেটাবেজে নতুন হোটেল রুম তৈরি করুন
        const newHotelRoom = {
          hotelName,
          location,
          district,
          description,
          price: parseFloat(price),
          roomType,
          amenities: Array.isArray(amenities) ? amenities : [amenities],
          capacity: parseInt(capacity),
          images,
          createDate: createDate || new Date().toISOString().split('T')[0],
          createTime: createTime || new Date().toLocaleTimeString(),
          status: 'available',
          permission: 'no',
          rating: 0,
          bookings: []
        };

        const result = await HotelCollection.insertOne(newHotelRoom);

        if (result.acknowledged) {
          return res.status(201).json({
            success: true,
            message: 'হোটেল রুম সফলভাবে তৈরি হয়েছে',
            roomId: result.insertedId
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'হোটেল রুম তৈরি করতে সমস্যা হয়েছে'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });



    app.get('/hotel', async (req, res) => {
      try {
        const blogs = await HotelCollection.find().toArray();
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });



    // hotel details 
    app.get('/hotel/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await HotelCollection.findOne(query);
      res.send(result);
    });


    app.put('/hotel/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await HotelCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { permission: "yes" } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({
            success: true,
            message: 'Hotel approved successfully'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Hotel not found'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });


    // UPDATE hotel
    app.put('/update-hotel/:id', async (req, res) => {
      const { id } = req.params;
      const {
        hotelName,
        location,
        district,
        description,
        price,
        roomType,
        amenities,
        capacity,
        images,
        updatedAt
      } = req.body;

      try {
        const updatedHotel = {
          hotelName,
          location,
          district,
          description,
          price: parseFloat(price),
          roomType,
          amenities: Array.isArray(amenities) ? amenities : [amenities],
          capacity: parseInt(capacity),
          images,
          updatedAt,
          status: 'available',
          permission: 'no'
        };

        const result = await HotelCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedHotel }
        );

        if (result.modifiedCount > 0) {
          return res.status(200).json({
            success: true,
            message: 'Hotel updated successfully'
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'Hotel not found or no changes made'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });



    app.delete('/hotel/:id', async (req, res) => {
      try {
        const { id } = req.params; // Extract the hotel ID from URL parameters

        // Delete the hotel from the database
        const result = await HotelCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
          res.status(200).send({ message: 'hotel deleted successfully' });
        } else {
          res.status(404).send({ message: 'hotel not found' });
        }
      } catch (error) {
        res.status(500).send({ message: 'An error occurred while deleting the hotel.', error });
      }
    });





    // Vehicle Collection Here


    app.post('/vehicles', async (req, res) => {
      const {
        vehicleName,
        type,
        brand,
        model,
        price,
        seatingCapacity,
        transmission,
        fuelType,
        location,
        district,
        description,
        amenities,
        images,
        createdAt
      } = req.body;

      // 🛑 Validation
      if (
        !vehicleName ||
        !brand ||
        !model ||
        !price ||
        !seatingCapacity ||
        !location ||
        !district ||
        !description ||
        !images ||
        images.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'সব তথ্য প্রদান করা আবশ্যক এবং অন্তত একটি ছবি আপলোড করতে হবে।'
        });
      }

      try {
        // ✅ New vehicle data
        const newVehicle = {
          vehicleName,
          brand,
          model,
          vehicleType: type || 'Car',
          transmission: transmission || 'Automatic',
          fuelType: fuelType || 'Petrol',
          seats: parseInt(seatingCapacity) || 2,
          pricePerHour: parseFloat(price),
          pricePerDay: parseFloat(price) * 8, // Optional logic: 1 day = 8 hrs
          features: Array.isArray(amenities) ? amenities : [amenities],
          images,
          location,
          district,
          description,
          createdAt: createdAt || new Date().toISOString(),
          status: 'available',
          permission: 'no',
          rating: 0,
          bookings: []
        };

        const result = await VehicleCollection.insertOne(newVehicle);

        if (result.acknowledged) {
          return res.status(201).json({
            success: true,
            message: 'গাড়ি সফলভাবে যুক্ত হয়েছে',
            vehicleId: result.insertedId
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'গাড়ি যুক্ত করতে সমস্যা হয়েছে'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });


    app.get('/vehicles', async (req, res) => {
      try {
        const vehicles = await VehicleCollection.find().toArray();
        res.status(200).json(vehicles);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });


    // Vehicle details 
    app.get('/vehicle/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await VehicleCollection.findOne(query);
      res.send(result);
    });







    // Approve Vehicle Route
    app.put('/vehicles/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await VehicleCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { permission: "yes" } }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({
            success: true,
            message: 'Vehicle approved successfully'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Vehicle not found'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });


    // update vehicle 
    app.put('/update-vehicles/:id', async (req, res) => {
      const { id } = req.params;
      const {
        vehicleName,
        vehicleType,
        brand,
        model,
        pricePerHour,
        pricePerDay,
        seats,
        transmission,
        fuelType,
        location,
        district,
        description,
        features,
        images
      } = req.body;

      // 🛑 Validation
      if (
        !vehicleName
      ) {
        return res.status(400).json({
          success: false,
          message: 'সব তথ্য প্রদান করা আবশ্যক এবং অন্তত একটি ছবি থাকতে হবে।'
        });
      }

      try {
        // ✅ Update vehicle data
        const updatedVehicle = {
          vehicleName,
          brand,
          model,
          vehicleType: vehicleType || 'Car',
          transmission: transmission || 'Automatic',
          fuelType: fuelType || 'Petrol',
          seats: parseInt(seats) || 2,
          pricePerHour: parseFloat(pricePerHour),
          pricePerDay: pricePerDay || parseFloat(pricePerHour) * 8,
          features: Array.isArray(features) ? features : [features],
          images,
          location,
          district,
          description,
          updatedAt: new Date().toISOString()
        };

        const result = await VehicleCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedVehicle }
        );

        if (result.modifiedCount > 0) {
          return res.status(200).json({
            success: true,
            message: 'গাড়ি সফলভাবে আপডেট হয়েছে',
            vehicleId: id
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'গাড়ি খুঁজে পাওয়া যায়নি'
          });
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });



    // Backend: Delete VehicleCollection (DELETE)
    app.delete('/vehicles/:id', async (req, res) => {
      try {
        const { id } = req.params; // Extract the product ID from URL parameters

        // Delete the Vehicle from the database
        const result = await VehicleCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
          res.status(200).send({ message: 'Vehicle deleted successfully' });
        } else {
          res.status(404).send({ message: 'Vehicle not found' });
        }
      } catch (error) {
        res.status(500).send({ message: 'An error occurred while deleting the Vehicle.', error });
      }
    });






    // Payment


    // SSL Commerz Payment System 
    // Hotel booking payment endpoint

    // Hotel booking route
    app.post('/hotel-bookings', async (req, res) => {
      try {
        const { hotelId, userEmail, userName, userPhone, userAddress, totalAmount, checkInDate, checkOutDate } = req.body;

        const tran_id = new ObjectId().toString();
        const hotel = await HotelCollection.findOne({ _id: new ObjectId(hotelId) });

        if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
        }

        const paymentData = {
          total_amount: totalAmount,
          currency: 'BDT',
          tran_id: tran_id,
          success_url: `https://varsity-project-server-site.vercel.app/payment/success/${tran_id}`,
          fail_url: `https://varsity-project-server-site.vercel.app/payment/fail/${tran_id}`,
          cancel_url: 'http://localhost:3030/cancel',
          ipn_url: 'http://localhost:3030/ipn',
          shipping_method: 'Courier',
          product_name: hotel.hotelName,
          product_category: 'Hotel Booking',
          product_profile: 'physical-goods',

          cus_name: 'Customer Name',
          cus_email: 'customer@example.com',
          cus_add1: userAddress,
          cus_add2: userAddress,
          cus_city: 'Dhaka',
          cus_state: 'Dhaka',
          cus_postcode: '1000',
          cus_country: 'Bangladesh',
          cus_phone: '01711111111',
          cus_fax: '01711111111',

          ship_name: 'Customer Name',
          ship_add1: 'Dhaka',
          ship_add2: 'Dhaka',
          ship_city: 'Dhaka',
          ship_state: 'Dhaka',
          ship_postcode: 1000,
          ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(paymentData);
        const GatewayPageURL = apiResponse?.GatewayPageURL;

        if (GatewayPageURL) {
          await BookingCollection.insertOne({
            hotelId: hotel._id,
            hotelName: hotel.hotelName,
            hotelPrice: totalAmount,
            userEmail,
            userName,
            userPhone,
            userAddress,
            checkInDate,
            checkOutDate,
            paymentMethod: "SSLCommerz",
            status: "pending",
            paidStatus: false,
            transactionId: tran_id,
            bookingDate: new Date(),
          });

          res.send({ url: GatewayPageURL });
        } else {
          res.status(500).json({ message: "Payment Gateway URL not received" });
        }

      } catch (error) {
        console.error('Error processing hotel booking:', error);
        res.status(500).json({ message: 'Server error', error });
      }
    });




    app.post('/travel-bookings', async (req, res) => {
      try {
        const { tourId, price } = req.body;
        console.log("Received booking request:", req.body); // ✅ Log incoming data

        const tour = await TourCollection.findOne({ _id: new ObjectId(tourId) });
        if (!tour) {
          console.error("Tour not found:", tourId);
          return res.status(404).json({ error: "Tour not found" });
        }

        const tran_id = new ObjectId().toString();
        const paymentData = {
          total_amount: Number(tour.price),
          currency: 'BDT',
          tran_id: tran_id,
          success_url: `https://varsity-project-server-site.vercel.app/payment/success/${tran_id}`,
          fail_url: `https://varsity-project-server-site.vercel.app/payment/fail/${tran_id}`,
          cancel_url: `http://localhost:3030/cancel`,
          ipn_url: `http://localhost:3030/ipn`,
          shipping_method: 'Courier',
          product_name: 'coxs',
          product_category: 'Tour Booking',
          product_profile: 'general',

          cus_name: 'Customer Name',
          cus_email: 'customer@example.com',
          cus_add1: 'Dhaka',
          cus_add2: 'Dhaka',
          cus_city: 'Dhaka',
          cus_state: 'Dhaka',
          cus_postcode: '1000',
          cus_country: 'Bangladesh',
          cus_phone: '01711111111',
          cus_fax: '01711111111',
          ship_name: 'Customer Name',
          ship_add1: 'Dhaka',
          ship_add2: 'Dhaka',
          ship_city: 'Dhaka',
          ship_state: 'Dhaka',
          ship_postcode: 1000,
          ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(paymentData);
        console.log("SSLCommerz response:", apiResponse); // ✅ Log API response

        if (!apiResponse.GatewayPageURL) {
          console.error("No Gateway URL:", apiResponse);
          return res.status(500).json({ error: "Payment gateway error" });
        }

        // Save booking to DB
        await BookingCollection.insertOne({
          tourId: tour._id,
          tourName: tour.touristSpotName,
          price: price,
          transactionId: tran_id,
          status: "pending",
          paidStatus: false,
        });

        // ✅ Send the payment URL to frontend
        res.json({ url: apiResponse.GatewayPageURL });

      } catch (error) {
        console.error("❌ Booking error:", error);
        res.status(500).json({ error: "Server error" });
      }
    });



    // In your backend (server.js or similar)
    app.post('/product-payments', async (req, res) => {
      try {
        const { productId, productName, price, quantity, totalAmount } = req.body;

        // Similar to your hotel booking logic but for products
        const tran_id = new ObjectId().toString();
        const paymentData = {
          total_amount: Number(totalAmount),
          currency: 'BDT',
          tran_id: tran_id,
          success_url: `https://varsity-project-server-site.vercel.app/payment/success/${tran_id}`,
          fail_url: `https://varsity-project-server-site.vercel.app/payment/fail/${tran_id}`,
          product_name: productName,
          product_category: 'E-commerce',
          product_profile: 'general',
          shipping_method: 'Courier',
          cus_name: 'Customer Name',
          cus_email: 'customer@example.com',
          cus_add1: 'Dhaka',
          cus_add2: 'Dhaka',
          cus_city: 'Dhaka',
          cus_state: 'Dhaka',
          cus_postcode: '1000',
          cus_country: 'Bangladesh',
          cus_phone: '01711111111',
          cus_fax: '01711111111',
          ship_name: 'Customer Name',
          ship_add1: 'Dhaka',
          ship_add2: 'Dhaka',
          ship_city: 'Dhaka',
          ship_state: 'Dhaka',
          ship_postcode: 1000,
          ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(paymentData);
        console.log("SSLCommerz response:", apiResponse); // ✅ Log API response

        if (apiResponse.GatewayPageURL) {
          console.error("No Gateway URL:", apiResponse);
          // Save to your orders/payments collection
          await BookingCollection.insertOne({
            productId,
            productName,
            price,
            quantity,
            totalAmount,
            status: "pending",
            paidStatus: false,
            transactionId: tran_id,
            paymentMethod: "SSLCommerz",
            createdAt: new Date()
          });

          res.send({ url: apiResponse.GatewayPageURL });
        } else {
          res.status(500).json({ error: "Payment gateway error" });
        }
      } catch (error) {
        console.error("Product payment error:", error);
        res.status(500).json({ error: "Server error" });
      }
    });





    app.post('/vehicle-payments', async (req, res) => {
      try {
        const {
          vehicleId,
          vehicleName,
          brand,
          model,
          price,
          bookingType,
          totalAmount
        } = req.body;

        // Generate unique transaction ID
        const tran_id = new ObjectId().toString();

        const paymentData = {
          total_amount: Number(price),
          currency: 'BDT',
          tran_id: tran_id,
          success_url: `https://varsity-project-server-site.vercel.app/payment/success/${tran_id}`,
          fail_url: `https://varsity-project-server-site.vercel.app/payment/fail/${tran_id}`,
          product_name: `${brand} ${model} (${vehicleName})`,
          product_category: 'Vehicle Rental',
          product_profile: 'physical-goods',
          shipping_method: 'NO',
          cus_name: 'Customer Name',
          cus_email: 'customer@example.com',
          cus_add1: 'Dhaka',
          cus_add2: 'Dhaka',
          cus_city: 'Dhaka',
          cus_state: 'Dhaka',
          cus_postcode: '1000',
          cus_country: 'Bangladesh',
          cus_phone: '01711111111',
          cus_fax: '01711111111',
          ship_name: 'Customer Name',
          ship_add1: 'Dhaka',
          ship_add2: 'Dhaka',
          ship_city: 'Dhaka',
          ship_state: 'Dhaka',
          ship_postcode: 1000,
          ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(paymentData);
        console.log("SSLCommerz response:", apiResponse);

        if (apiResponse.GatewayPageURL) {
          // Save to your vehicle bookings collection
          await BookingCollection.insertOne({
            vehicleId,
            vehicleName,
            brand,
            model,
            price,
            bookingType,
            totalAmount,
            status: "pending",
            paidStatus: false,
            transactionId: tran_id,
            paymentMethod: "SSLCommerz",
            createdAt: new Date()
          });

          res.send({ url: apiResponse.GatewayPageURL });
        } else {
          console.error("No Gateway URL:", apiResponse);
          res.status(500).json({ error: "Payment gateway error" });
        }
      } catch (error) {
        console.error("Vehicle payment error:", error);
        res.status(500).json({ error: "Server error" });
      }
    });





    // Payment Success route (keep it outside the main route)
    app.post("/payment/success/:tranId", async (req, res) => {
      try {
        const result = await BookingCollection.updateOne(
          { transactionId: req.params.tranId },
          { $set: { paidStatus: true, status: 'confirmed' } }
        );

        if (result.modifiedCount > 0) {
          res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`);
        } else {
          res.status(400).json({ message: 'Booking not found or already updated' });
        }
      } catch (err) {
        console.error('Payment success update error:', err);
        res.status(500).json({ message: 'Internal server error' });
      }

    });



    app.post('/payment/fail/:tranId', async (req, res) => {
      try {
        const result = await BookingCollection.deleteOne({ transactionId: req.params.tranId });

        if (result.deletedCount > 0) {
          res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`);
        } else {
          res.status(404).json({ message: 'Booking not found to delete' });
        }
      } catch (error) {
        console.error('Payment fail route error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    // Get all Order
    app.get('/order', async (req, res) => {
      try {
        const blogs = await BookingCollection.find().toArray();
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });







    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);




// Define a simple route
app.get('/', (req, res) => {
  res.send("Samadhan-Group server is running...");
});



// Global route error handler
app.all('*', (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Route Not Found',
  });
});

// Global Error handle
app.use((error, req, res, next) => {
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Server something went wrong',
    });
  }
  next();
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});