"use client";

import React from "react";
import RegisterForm from "./RegisterForm";
import AuthLayout from "../../../components/layouts/auth/AuthLayout";
import { StarIcon } from "@heroicons/react/24/solid";

const RegisterView: React.FC = () => {
  return (
    <AuthLayout
      navActionText="Already a member?"
      navActionButtonText="Log In"
      navActionHref="/login"
      heroImage="https://lh3.googleusercontent.com/aida-public/AB6AXuD1WMCZoHaSjngfsapkDhVHLgDTxMNqXxRRTUYcoJvyzaHyf1gLIIKM-DQCIwjlZzN5mxDCzT4AUx_zb-gP4hfAj4JTp8JzT5wPom0D0KSK2wvAvXdIbvfZvK1bxv_DtasgZTq26l03bjJpOvcLTm3-W5OHiXcCf1VwVVQzQo4sa6IzmQgw7f5mzBeDl3crEd42p99COQmTx5fkdNWtT9s7jxs-gf8ocM5UGeI15OE0GCGiv5MEDTATjQy4ypZJ7OsWWDItnoSDYQA"
      heroTitle={<>Level Up Your <span className="text-[#ee2b8c]">Nightlife</span></>}
      heroDescription="Invite friends, earn 10,000 points. They get 10% off their first ticket purchase."
      heroBadge={
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ee2b8c]/90 border border-[#ee2b8c]/50 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[#ee2b8c]/20">
          <StarIcon className="w-3 h-3 text-white" />
          <span>Rewards Program</span>
        </div>
      }
      heroFooter={
        <>
          <div className="flex -space-x-2">
            <img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAieRbDC6ZpJa9_QUxpKKLJQCWKs9X0cxi6be1u8HXFg9GcQIanTEQaIGl631IgsE-jnOAY0b5xRSEtQx5vh8MTEe4_iEOjCqUyp9PqoZEsXtJQzc8n5jQEBXEhA_qjpJncYdjassGmE3oWswDqzYuz9Ex3ZVQVoQ-Dx4MHxEa1t18ydLshGc4SUQCvXx36XraAu778htb1-2rQIAmNV1bhvf4vn6hV0ByveeL57n36kFv0NiA4MGugWIddgr7xyrrkvifyTH0wCCI"/>
            <img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSC_qi23849UgaBqsquDgdbtxVQxBYKND7DI_Z96-n8dzgd4mtKW7kHVa-G6J8a5YQfdlOaZ955OFDaYad5r4wM_kW8307jICKVE72ZtnhNVP0a0-d9BilegHv3z4YKRg2jvOzpjorv1XpG6uqZi-8AkNQvRjCRZb9Vr33U9qqHPlVNZfQL6Qmi27oKQYyr9oUF1hu-oq6lCX3C9xymV1xWCUNE9FpP9JV33thRSXAcWXHINBYliDOgzmOlbqFCQhH7v6xK2nXzVQ"/>
            <img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJnPkYGfBE5cP94vJ88oI0Z0uDmkb5vidVRnfhJtB4oUGVxbXQbPo7cxw4ebcegpwuZu7_Io5yTdVtdkwziG0zf8co13cWWQf-5OZch7HavJSxyfp_BTyL02lGn8TKHxwnLq9i-Xn6l_1BXTYZF8uqHyYjLtcPd704eZAV05qcKzAsPks5rEx7_LzssuT6WGVSkaIpQmBDEZmt-zCgXaeZwK2h3N-5F9nrnD3105xfIj7diU4RB6kNtRIGUjrTMljPW-Op5FKtITQ"/>
          </div>
          <p className="text-xs font-medium text-gray-300">Join 12k+ hype members</p>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterView;
