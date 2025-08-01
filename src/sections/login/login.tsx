import type React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Grid, theme, Typography } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./login.css";
import { Link } from "react-router-dom";
import LoginWithEmail from "./loginWithEmail";
import { PageState } from "../../web-constants/constants";
import OtpForm from "../otp/otp";
import Register from "../register/register";
import { loginService } from "./service/loginService";
// import Logo from "../../assets/media/icons/Aurave f_logo_white.svg";
// import logo from "../../assets/media/icons/Aurave f_logo 3 green.svg";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text } = Typography;

interface FormData {
  mobileIsd: string;
  mobileNumber: string;
}

export const LoginSection: React.FC = () => {
  const [phoneError, setPhoneError] = useState<string>("");
  const [loginWithUrl, setLoginWithEmail] = useState<boolean>(false);
  const [loginPageState, setLoginPagestate] = useState<PageState>(
    PageState.IDLE
  );
  const [transation, setTransaction] = useState<string>();

  const [formData, setFormData] = useState<FormData>({
    mobileIsd: "",
    mobileNumber: "",
  });
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = async () => {
    console.log("formData.mobileNumber", formData.mobileNumber);
    if (
      formData.mobileIsd &&
      formData.mobileNumber &&
      formData.mobileNumber.length === 10 &&
      formData.mobileNumber !== "0000000000"
    ) {
      const mobileNumber = `${formData.mobileIsd}-${formData.mobileNumber}`;
      console.log(mobileNumber);

      // const response: any = await loginService(mobileNumber);
      // if (!response.errorPresent || true) {
      // }
      setTransaction("true");
      setLoginPagestate(PageState.OTP);

      // console.log(response);
    } else {
      setPhoneError("Please enter a valid mobile number.");
    }
  };

  console.log("loginPageState", loginPageState);

  useEffect(() => {
    setLoginWithEmail(false);
  }, []);

  console.log("Login MOBILE setFormData", formData);

  const styles = {
    container: {
      // margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      // width: "380px",
      // Padding: "40px",
      // Height: "100%",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "90vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  const handlePhoneChangePrimary = (value: string, country: any) => {
    setFormData({
      mobileIsd: `+${country.dialCode}`,
      mobileNumber: value.replace(country.dialCode, ""),
    });
    const mobile = value.replace(country.dialCode, "");
    console.log(" mobile ", mobile);
    if (mobile === "0000000000") {
      setPhoneError("Please enter a valid mobile number.");
    } else {
      setPhoneError("");
    }
  };

  // const clearFormData = () => {
  //   setFormData({
  //     mobileIsd: "",
  //     mobileNumber: "",
  //   });
  //   setPhoneError("");
  // };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && loginWithUrl === false) {
      e.preventDefault();
      onFinish();
    }
  };

  return (
    <>
      {loginPageState === PageState.IDLE && (
        <section className="login-section">
          <div className="card-container">
            <div className="card-image">
              <div className="logo-container"></div>
            </div>
            <div className="card-form">
              <div className="card-body">
                <div className="form-container">
                  <div className="form-title">
                    {/* <img className="logo" src={""} alt="logo" /> */}
                    <h4>RxHMS</h4>
                  </div>

                  {!loginWithUrl && (
                    <>
                      <div style={styles.header} className="">
                        <div className="d-flex mb-0 mb-md-1 flex-row justify-content-start align-content-center">
                          <span
                            className="text-start"
                            style={{
                              fontSize: "20px",
                              fontWeight: "600",
                            }}
                          >
                            <Link
                              style={{ color: "#334F3E", fontWeight: "400" }}
                              className="router-link"
                              to="/login"
                            >
                              Login
                            </Link>
                          </span>
                        </div>
                        <Text style={styles.text}>
                          Welcome to RxHMS! Please enter your details below to
                          log in.
                        </Text>
                      </div>
                      <Form
                        name="normal_login"
                        initialValues={{
                          remember: true,
                        }}
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark="optional"
                      >
                        <div>
                          <PhoneInput
                            enableSearch={true}
                            country={"in"}
                            value={`${formData.mobileIsd}${formData.mobileNumber}`}
                            onChange={handlePhoneChangePrimary}
                            placeholder="Enter your mobile number"
                            inputProps={{
                              style: { width: "100%" },
                              className: "form-control , custom-phone",
                              id: "mobile",
                              onKeyDown: handleKeyDown,
                              autoComplete: "off",
                            }}
                          />
                          <div className="mb-2">
                            <p
                              style={{
                                color: "#FF0000",
                                margin: 0,
                                minHeight: "21px",
                              }}
                            >
                              {phoneError}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 d-flex flex-row justify-content-between">
                          <button
                            className="m-0 p-0 border-0 e-mail-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              setLoginWithEmail(true);
                            }}
                            style={{
                              color: "#334F3E",
                              fontWeight: "400",
                              fontSize: "14px",
                            }}
                          >
                            Login with E-mail
                          </button>
                          <Link
                            className="router-link"
                            style={{ color: "red" }}
                            to="/forgot-password"
                          >
                            Forgot Password?
                          </Link>
                        </div>

                        <Form.Item style={{ marginBottom: "0px" }}>
                          <Button
                            className="w-100 mt-3"
                            htmlType="submit"
                            style={{
                              backgroundColor: "#334F3E",
                              color: "White",
                              fontWeight: "400",
                              fontSize: "18px",
                              lineHeight: "24px",
                              padding: "20px",
                            }}
                          >
                            Login
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  )}
                  {loginWithUrl && (
                    <LoginWithEmail setLoginWithEmail={setLoginWithEmail} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {loginPageState === PageState.OTP && (
        <OtpForm
          setLoginPagestate={setLoginPagestate}
          txnId={transation}
          mobileNumber={`${formData.mobileIsd}-${formData.mobileNumber}`}
          onFinish={onFinish}
        />
      )}
      {loginPageState === PageState.REGISTRATION && (
        <Register
          mobileNumber={`${formData.mobileIsd}-${formData.mobileNumber}`}
        />
      )}
    </>
  );
};
