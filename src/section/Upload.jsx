import { React, useState, useEffect } from "react";
import FormData from "form-data";
import Layout from "../component/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import fs from "fs";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZjkwOTc4NS0yYzhlLTQ0YTQtYmE3Ni05MWIxMzIwN2M1MzIiLCJlbWFpbCI6ImFudXJhZy5zYWh1QGluZGljY2hhaW4uY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjQ5ZWU0YTAwYmZjMzNlYTVkZjcxIiwic2NvcGVkS2V5U2VjcmV0IjoiNDE1ODI0MGZhNzNmMmFlM2RkZGM0N2VlM2FkM2FkYzNlYWFhMjdjZWNlMzQyM2NjYWFlMWU1N2I3Y2U5MzU1YiIsImlhdCI6MTY5NzQxOTYyMn0.OrFiCqAHRGlg5vnRAMxgW_hsmVTpwb_1kRSDtDEx7Pk";

function Upload() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageCID, setImageCID] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    async function updateImageCID() {
      if (file) {
        const hash = await uploadImage();
        setImageCID(hash);
      }
    }

    updateImageCID();
  }, [file]);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      const resData = await res.data;
      console.log("this is res data", resData);
      const uploadhash = await resData.IpfsHash;
      setImageCID(uploadhash);
      console.log("my cid has", imageCID);
      toast.success("Image uploaded to IPFS successfully!");
      return resData.IpfsHash;
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image to IPFS.");
    }
    return resData.IpfsHash;
  };

  const uploadMetadata = async () => {
    try {
      const data = JSON.stringify({
        pinataContent: {
          name,
          description,
          price,
          image: `https://ipfs.io/ipfs/${imageCID}`,
        },
        pinataMetadata: {
          name: name,
        },
      });

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JWT}`,
          },
          body: data,
        }
      );

      const resData = await res.json();
      toast.success("Metadata uploaded to IPFS successfully!");
      console.log(resData.IpfsHash);
      return resData.IpfsHash;
    } catch (error) {
      console.error(error);
      toast.error("Error uploading metadata to IPFS.");
    }
  };

  const handleUpload = async () => {
    try {
      const hash = await uploadImage();

      setImageCID(hash);

      console.log("this is image cid", imageCID);

      const metadataCID = await uploadMetadata();
      console.log("maetadata", metadataCID, typeof metadataCID);
      toast.success("NFT metadata uploaded successfully!");

      const uir = `https://ipfs.io/ipfs/${metadataCID}`;
      // Reset the form
      setFile(null);
      setName("");
      setDescription("");
      setPrice("");
    
    } catch (error) {
      console.error(error);
      toast.error("Error uploading NFT metadata.");
    }
  
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Upload Image and Metadata to IPFS via Pinata
        </h2>
        <form className="bg-gray-200 shadow-xl rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select an Image:
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded shadow-xl text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description:
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price:
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleUpload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default Upload;
