import React, {useState} from "react";
import { Link } from "@reach/router";
import { signInWithGoogle } from "../../firebase";
import GoogleSignIn from "../../assets/GoogleSignIn.png"
import './SignIn.css'

const SignIn = () => {

  return (
    <div className="mt-8">
      <h1 className="text-3xl mb-2 text-center font-bold">Sign In</h1>
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        <button>
          <img src = {GoogleSignIn}
          alt = "Sign in with Google"
          width="170" height="auto"
          onClick={() => {
            signInWithGoogle();
          }}
        />
        </button>
      </div>
    </div>
  );
};

export default SignIn;