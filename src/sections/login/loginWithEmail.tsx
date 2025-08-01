import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Grid, Input, theme } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./loginWithEmail.css";
import { PageState } from "../../web-constants/constants";
import { userLoginWithEmail } from "../otp/service/userLoginWithEmail";
import { LoginRequest } from "./model/loginRequest";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store/store";
import { CircularProgress } from "@mui/material";
import { storeLoginResponse } from "../../Redux/slices/jwtToken";

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface LoginWithEmailProps {
  setLoginWithEmail: (state: boolean) => void;
}

interface LoginEmailFormData {
  email: string;
  password: string;
}

const LoginWithEmail: React.FC<LoginWithEmailProps> = ({
  setLoginWithEmail,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();

  const [pageState, setPageState] = useState(PageState.IDLE);
  const [loginEmailFormData, setLoginEmailFormData] =
    useState<LoginEmailFormData>({
      email: "",
      password: "",
    });

  const [form] = Form.useForm();

  useEffect(() => {
    if (pageState === PageState.ERROR) {
      form.setFields([
        { name: "password", errors: ["Email or password is incorrect."] },
      ]);
    }
  }, [pageState]);

  // const onFinish = (values: LoginEmailFormData) => {
  //   console.log("Received values of form: ", values);
  //   setLoginEmailFormData(values);
  // };

  console.log("loginEmailFormData", loginEmailFormData);

  const handleEmailLogin = async (values: LoginEmailFormData) => {
    console.log("loginEmailFormData", loginEmailFormData);
    setPageState(PageState.LOADING);
    let response: any = null;

    try {
      const loginRequest: LoginRequest = {
        username: null,
        password: loginEmailFormData.password,
        emailId: loginEmailFormData.email.toLocaleLowerCase(),
        mobileNumber: null,
        txnId: null,
        otp: null,
      };

      console.log(loginRequest);

      response = await userLoginWithEmail(loginRequest);
      console.log("@@@@login witheswarl ,", response);

      if (!response.errorPresent) {
        console.log("@@@@login with email ,", response.content);
        dispatch(storeLoginResponse(response.content));
        navigate("/");
        setPageState(PageState.SUCCESS);
      } else {
        setPageState(PageState.ERROR);
      }
    } catch (error: any) {
      console.log(error, "in the component");
      console.log(response, "###in the response");
      setPageState(PageState.ERROR);
    }
  };

  console.log(pageState);

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
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
      marginBottom: token.marginMD,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "auto" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    // <div style={styles.container} className="">
    <div>
      <div style={styles.header}>
        <div className=" w-100 d-flex mb-1 flex-row justify-content-start align-content-center">
          <span className="text-start">
            <Link className="router-link" to="/login">
              Log in
            </Link>
          </span>
        </div>
      </div>

      <Form
        form={form}
        name="normal_login"
        // initialValues={{
        //   remember: true,
        // }}
        onFinish={handleEmailLogin}
        layout="vertical"
        requiredMark="optional"
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message:
                pageState === PageState.ERROR
                  ? "Login failed. Please check your email."
                  : "Please enter your email!",
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
            onPressEnter={() => form.submit()}
            onChange={(e) =>
              setLoginEmailFormData({
                ...loginEmailFormData,
                email: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please Enter your Password!",
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
            placeholder="Password"
            minLength={8}
            onPressEnter={() => form.submit()}
            onChange={(e) =>
              setLoginEmailFormData({
                ...loginEmailFormData,
                password: e.target.value,
              })
            }
          />
        </Form.Item>

        <div className="mt-2 d-flex flex-row justify-content-between">
          <button
            type="button"
            className="m-0 p-0 border-0 e-mail-btn"
            onClick={() => {
              setLoginWithEmail(false);
            }}
            style={{
              color: "#334F3E",
              fontWeight: "400",
              fontSize: "14px",
            }}
          >
            Login with Mobile
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
            {pageState === PageState.LOADING ? (
              <CircularProgress size={30} sx={{ color: "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Form.Item>
      </Form>
    </div>
    // </div>
  );
};

export default LoginWithEmail;
