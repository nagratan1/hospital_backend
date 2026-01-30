import twilio from 'twilio'

// const client = new twilio(
//   process.env.REMOVED,
//   process.env.REMOVED
// );

// const client = new twilio(
//  'REMOVED',
//   'REMOVED'
// );
const client = new twilio(
 'REMOVED',
  'REMOVED'
);


export async function sendOTP(userid,otp) {
    try {
    const message = await client.messages.create({
      body: `Your verification code is ${otp}. It is valid for 5 minutes. Never share this code with anyone.`,
    //   from: '+16282374807',
    //   from: '+16282374807',
      to: '+'+91+userid,
    });
    return otp;
  } catch (error) {
    console.error("Failed to send OTP:", error.message);
    return null;
  }
}

