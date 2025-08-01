import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Input,
  Radio,
  Row,
  Col,
  theme,
  message,
  DatePicker,
} from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { GenderType } from "./model/genderType";
import { customerRegistrationService } from "./service/customerRegistrationService";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoginResponse } from "../login/model/loginResponse";
import logo from "../../assets/media/icons/Aurave f_logo 3 green.svg";
import { getLocalText, PageState } from "../../web-constants/constants";
import { RootState } from "../../Redux/store/store";
import { storeLoginResponse } from "../../Redux/slices/jwtToken";
import { CustomerRegistration } from "./model/customerRegistration";

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface RegisterFormData extends CustomerRegistration {
  confirmPassword?: string;
}

interface RegisterFormProps {
  mobileNumber?: string;
}

const Register: React.FC<RegisterFormProps> = ({ mobileNumber }) => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [pageState, setPageState] = useState<PageState>(PageState.IDLE);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginResponse = useSelector(
    (store: RootState) => store.jwtToken.username
  );

  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    gender: GenderType.MALE,
    dob: "",
    emailId: "",
    mobileNumber: mobileNumber,
    password: "",
    confirmPassword: "",
    username: loginResponse,
  });

  useEffect(() => {
    setRegisterFormData((prev) => ({
      ...prev,
      mobileNumber: mobileNumber,
    }));
  }, [mobileNumber]);

  useEffect(() => {
    if (
      registerFormData.firstName &&
      registerFormData.lastName &&
      registerFormData.emailId &&
      registerFormData.password &&
      registerFormData.gender
    ) {
      console.log("Saving registration data:", registerFormData);
    }
  }, [registerFormData]);

  const onFinish = async (values: any) => {
    navigate("/");
    // if (values.password !== values.confirmPassword) {
    //   message.error("Passwords do not match!");
    //   return;
    // }

    // Create a copy without confirmPassword for the API call
    // const registrationData: CustomerRegistration = {
    //   firstName: registerFormData.firstName,
    //   lastName: registerFormData.lastName,
    //   gender: registerFormData.gender,
    //   dob: registerFormData.dob,
    //   emailId: registerFormData.emailId?.toLocaleLowerCase(),
    //   password: registerFormData.password,
    //   mobileNumber: registerFormData.mobileNumber,
    //   username: registerFormData.username,
    // };

    // try {
    //   console.log("registrationData", registrationData);
    //   const response: any = await customerRegistrationService(registrationData);

    //   if (!response.errorPresent) {
    //     console.log("response.content==>>", response.content);
    //     const loginResponseData: LoginResponse = JSON.parse(
    //       window.localStorage.getItem("loginResponse") || "{}"
    //     );

    //     dispatch(
    //       storeLoginResponse({ ...loginResponseData, isCustomerExist: true })
    //     );
    //     message.success("Registration successful");
    //     const path = getLocalText("path");
    //     if (path) {
    //       navigate(`${path}`);
    //     } else {
    //       navigate("/");
    //     }
    //   } else {
    //     const errorMessage =
    //       response.message ||
    //       (response.apiError && response.apiError.message) ||
    //       "Registration failed";
    //     message.error(errorMessage);

    //     if (
    //       errorMessage.toLowerCase().includes("email") ||
    //       errorMessage.toLowerCase().includes("integrity")
    //     ) {
    //       form.setFields([
    //         {
    //           name: "emailId",
    //           errors: [errorMessage],
    //         },
    //       ]);
    //     }
    //   }
    // } catch (error: any) {
    //   console.error("Registration error:", error);

    //   let errorMessage = "Registration failed. Please try again.";

    //   if (error.response && error.response.data) {
    //     const responseData = error.response.data;

    //     if (responseData.apiError && responseData.apiError.message) {
    //       errorMessage = responseData.apiError.message;
    //       console.log("Using apiError.message:", errorMessage);
    //     } else if (responseData.message) {
    //       errorMessage = responseData.message;
    //       console.log("Using response.message:", errorMessage);
    //     }

    //     message.error(errorMessage);

    //     if (
    //       errorMessage.toLowerCase().includes("email") ||
    //       errorMessage.toLowerCase().includes("integrity")
    //     ) {
    //       form.setFields([
    //         {
    //           name: "emailId",
    //           errors: [errorMessage],
    //         },
    //       ]);
    //     }
    //   } else {
    //     // Generic error handling
    //     message.error(errorMessage);
    //   }
    // }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: any) => {
    setRegisterFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXS}px ${token.padding}px`,
      width: "480px",
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
  };

  const validateDOB = (_: any, value: any) => {
    if (value && value.toDate() > new Date()) {
      return Promise.reject(new Error("Date of birth cannot be in the future"));
    }
    return Promise.resolve();
  };

  const disabledDate = (current: any) => {
    return current && current.toDate() > new Date();
  };

  return (
    <section className="login-section">
      <div className="card-container">
        <div className=" d-none d-md-block card-image">
          <div className="logo-container"></div>
        </div>
        <div className="card-form">
          <div className="card-body">
            <div style={{ padding: "5%" }} className="">
              <div className="form-title ps-4">
                {/* <img
                  className="logo"
                  src={logo || "/placeholder.svg"}
                  alt="logo"
                /> */}
              </div>
              <div className="h-100 d-flex flex-row justify-content-center align-items-center">
                <div style={styles.container} className="">
                  {pageState === PageState.IDLE && (
                    <Form
                      form={form}
                      name="register_form"
                      initialValues={{
                        gender: GenderType.MALE,
                        ...registerFormData,
                      }}
                      onFinish={onFinish}
                      layout="vertical"
                      requiredMark="optional"
                      autoCapitalize="off"
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            name="firstName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your first name!",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value) {
                                    return Promise.resolve();
                                  }

                                  const regex = /^[A-Za-z\s]+$/;
                                  const hasInvalidChars = /[<>]/.test(value);

                                  if (!regex.test(value) || hasInvalidChars) {
                                    return Promise.reject(
                                      "First name should contain only letters and spaces"
                                    );
                                  }

                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input
                              style={{
                                color: "#334F3E",
                                borderColor: "#334F3E",
                                border: "1.5px solid #334F3E",
                              }}
                              prefix={<UserOutlined />}
                              maxLength={50}
                              minLength={3}
                              placeholder="First Name"
                              value={registerFormData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            name="lastName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter your last name!",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value) {
                                    return Promise.resolve();
                                  }

                                  const regex = /^[A-Za-z\s]+$/;
                                  const hasInvalidChars = /[<>]/.test(value);

                                  if (!regex.test(value) || hasInvalidChars) {
                                    return Promise.reject(
                                      "Last name should contain only letters and spaces"
                                    );
                                  }

                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input
                              style={{
                                color: "#334F3E",
                                borderColor: "#334F3E",
                                border: "1.5px solid #334F3E",
                              }}
                              prefix={<UserOutlined />}
                              maxLength={50}
                              minLength={3}
                              placeholder="Last Name"
                              value={registerFormData.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                          {
                            required: true,
                            message: "Please select your gender!",
                          },
                        ]}
                      >
                        <Radio.Group
                          className="custom-gender-group"
                          value={registerFormData.gender}
                          onChange={(e) =>
                            handleInputChange("gender", e.target.value)
                          }
                        >
                          <Radio
                            style={{
                              color: "#334F3E",
                            }}
                            value={GenderType.MALE}
                          >
                            Male
                          </Radio>
                          <Radio
                            style={{
                              color: "#334F3E",
                            }}
                            value={GenderType.FEMALE}
                          >
                            Female
                          </Radio>
                          <Radio
                            style={{
                              color: "#334F3E",
                            }}
                            value={GenderType.OTHER}
                          >
                            Other
                          </Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        name="dob"
                        rules={[
                          {
                            required: true,
                            message: "Please select your date of birth!",
                          },
                          { validator: validateDOB },
                        ]}
                      >
                        <DatePicker
                          style={{
                            width: "100%",
                            color: "#334F3E",
                            borderColor: "#334F3E",
                            border: "1.5px solid #334F3E",
                          }}
                          format="YYYY-MM-DD"
                          placeholder="Select DOB"
                          disabledDate={disabledDate}
                          onChange={(_, dateString) =>
                            handleInputChange("dob", dateString)
                          }
                          value={
                            registerFormData.dob
                              ? new Date(registerFormData.dob)
                                  .toISOString()
                                  .slice(0, 10)
                              : null
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name="emailId"
                        rules={[
                          {
                            type: "email",
                            required: true,
                            message: "Please enter a valid email!",
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
                          value={registerFormData.emailId}
                          onChange={(e) =>
                            handleInputChange("emailId", e.target.value)
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your password!",
                          },
                          {
                            min: 8,
                            message: "Password must be at least 8 characters!",
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
                          placeholder="Password"
                          value={registerFormData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Passwords do not match")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          style={{
                            color: "#334F3E",
                            borderColor: "#334F3E",
                            border: "1.5px solid #334F3E",
                          }}
                          prefix={<LockOutlined />}
                          placeholder="Confirm Password"
                          value={registerFormData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                        />
                      </Form.Item>

                      <Form.Item style={{ marginBottom: "0px" }}>
                        <Button
                          style={{
                            backgroundColor: "#334F3E",
                            color: "#fff",
                          }}
                          htmlType="submit"
                          className="w-100"
                        >
                          Register
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
