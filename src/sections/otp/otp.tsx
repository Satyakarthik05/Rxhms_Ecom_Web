import type React from "react";
import { useState, useEffect } from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import OTPInput from "react-otp-input";
import "./otp.css";
import { useNavigate } from "react-router-dom";
import { getLocalText, PageState } from "../../web-constants/constants";
import { userLoginMobile } from "./service/userLoginMobile";
import type { LoginRequest } from "../login/model/loginRequest";
import { useDispatch } from "react-redux";
import { storeLoginStatus } from "../../Redux/slices/authenticationSlice";
import { storeLoginResponse } from "../../Redux/slices/jwtToken";
import { validateOtpService } from "./service/validateOtpService";

interface OtpFormProps {
  uri?: string;
  txnId?: string;
  mobileNumber?: string;
  setForgetPageState?: (pageState: any) => void;
  setLoginPagestate?: (pageState: any) => void;
  onFinish?: () => void;
  handleOtp?: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({
  txnId,
  uri,
  mobileNumber,
  setForgetPageState,
  setLoginPagestate,
  onFinish,
  handleOtp,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [otpPageState, setPageState] = useState<string>("idle");
  const [timer, setTimer] = useState<number>(60);
  const [error, setError] = useState<string>("");
  const [resendclickedCount, setResendClickedCount] = useState<number>(0);
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    username: null,
    password: null,
    mobileNumber: null,
    txnId: null,
    otp: null,
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleBackDrop = () => {
    clearForm();
  };

  const handleResend = () => {
    setOtp("");
    if (onFinish) {
      onFinish();
    }
    if (handleOtp) {
      handleOtp();
    }
    setTimer(60);
    setError("");
    setResendClickedCount((prev) => prev + 1);
    setPageState(PageState.IDLE);
  };

  const handleEditMobile = () => {
    if (setLoginPagestate) {
      setLoginPagestate(PageState.IDLE);
    } else if (setForgetPageState) {
      setForgetPageState(PageState.IDLE);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          if (isMounted) {
            setPageState("idle");
            setError("Click 'Resend' for a new one.");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (mobileNumber && txnId) {
      setLoginRequest({
        username: null,
        password: null,
        mobileNumber: mobileNumber,
        txnId: txnId,
        otp: otp,
      });
    }
    return () => {
      isMounted = false;
      clearInterval(timerId);
    };
  }, [otp, mobileNumber, txnId]);

  console.log("otp", otp);
  console.log("txnId", txnId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && otp.length === 4) {
        handleOtpSubmission();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [otp, loginRequest]);

  const clearForm = () => {
    setOtp("");
    setError("");
  };

  const handleOtpSubmission = async () => {
    try {
      console.log("loginRequest", loginRequest);
      if (otp.length === 4) {
        // Update the loginRequest with the current OTP
        const updatedLoginRequest = {
          ...loginRequest,
          otp: otp,
        };

        if (setLoginPagestate) {
          // const response: any = await userLoginMobile(updatedLoginRequest);
          // if (response && !response.errorPresent) {
          //   console.log("@@@@@@@loginResponse", response.content);
          //   if (response.content && response.content.isCustomerExist) {
          //     dispatch(storeLoginResponse(response.content));
          //     dispatch(storeLoginStatus(updatedLoginRequest));
          //     const path = getLocalText("path");
          //     if (path) {
          //       navigate(`${path}`, { replace: true });
          //     } else {
          //       navigate("/", { replace: true });
          //     }
          //   } else if (response.content) {
          //     dispatch(storeLoginResponse(response.content));
          setLoginPagestate(PageState.REGISTRATION);
          //   } else {
          //     setError("Invalid OTP. Please try again.");
          //   }
          //   console.log("success token", response);
          // } else {
          //   setError("Invalid OTP. Please try again.");
          // }
        } else if (setForgetPageState) {
          // if (txnId !== undefined) {
          //   const response = await validateOtpService(otp, txnId);
          //   console.log("response, ## validateOTP", response);
          //   if (response) {
          setForgetPageState(PageState.SUCCESS);
          //   } else {
          //     setError("Invalid OTP. Please try again.");
          //   }
          // }
        } else {
          setError("Invalid OTP. Please try again.");
        }
      } else {
        setError("Please enter a valid 4-digit OTP.");
      }
    } catch (error) {
      console.error("Error in OTP submission:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const otpStyle = "otpClass";

  return (
    <section className="login-section">
      <div className="card-container">
        <div className="card-image">
          <div className="logo-container"></div>
        </div>
        <div className="card-form">
          <div className="card-body">
            <div style={{ padding: "13%" }} className="">
              <div className="form-title">
                {/* <img className="logo" src={"/placeholder.svg"} alt="logo" />
                 */}
                <h2>RxHMS</h2>
              </div>
              <div className="h-100 d-flex flex-row justify-content-center align-items-center">
                <Card
                  sx={{
                    border: "0.1px solid #fff",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    textAlign: "center",
                    // border: "none",
                  }}
                >
                  <div className="mb-4 d-flex flex-row justify-content-end align-items-center"></div>

                  <>
                    <Typography
                      className="text-start"
                      variant="h5"
                      gutterBottom
                    >
                      Enter OTP
                    </Typography>
                    <div className="d-flex flex-row justify-content-start align-items-center">
                      <OTPInput
                        value={otp}
                        onChange={(value: any) => {
                          const sanitizedValue = value.replace(/[^0-9]/g, "");
                          setOtp(sanitizedValue);
                        }}
                        numInputs={4}
                        inputStyle={otpStyle}
                        shouldAutoFocus={true}
                        renderInput={(props: any, index: number) => (
                          <input
                            {...props}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            onChange={(e) => {
                              const { value } = e.target;
                              if (/^\d$/.test(value)) {
                                const nextInput = document.querySelector(
                                  `input[name="otp-${index + 1}"]`
                                ) as HTMLInputElement;
                                if (nextInput) nextInput.focus();
                              }
                              const sanitizedValue = otp.split("");
                              sanitizedValue[index] = value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              setOtp(sanitizedValue.join(""));
                            }}
                            name={`otp-${index}`}
                          />
                        )}
                      />
                    </div>
                    {error && (
                      <Typography
                        className="text-start"
                        color="error"
                        sx={{ mt: 2 }}
                      >
                        {error}
                      </Typography>
                    )}
                    {timer === 0 && (
                      <div className="d-flex flex-row justify-content-between mt-2">
                        <button
                          className="btn btn-link p-0"
                          style={{ textDecoration: "none", color: "#1E2624" }}
                          onClick={handleEditMobile}
                        >
                          Edit Number
                        </button>

                        <button
                          className="btn btn-link  p-0"
                          style={{ textDecoration: "none", color: "#1E2624" }}
                          onClick={handleResend}
                          disabled={resendclickedCount > 4}
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                    {timer > 0 && (
                      <Typography
                        className="text-start"
                        variant="body2"
                        sx={{ mt: 2 }}
                      >
                        Time remaining: {Math.floor(timer / 60)}:
                        {(timer % 60).toString().padStart(2, "0")}
                      </Typography>
                    )}

                    {/* {error === "Please request a new OTP." && (
                      <p
                        style={{
                          color: "#000",
                          cursor: "pointer",
                        }}
                        onClick={handleResend}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "red")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#005fae")
                        }
                      >
                        Resend
                      </p>
                    )} */}
                    {/* <Grid item xs={12} sx={{ mt: 2 }}> */}
                    <Box className="d-flex flex-row justify-content-start">
                      <Button
                        className="mt-3"
                        variant="contained"
                        color="primary"
                        onClick={handleOtpSubmission}
                        disabled={otp.length < 4}
                        sx={{
                          width: "100%",
                          minWidth: "100px",
                          backgroundColor:
                            otp.length < 4 ? "#cccccc" : "#334F3E",
                          color: "#fff",
                          alignSelf: "start",
                          textTransform: "none",
                        }}
                      >
                        Verify Otp
                      </Button>
                    </Box>
                    {/* </Grid> */}
                  </>
                  {/* )} */}
                  {/* {otpPageState === "Success" && (
                    <div className="text-center">
                      <Typography variant="body1" sx={{ color: "green" }}>
                        ..
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          width: "100%",
                          marginTop: "20px",
                          minWidth: "100px",
                          background:
                            "linear-gradient(to right, #ff7e5f, #feb47b)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #ff7e5f, #feb47b)",
                          },
                        }}
                        onClick={() => {
                          handleBackDrop();
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  )} */}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpForm;
