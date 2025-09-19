const Connection = require("../models/connectionRequest");
const User = require("../models/user");
const express = require("express");

const connectionController = {

   seeUsersinFeedPage: async (req, res) => {
    try {
      // user should see the all users to send connection request except
      // 1. His own Card
      // 2. His Connections who already accepted the connection request or Rejected
      // 3. If he ignore any users
      // 4. already send the connection request
         
         //Add Pagination

         const {page,limit}= req.params;
         const pageNumber = parseInt(page);
         const pageSize = parseInt(limit);

        // find all the connection request that you send or Received
        const connectionRequest = await Connection.find({
          $or:[
            {fromUserId: req.user.userId},
            {toUserId: req.user.userId}
          ]
        }).select("fromUserId toUserId")

        // The above code give you the all connection that you either accepted , rejected or ignored 
        // so now we write code to hide this user in feed so that it do not show in feed page

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=>{
          hideUserFromFeed.add(req.fromUserId.toString());
          hideUserFromFeed.add(req.toUserId.toString())
        })

         // Ensure current user is also excluded
        hideUserFromFeed.add(req.user.userId.toString());

         //  Count total available users for pagination

         const totalUsers = await User.countDocuments({
          _id:{$nin:Array.from(hideUserFromFeed)}
         })

        const users = await User.find({
          _id: { $nin: Array.from(hideUserFromFeed) }
        }).select("-password -email")
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize);
        
         res.status(200).json({
          message: "All users fetched successfully",
          totalUsers,
          count: users.length,
          users
    });

      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({
            message:
            "Unable to see the other users to send friend request! Internal Server Error",
        });
    }
  },

  sendRequest: async (req, res) => {
    try {
      const fromUserId = req.user.userId;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Inavlid status type" + status });
      }

      // you can send request to only those user who is present in database
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .json({
            message: "You cannot send request to this user, It is not present",
          });
      }

      // If there is an existing ConnectionRequest
      const existingConnectionRequest = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({
            message:
              "Connection Request Already exists , You cannot send it again",
          });
      }

      const connectionRequest = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.status(200).json({ message: "Request Send", connectionRequest });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to send Request! Internal Server Error" });
    }
  },

  getThePendingConnectionRequest: async (req, res) => {
    try {
      const connectionRequest = await Connection.find({
        toUserId: req.user.userId,
        status: "interested",
      }).populate("fromUserId", ["firstName", "lastName"]);

      if (!connectionRequest) {
        res.status(404).json({ message: "Connection Request not found" });
      }

      res
        .status(200)
        .json({
          message: "Connection Request fetched Succsfully",
          connectionRequest,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "connection Request failed to fetch" });
    }
  },

  AcceptOrRejectTheRequest: async (req, res) => {
    try {
      // for example like if chandra send the request to Ram then
      // the status must be in interested then he can accept it or reject it
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Inavlid status type" + status });
      }

      const connectReq = await Connection.findOne({
        _id: requestId,
        // toUserId,
        status: "interested",
      });

      if (!connectReq) {
        return res
          .status(404)
          .json({ message: "Connection Request not Found" });
      }

      connectReq.status = status;

      await connectReq.save();

      res
        .status(200)
        .json({ message: "Connection Request is done", connectReq });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  seeTheConnection: async (req, res) => {
    try {
      const userId = req.user.userId;

      const connectingUsers = await Connection.find({
        status: "accepted",
        $or: [{ fromUserId: userId }, { toUserId: userId }],
      })
        .populate("fromUserId", "firstName lastName photourl bio age gender")
        .populate("toUserId", "firstName lastName photourl bio age gender");

      if (connectingUsers.length === 0) {
        return res
          .status(404)
          .json({ message: "No accepted connections found" });
      }

      const friends = connectingUsers.map((conn) => {
        if (conn.fromUserId._id.toString() === userId) {
          return conn.toUserId; // show the other person
        } else {
          return conn.fromUserId;
        }
      });

      res.status(200).json({
        message: "Accepted connections fetched successfully",
        count: friends.length,
        friends,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "unable to fetch the connection, Internal Server Error",
        });
    }
  },
};

module.exports = connectionController;
