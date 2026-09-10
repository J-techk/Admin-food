import React, { useState } from "react";
import upload from "../../assets/uploadimg.jpg";
import imageCompression from "browser-image-compression";
import { backendUrl } from "../../App";
import "./Add.css";
import { toast } from "react-toastify";
import axios from "axios";

const Add = ({ token }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("All");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!image) {
        toast.error("Please select a product image");
        return;
      }

      const compressedImage = await imageCompression(image, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      console.log("Original image size:", image.size);
      console.log("Compressed image size:", compressedImage.size);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", compressedImage);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            token,
          },
        },
      );

      console.log("SERVER RESPONSE:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);

        setName("");
        setDescription("");
        setPrice("");
        setCategory("All");
        setImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("SERVER RESPONSE:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="form-container">
      <div>
        <p className="form-label">Upload Image</p>
        <div className="image_upload_container">
          <label htmlFor="image">
            <img
              src={!image ? upload : URL.createObjectURL(image)}
              alt=""
              className="image-preview"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="form-group">
        <p className="form-label">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="form-input"
          placeholder="Enter Product Name"
          required
        />
      </div>

      <div className="form-group">
        <p className="form-label">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="form-input"
          placeholder="Type Product Description"
          required
        ></textarea>
      </div>

      <div className="form-group-horizontal">
        <div>
          <p className="form-label">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="form-select"
          >
            <option value="All">All</option>
            <option value="Spaghetti">Spaghetti</option>
            <option value="Pizza">Pizza</option>
            <option value="Rice">Rice</option>
            <option value="Chicken">Chicken</option>
            <option value="Noodles">Noodles</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>

        <div>
          <p className="form-label">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="Number"
            placeholder="30"
            className="form-input price-input"
            required
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;
