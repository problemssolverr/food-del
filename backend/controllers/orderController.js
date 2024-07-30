// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import paystack from 'paystack-api';


// const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);


// // placing user order for frontend
// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173"
//     try {
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address
//         })
//         await newOrder.save()
//         await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}})
//         const line_items = req.body.items.map((item) => ({
//             price_data: {
//                 currency: "NGN",
//                 product_data: {
//                     name: item.name
//                 },
//                 unit_amount: item.price*100
//             },
//             quantity: item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency: "NGN",
//                 product_data: {
//                     name: "Delivery Charges"
//                 },
//                 unit_amount: 2*100
//             },
//             quantity: 1
//         })

//         // const transaction = await paystackClient.transaction.initialize()

//         const session = await paystackClient.transaction.initialize({
//             line_items: line_items,
//             mode: "payment",
//             session_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })
//         console.log("Session:", session);

//         res.json({success: true, session_url: session.url})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"})
//     }
// }


















































import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import paystack from 'paystack-api';

const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

const placeOrder = async (req, res) => {
    const exchangeRate = 1550; // Example exchange rate from USD to NGN
    const { userId, items, amount, address, email } = req.body;
    
    // Calculate amount in Naira
    const amountInNaira = amount * exchangeRate;
    const frontend_url = "http://localhost:5173";
    
    try {
        // Ensure the amount is provided
        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        // Create new order in the database
        const newOrder = new orderModel({
            userId,
            items,
            amount: amountInNaira, // Store the amount in Naira
            address
        });
        await newOrder.save();

        // Update user's cart data
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Initialize Paystack transaction
        const paymentDetails = {
            email: email, // Ensure email is provided in the request body
            amount: amountInNaira * 100, // Amount in kobo
            reference: newOrder._id.toString(), // Reference should be a unique identifier
            callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`,
            metadata: {
                custom_fields: [
                    {
                        display_name: "Order ID",
                        variable_name: "order_id",
                        value: newOrder._id
                    },
                    {
                        display_name: "Items",
                        variable_name: "items",
                        value: items.map(item => `${item.name} (x${item.quantity})`).join(", ")
                    },
                    {
                        display_name: "Address",
                        variable_name: "address",
                        value: `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`
                    },
                    {
                        display_name: "Phone",
                        variable_name: "phone",
                        value: address.phone
                    }
                ]
            }
        };

        const transaction = await paystackClient.transaction.initialize(paymentDetails);

        // Log the transaction
        console.log("Transaction:", transaction);

        // Respond with Paystack payment URL
        res.json({ success: true, session_url: transaction.data.authorization_url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { reference, orderId } = req.query;

        const verification = await paystackClient.transaction.verify(reference);

        if (verification.data.status === 'success') {
            await orderModel.findByIdAndUpdate(orderId, { status: 'paid' });
            res.json({ success: true, message: 'Payment successful' });
        } else {
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error verifying payment' });
    }
};

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// API for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyPayment, userOrders, listOrders, updateStatus };













// const placeOrder = async (req, res) => {
//     const exchangeRate = 1550
//     const amountInNaira = amount * exchangeRate
//     const frontend_url = "http://localhost:5174";
//     try {
//         const { userId, items, amount, address, email } = req.body;

//         // Ensure the amount is provided
//         if (!amount) {
//             return res.status(400).json({ success: false, message: "Amount is required" });
//         }

//         // Create new order in the database
//         const newOrder = new orderModel({
//             userId,
//             items,
//             amount,
//             address
//         });
//         await newOrder.save();

//         // Update user's cart data
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         // Initialize Paystack transaction
//         const paymentDetails = {
//             email: email, // Ensure email is provided in the request body
//             amount: amountInNaira * 100, // Amount in kobo
//             reference: newOrder._id.toString(), // Reference should be a unique identifier
//             callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`,
//             metadata: {
//                 custom_fields: [
//                     {
//                         display_name: "Order ID",
//                         variable_name: "order_id",
//                         value: newOrder._id
//                     },
//                     {
//                         display_name: "Items",
//                         variable_name: "items",
//                         value: items.map(item => `${item.name} (x${item.quantity})`).join(", ")
//                     },
//                     {
//                         display_name: "Address",
//                         variable_name: "address",
//                         value: `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}`
//                     },
//                     {
//                         display_name: "Phone",
//                         variable_name: "phone",
//                         value: address.phone
//                     }
//                 ]
//             }
//         };

//         const transaction = await paystackClient.transaction.initialize(paymentDetails);

//         // Log the transaction
//         console.log("Transaction:", transaction);

//         // Respond with Paystack payment URL
//         res.json({ success: true, session_url: transaction.data.authorization_url });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error placing order" });
//     }
// };

// const verifyPayment = async (req, res) => {
//     try {
//         const { reference, orderId } = req.query;

//         const verification = await paystackClient.transaction.verify(reference);

//         if (verification.data.status === 'success') {
//             await orderModel.findByIdAndUpdate(orderId, { status: 'paid' });
//             res.json({ success: true, message: 'Payment successful' });
//         } else {
//             res.json({ success: false, message: 'Payment failed' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: 'Error verifying payment' });
//     }
// };

// // user order for frontend

// const userOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({userId: req.body.userId})
//         res.json({success:true, data: orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message: "Error"})
//     }
// }

// // Listing Orders for admin panel

// const listOrders = async (req, res) => {
//     try {
//         const orders = await orderModel.find({})
//         res.json({success: true, data: orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
// }

// // api for updating order status
// const updateStatus = async (req, res) => {
//     try {
//         await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
//         res.json({success:true, message:"Status Updated"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"})
//     }
// }

// export { placeOrder, verifyPayment, userOrders, listOrders, updateStatus };








// Prev
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import paystack from 'paystack-api';

// const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";
//     try {
//         const { userId, items, amount, address, email } = req.body;

//         if (!amount) {
//             return res.status(400).json({ success: false, message: "Amount is required" });
//         }

//         const newOrder = new orderModel({
//             userId,
//             items,
//             amount,
//             address
//         });
//         await newOrder.save();

//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         const paymentDetails = {
//             email: email,
//             amount: amount * 100,
//             reference: newOrder._id.toString(),
//             callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`
//         };

//         const transaction = await paystackClient.transaction.initialize(paymentDetails);

//         console.log("Transaction:", transaction);

//         res.json({
//             success: true,
//             session_url: transaction.data.authorization_url,
//             order: {
//                 items,
//                 amount,
//                 address,
//                 email
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error placing order" });
//     }
// };

// const verifyPayment = async (req, res) => {
//     try {
//         const { reference, orderId } = req.query;

//         const verification = await paystackClient.transaction.verify(reference);

//         if (verification.data.status === 'success') {
//             await orderModel.findByIdAndUpdate(orderId, { status: 'paid' });
//             res.json({ success: true, message: 'Payment successful' });
//         } else {
//             res.json({ success: false, message: 'Payment failed' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: 'Error verifying payment' });
//     }
// };

// export { placeOrder, verifyPayment };




















// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import paystack from 'paystack-api';

// const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";
//     try {
//         const { userId, items, amount, address, email } = req.body;

//         // Ensure the amount is provided
//         if (!amount) {
//             return res.status(400).json({ success: false, message: "Amount is required" });
//         }

//         // Create new order in the database
//         const newOrder = new orderModel({
//             userId,
//             items,
//             amount,
//             address
//         });
//         await newOrder.save();

//         // Update user's cart data
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });

//         // Initialize Paystack transaction
//         const paymentDetails = {
//             email: email, // Ensure email is provided in the request body
//             amount: amount * 100, // Amount in kobo
//             reference: newOrder._id.toString(), // Reference should be a unique identifier
//             callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`
//         };

//         const transaction = await paystackClient.transaction.initialize(paymentDetails);

//         // Log the transaction
//         console.log("Transaction:", transaction);

//         // Respond with Paystack payment URL
//         res.json({ success: true, session_url: transaction.data.authorization_url });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error placing order" });
//     }
// };

// const verifyPayment = async (req, res) => {
//     try {
//         const { reference, orderId } = req.query;

//         // Verify transaction with Paystack
//         const verification = await paystackClient.transaction.verify(reference);

//         if (verification.data.status === 'success') {
//             // Update order status to paid
//             await orderModel.findByIdAndUpdate(orderId, { status: 'paid' });
//             res.json({ success: true, message: 'Payment successful' });
//         } else {
//             res.json({ success: false, message: 'Payment failed' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: 'Error verifying payment' });
//     }
// };

// export { placeOrder, verifyPayment };

















// // Placing user order for frontend
// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";
//     try {
//         // Create new order in database
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address
//         });
//         await newOrder.save();

//         // Update user's cart data
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//         // Initialize Paystack transaction
//         const paymentDetails = {
//             email: req.body.email,
//             amount: req.body.amount * 100, // Amount in kobo
//             reference: newOrder._id, // Reference should be a unique identifier
//             callback_url: `${frontend_url}/verify?orderId=${newOrder._id}`
//         };

//         const transaction = await paystackClient.transaction.initialize(paymentDetails);

//         // Log the transaction
//         console.log("Transaction:", transaction);

//         // Respond with Paystack payment URL
//         res.json({ success: true, payment_url: transaction.data.authorization_url });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" });
//     }
// };

// const verifyPayment = async (req, res) => {
//     try {
//         const { reference, orderId } = req.query;

//         // Verify transaction with Paystack
//         const verification = await paystackClient.transaction.verify(reference);

//         if (verification.data.status === 'success') {
//             // Update order status to paid
//             await orderModel.findByIdAndUpdate(orderId, { status: 'paid' });
//             res.json({ success: true, message: 'Payment successful' });
//         } else {
//             res.json({ success: false, message: 'Payment failed' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: 'Error verifying payment' });
//     }
// };
// export {placeOrder, verifyPayment}