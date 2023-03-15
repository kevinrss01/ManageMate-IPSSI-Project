import React from "react";
import {
  AiFillFacebook,
  AiOutlineGoogle,
  AiOutlineTwitter,
} from "react-icons/ai";
import Link from "next/link";
import { IoArrowBackSharp } from "react-icons/io5";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

export default function RegistrationPage() {
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email invalide")
      .required("Email requis")
      .matches(/[.]/, "Email invalide"),
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(100, "Le mot de passe doit contenir au maximum 100 caractères")
      .matches(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une majuscule et un caractère spécial"
      )
      .matches(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial et une majuscule"
      )
      .required("Mot de passe requis"),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    const { email, password } = data;
    if (!data || !email || !password) {
      throw new Error("No data or invalid data");
    }

    console.log(data);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <>
      <div id="registrationPageContainer">
        <Link href="/" className="backButton">
          <IoArrowBackSharp className="backButtonIcon" />
        </Link>
        <div className="contentContainer">
          <div className="infoContainer">
            <div className="infoChildContainer">
              <div className="titleContainer">
                <div></div>
                <h2>SE CONNECTER</h2>
                <div></div>
              </div>
              <div className="inputsContainer">
                <Formik
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  validationSchema={SignupSchema}
                >
                  {({ errors, touched, isValid }) => (
                    <Form
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      {errors.email && touched.email ? (
                        <div>{errors.email}</div>
                      ) : null}
                      <Field
                        type="text"
                        className="firstInput"
                        placeholder="Adresse mail"
                        style={{ marginBottom: "20px" }}
                        name="email"
                      />
                      {errors.password && touched.password ? (
                        <div>{errors.password}</div>
                      ) : null}
                      <Field
                        className="firstInput"
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                      />
                      <button className="nextButton" type="submit">
                        <span>Valider</span>
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="divider">
                <hr className="solid"></hr>
                <span>Ou avec</span>
                <hr className="solid"></hr>
              </div>
              <div className="containerLoginWith">
                <div className="loginWith">
                  <div className="containerLogo colorFb1">
                    <AiFillFacebook className="iconSocialMedia" />
                  </div>
                  <div className="containerText colorFb2">
                    Connexion avec Facebook
                  </div>
                </div>

                <div className="loginWith">
                  <div className="containerLogo colorTwitter1">
                    <AiOutlineTwitter className="iconSocialMedia" />
                  </div>
                  <div className="containerText colorTwitter2">
                    Connexion avec Twitter
                  </div>
                </div>

                <div className="loginWith">
                  <div className="containerLogo colorGoogle1">
                    <AiOutlineGoogle className="iconSocialMedia" />
                  </div>
                  <div className="containerText colorGoogle2">
                    Connexion avec Google
                  </div>
                </div>
              </div>
              <div className="loginContainer">
                <p>Pas de compte ?</p>
                <Link href="/auth/registrationPage">Créer un compte</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
