import Admin from "../model/admin.js";






export const Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Sanitize
    email = email.trim().toLowerCase();
    password = password.trim();

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    console.log("🔹 Login attempt:", email);

    // DB call with timeout safety
    const admin = await Admin.findOne({ email })
      .select("+password")
      .maxTimeMS(5000); // ⛑ prevents DB hanging forever

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Password compare (async)
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = admin.generateJWTToken();

    const adminData = admin.toObject();
    delete adminData.password;

    // Safer cookie options
    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    console.log("✅ Login success:", email);

    return res
      .status(200)
      .cookie("token", token, option)
      .json({
        success: true,
        message: "Login successful",
        user: adminData,
        token,
      });

  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    // Create a new admin
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    // Generate a token
    const token = await newAdmin.generateJWTToken();

    const option = {
      httpOnly: true,
      secure: true
    };

    return res.status(201)
      .cookie('token', token, option)
      .json({
        success: true,
        message: "Signup successful",
        user: newAdmin,
        token,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


