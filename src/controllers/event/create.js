const { uploadImage } = require("../../utils/cloudinary");

const createEvent = async (req, res) => {
  const {
    db: { Event },
    body: {
      organizer_id,
      type,
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      borough,
      description,
    },
    file,
  } = req;

  // Check if file is provided
  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    // Upload the image to Cloudinary
    const uploadedImage = await uploadImage(file.path);
    // Extract the secure_url from the response and assign it to the image
    const image = uploadedImage.secure_url;

    const event = await Event.create(
      organizer_id,
      type,
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      borough,
      description,
      image,
    );

    res.send(event);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error uploading image and creating event" });
  }
};

module.exports = createEvent;
