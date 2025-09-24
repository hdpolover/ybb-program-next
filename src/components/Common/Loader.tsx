import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loader = (props: any) => {
  return (
    <React.Fragment>
      {!props.error && (
        <div className="d-flex justify-content-center align-items-center mx-2 mt-2">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {props.error && toast.error(props.error, {
        position: "top-right",
        hideProgressBar: false,
        progress: undefined,
        toastId: "",
      })}
    </React.Fragment>
  );
};

export default Loader;
