"use client";

import React from "react";
import LoginForm from "./LoginForm";
import AuthLayout from "../../../components/layouts/auth/AuthLayout";

const LoginView: React.FC = () => {
  return (
    <AuthLayout
      navActionText="New here?"
      navActionButtonText="Sign Up"
      navActionHref="/register"
      navActionFilled={true}
      heroImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpwRd_jtT9TM6UDKFpQ89Nb19N-d6x5_Xfebe1_tyqLesEW1yvEnFtvp1PFZvlzLb2KmdrgwmfLp191ARt3gfoifc2Hd02Bfo8RomqMO4W7b8EtvKxcwFh48RAV7p-wNntGEaP-PtIQ9DHgLTnOJkZQ5XFCvrXFIPir8JSddTwY4MYzHc4XbKthuUZxYA8MNCCUzLEqk_us3oU-Rc3fNvrRCN47x2Xho5qVcgRil4RaU2byle_AJJMGgrEWim3kpQ9_SjoD4QOco"
      heroTitle={<>Join the <span className="text-[#ee2b8c]">Hype</span>.</>}
      heroDescription="The world's fastest-growing marketplace for event organizers and attendees. Experience the moment like never before."
      heroFooter={
        <>
          <div className="flex -space-x-2">
            <img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEbDAqotCQnv4kzAZdUzzHVIR_DO2lIZ9VkkMTEu0YptiBFH3WFA3WQVDxhbsJoRZw12Hg4i5nF9tK0hP4_B91YEfTb18vm8wtghuVMXDtLHMxK2niLYzr71hgP4Nek09kCDeew2COEPTTIcE_cj_ZTT4MbaWJnwVwcKNTV1Zd_1AnZSkZFGnrsYnkSBDgTIj4xnRazuM8jDlnNcBe6GQvHBpKmUFE1qrh4o6-eB28_Ed6iUVWrScswGTj0ueCBSp_oLaoi1s5KcI"/>
            <img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr8e7fl0-YxL9_WorLuxf55Y80UfIf1wVK86jty3rZ_Y59cdA7McSaaM_a7MoL-GvD4z4LkFLow1Pv7RjOxpHi_DRJ-tw72AwdF9-0CqZZ6u0JLz6mMniEkqFOKEruDVHyWmLy80dSBedDWAIDcfYUNTUM8qQRtWa_iKdlPGiMDPicl7A5CBiB4T9Zt8CVb3pphGk6bZwwsg7FjpB66A0WZAoWjqDkIdVvrHsifmJ3FZ2Om3REBjmKh1UxwWvHtyI5wmuwO1KIkfg"/>
            <img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXz2_AgPBJLj5UYudlqyOEJP1B3eGVEdaC1tA8wdhQzrHYlMaQP-10mPnR_mX6i2_njbAnb4s0oe4NnKAfBH7eRGaOiyLURI_CNIrBmT7OZO0VvMGwdmtjHm7ehu0Kzflg_vwX5crcm-jPyObpKtzx6tKivK4qt4NdIsMUzGB4ImZAR24hlAiuXZXKU9igHT5Ci9ZlTArlwE4RSAXkhB_rm9USNpCDA7X5oHKdVOsrzy9K4SileMK70bnKPecjb5OKssB8wpafYAQ"/>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white">
              +2k
            </div>
          </div>
          <p className="text-xs font-medium text-gray-300">Joined this week</p>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginView;
