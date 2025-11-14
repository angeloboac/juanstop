const axios = require("axios");
const FormData = require("form-data");

const uploadToImgBB = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file.buffer.toString("base64"));

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      { headers: formData.getHeaders() }
    );
    return response.data.data.url;
  } catch (err) {
    console.error("ImgBB Upload Error:", err.response?.data || err.message);
    return "";
  }
};

module.exports = uploadToImgBB;