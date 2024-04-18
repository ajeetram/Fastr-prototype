import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { Close, Delete } from "@mui/icons-material";

const UPIData = ({
  setCopiedUpiHandle,
  copiedUpiHandle,
  checkedStateUpi,
  setCheckedStateUpi,
  copiedDataLength,
  setCopiedDataLength,
  setCountUpiId,
  setCheckedState,
  setCopiedCard,
  setEnterAmnt,
  setIsLoading,
  loading,
  upiArray,
  getAllUPIData,
}) => {
  const [updateUpiId, setUpdateUpiId] = useState("");
  const [selectedId, setSelectedID] = useState("");
  const [openModal, setOpenModal] = useState(false);

  //   try {
  //     const { data } = await axios.get(
  //       "https://fastr-prototype.vercel.app/api/v1/upi/AllUpiHandle"
  //     );
  //     if (data.success) {
  //       setCountUpiId(data.data.length)
  //       setUPIArray(data.data);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };

  const updateUpiIdHandler = async (selectedId) => {
    try {
      const { data } = await axios.put(
        `https://fastr-prototype.vercel.app/api/v1/upi/updateUpiHandle/${selectedId}`,
        {
          upiId: updateUpiId,
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllUPIData();
      }
    } catch (error) {}
  };

  const deleteUpiId = async (Id) => {
    try {
      const toastId = toast.loading("please wait...");
      const { data } = await axios.delete(
        `https://fastr-prototype.vercel.app/api/v1/upi/deleteUpiHandle/${Id}`
      );
      if (data.success) {
        toast.dismiss(toastId);
        toast.success(data.message);
        setCheckedState(new Array(5).fill(false));
        setCheckedStateUpi(new Array(5).fill(false));
        setCopiedCard(new Array(5).fill(0));
        setCopiedUpiHandle(new Array(5).fill(0));
        setEnterAmnt(new Array(10).fill(0));
        setCopiedDataLength(0);
        getAllUPIData();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleOnChange = (position, data) => {
    const updatedCheckedState = checkedStateUpi.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedStateUpi(updatedCheckedState);

    if (updatedCheckedState[position]) {
      const newArray = [...copiedUpiHandle];
      newArray[position] = data;
      setCopiedUpiHandle(newArray);
      let length = copiedDataLength + 1;
      setCopiedDataLength(length);
    } else {
      const newArray = [...copiedUpiHandle];
      newArray[position] = 0;
      setCopiedUpiHandle(newArray);
      let length = copiedDataLength - 1;
      setCopiedDataLength(length);
    }
  };

  if (loading) {
    getAllUPIData();
    setIsLoading(false);
  }

  useEffect(() => {
    getAllUPIData();
  }, [checkedStateUpi, loading]);

  return (
    <>
      <div>
        {upiArray?.map((data, i) => {
          return (
            <div key={i + 1} className="cardDataBar">
              <div className="edit-del-btn">
                <input
                  type="checkbox"
                  checked={checkedStateUpi[i]}
                  onChange={() => handleOnChange(i, data)}
                  style={{ accentColor: "rgb(0, 51, 255)" }}
                />
                <p>{data.upiId}</p>
              </div>
              <div className="edit-del-btn">
                <FaEdit
                  style={{ color: "#14667e", cursor: "pointer" }}
                  onClick={() => {
                    setOpenModal(true);
                    setUpdateUpiId(data.upiId);
                    setSelectedID(data._id);
                  }}
                />
                <Delete
                  style={{ color: "#dc3545", cursor: "pointer" }}
                  onClick={() => {
                    deleteUpiId(data._id);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {openModal ? (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <div className="card-input-box">
              <div className="modal-close-icon">
                <Close
                  onClick={() => setOpenModal(false)}
                  style={{ color: "#14667e", cursor: "pointer" }}
                />
              </div>
              <div className="upi-box">
                <div className="update-upi-input-box">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    value={updateUpiId}
                    onChange={(e) => setUpdateUpiId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    updateUpiIdHandler(selectedId);
                    setOpenModal(false);
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default UPIData;
