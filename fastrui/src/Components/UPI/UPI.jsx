import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UPI = ({ setIsLoading, getAllUPIData }) => {
  const [upiId, setUpiId] = useState();

  const createUpiHandle = async () => {
    try {
      if (!upiId) {
        toast.error("upi handle required");
      } else {
        setIsLoading(true);
        const { data } = await axios.post(
          "https://fastr-prototype.vercel.app/api/v1/upi/createUpiHandle",
          {
            upiId,
          }
        );

        if (data.success) {
          toast.success(data.message);
          getAllUPIData();
          setIsLoading(false);
        }
      }
    } catch (error) {
      toast.error("error : ", error);
    }
  };

  return (
    <div className="upi-box">
      <div className="upi-input-box">
        <label>UPI ID</label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
      </div>
      <button type="submit" onClick={createUpiHandle}>
        Save
      </button>
    </div>
  );
};

export default UPI;
