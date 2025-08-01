import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Input, theme, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import { PageState } from "../../web-constants/constants";
import OtpForm from "../otp/otp";
import { LockOutlined } from "@mui/icons-material";
import { forgotService } from "./service/forgetPasswords";
import { usePostByParams } from "../../customHooks/usePostByParams";
import { create_reset_password } from "./service/serviceUris";
import { CircularProgress } from "@mui/material";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text } = Typography;

interface ResetFormData {
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [forgetPageState, setForgetPageState] = useState<any>(PageState.IDLE);
  const [resetEmailFormData, setResetEmailFormData] = useState<string>("");
  const [resetFormData, setResetFormData] = useState<ResetFormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const [txnId, setTxnId] = useState<string | null>(null);

  const { data, loading, error, executePost } = usePostByParams();

  console.log("data", data);
  console.log("error", error);
  console.log("error");

  console.log("resetFormData EEEEE", resetFormData);
  console.log("resetEmailFormData", resetEmailFormData);

  const onFinishEmail = (values: { email: string }) => {
    console.log("Received email of form: ", values);
    setResetEmailFormData(values.email);
  };

  const onFinishReset = async () => {
    navigate("/login");
    // if (resetFormData.newPassword !== resetFormData.confirmPassword) {
    //   console.error("Passwords do not match!");
    //   return;
    // }
    // console.log("eswer resetEmailFormData: ", resetEmailFormData);
    // console.log("eswer resetFormData: ", resetFormData.confirmPassword);

    // await executePost(create_reset_password, {
    //   userKey: resetEmailFormData,
    //   password: resetFormData.confirmPassword,
    // });
  };
  useEffect(() => {
    if (data) {
      navigate("/login");
    }
  }, [data, navigate]);

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeSM}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: "#334F3E",
    },
  };

  const handleOtp = async () => {
    // try {
    //   const response: any = await forgotService(resetEmailFormData);
    //   console.log("response", response);
    //   if (response) {
    //     setTxnId(response.content);
    setForgetPageState(PageState.OTP);
    //   } else {
    //     setForgetPageState(PageState.ERROR);
    //   }
    // } catch (err) {
    //   setForgetPageState(PageState.ERROR);
    //   console.error(err);
    // }
  };

  return (
    <>
      {forgetPageState !== PageState.OTP && (
        <section className="login-section">
          <div className="card-container">
            <div className="card-image">
              <div className="logo-container"></div>
            </div>
            <div className="card-form">
              <div className="card-body">
                <div style={{ padding: "5%" }}>
                  <div className="form-title ps-0 ps-md-4">
                    {/* <img
                      className="logo"
                      src={ "/placeholder.svg"}
                      alt="logo"
                    /> */}
                    <h2 className="mt-2 logo">RxHMS</h2>
                  </div>
                  <div className="h-100 d-flex flex-row justify-content-center align-items-center">
                    {/* // car */}

                    {(forgetPageState === PageState.IDLE ||
                      forgetPageState === PageState.ERROR) && (
                      <div style={styles.container}>
                        <div style={styles.header}>
                          <div className="d-flex mb-0 mb-md-1 flex-row justify-content-start align-content-center">
                            <span className="text-start">Forgot Password</span>
                          </div>
                        </div>
                        <span
                          style={{ color: "#334F3E" }}
                          className="text-start"
                        >
                          Email ID
                        </span>
                        <Form
                          className="mt-1"
                          name="normal_login"
                          autoComplete="off"
                          initialValues={{
                            remember: true,
                          }}
                          onFinish={onFinishEmail}
                          layout="vertical"
                          requiredMark="optional"
                        >
                          <Form.Item
                            name="email"
                            rules={[
                              {
                                type: "email",
                                required: true,
                                message: "Please Enter your Email!",
                              },
                            ]}
                          >
                            <Input
                              style={{
                                color: "#334F3E",
                                borderColor: "#334F3E",
                                border: "1.5px solid #334F3E",
                              }}
                              prefix={<MailOutlined />}
                              placeholder="Email"
                              onChange={(e) =>
                                setResetEmailFormData(e.target.value)
                              }
                            />
                          </Form.Item>
                          <div>
                            {forgetPageState === PageState.ERROR && (
                              <p
                                style={{
                                  color: "red",
                                  marginTop: "0px",
                                  paddingTop: "0px",
                                }}
                              >
                                This email is not registered. Please sign up
                                first.
                              </p>
                            )}
                          </div>

                          <Form.Item style={{ marginBottom: "0px" }}>
                            <Button
                              onClick={handleOtp}
                              style={{
                                backgroundColor: "#334F3E",
                                color: "#fff",
                                padding: "20px 0px",
                              }}
                              htmlType="submit"
                              className="w-100 mb-2"
                            >
                              Get OTP
                            </Button>

                            <div>
                              <Text style={styles.text}>have an account?</Text>{" "}
                              <Link style={styles.text} to="/login">
                                Log in{" "}
                              </Link>
                            </div>
                          </Form.Item>
                        </Form>
                      </div>
                    )}

                    {forgetPageState === PageState.SUCCESS && (
                      <div
                        style={styles.container}
                        // className="card e-mail-card-bg"
                      >
                        <div style={styles.header}>
                          <div className="d-flex mb-1 flex-row justify-content-start align-content-center">
                            <span className="text-start">Reset Password</span>
                          </div>
                        </div>
                        <Form
                          name="reset_password"
                          initialValues={{
                            remember: true,
                          }}
                          onFinish={onFinishReset}
                          layout="vertical"
                          requiredMark="optional"
                        >
                          <Form.Item
                            name="newPassword"
                            rules={[
                              {
                                required: true,
                                message: "Set New Password!",
                              },
                            ]}
                          >
                            <Input.Password
                              style={{
                                color: "#334F3E",
                                borderColor: "#334F3E",
                                border: "1.5px solid #334F3E",
                              }}
                              prefix={<LockOutlined />}
                              type="password"
                              placeholder="Enter new Password"
                              onChange={(e) =>
                                setResetFormData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name="confirmPassword"
                            rules={[
                              {
                                required: true,
                                message: "Confirm new Password!",
                              },
                              {
                                validator: (_, value) =>
                                  value && value !== resetFormData.newPassword
                                    ? Promise.reject(
                                        new Error("Passwords do not match!")
                                      )
                                    : Promise.resolve(),
                              },
                            ]}
                          >
                            <Input.Password
                              style={{
                                color: "#334F3E",
                                borderColor: "#334F3E",
                                border: "1.5px solid #334F3E",
                              }}
                              prefix={<LockOutlined />}
                              type="password"
                              placeholder="Confirm new Password"
                              onChange={(e) =>
                                setResetFormData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                            />
                          </Form.Item>

                          <Button
                            style={{
                              backgroundColor: "#334F3E",
                              color: "#fff",
                            }}
                            htmlType="submit"
                            className="w-100"
                          >
                            {loading ? (
                              <CircularProgress />
                            ) : (
                              <span> Reset Password</span>
                            )}
                          </Button>
                        </Form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {forgetPageState === PageState.OTP && (
        <OtpForm
          // uri="/login"
          setForgetPageState={setForgetPageState}
          txnId={txnId ?? undefined}
          handleOtp={handleOtp}
        />
      )}
    </>
  );
};

export default ForgotPassword;
