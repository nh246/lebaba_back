const { generateToken } = require("../middleware/generateToken");

const { successResponse, errorResponse } = require("../utilis/responseHandler");
const User = require("./user.model");

// UserRegistration
const userRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body)

    const user = new User({ username, email, password });
    // console.log(user)
    await user.save();
    res.status(200).send({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering a user:", error);
    res.status(500).send({ message: "Registration failed" });
  }
};

//   user LoggedIn

const userLoggedIn = async (req, res) => {
  //   console.log(req.body)

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "invalid password" });
    }
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Error logging in a user:", error);
    res.status(500).send({ message: "Login failed" });
  }
};

// user Logout

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    // res.status(200).send({ message: "Logged out successfully" });

    successResponse(res, 200, "Logged out successfully");
  } catch (error) {
    // console.error("Error logged out a user:", error);
    // res.status(500).send({ message: "Logged out failed" });
    errorResponse(res, 500, "Logged out failed", error);
  }
};

// get all users

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email role ").sort({ createdAt: -1 });
    successResponse(res, 200, "All users fetched successfully", (data = users));
  } catch (error) {
    errorResponse(res, 500, "Failed to fetch all users", error);
  }
};

// delete User

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    errorResponse(res, 500, "Failed to delete user", error);
  }
};

// update user role

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(
      res,
      200,
      " User role updated successfully",
      (data = updatedUser)
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to update user role", error);
  }
};

// edit User Profile

const editUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, profileImage, bio, profession } = req.body;
  try {
    const updateFields = {
      username,
      profileImage,
      bio,
      profession,
    };
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {new: true, runValidators: true });
    if (!updatedUser) {
      return errorResponse(res, 404, "User not found")
    }
    return successResponse(res, 200, "User profile updated successfully!", data = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      bio: updatedUser.bio,
      profession: updatedUser.profession,
    });
  } catch (error) {
    errorResponse(res, 500, "Failed to Update user profile", error);
  }
};

module.exports = {
  userRegistration,
  userLoggedIn,
  userLogout,
  getAllUsers,
  deleteUser,
  updateUserRole,
  editUserProfile,
};
