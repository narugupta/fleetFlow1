'use client';

import React from 'react';
import './Navbar.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import Image from 'next/image';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div>
      <div className="navbar flex justify-between items-center p-4 shadow bg-white">
        {/* <div className="logo"><img src="distribution.png" alt="" /></div> */}
        <Link href={"/"}><div className="page-name text-xl font-bold">
          <img src="/distribution.png" alt="" />fleetFlow</div></Link>

        <div className="options flex gap-4">
          {/* About Us */}
          <Link href="/aboutUs">
            <div
              className={`links text-lg px-4 py-2 rounded-full border transition-all duration-200 ${
                pathname === '/aboutUs'
                  ? 'border-red-500 text-red-500'
                  : 'border-black text-black hover:bg-gray-100'
              }`}
            >
              About Us
            </div>
          </Link>

          {/* Run Optimisation */}
          <Link href="/input">
            <div
              className={`links text-lg px-[8px] py-2 rounded-full border transition-all duration-200 ${
                pathname === '/input' || pathname === '/optimisation'
                  ? 'border-red-500 text-red-500'
                  : 'border-black text-black hover:bg-gray-100'
              }`}
            >
              Run Optimisation
            </div>
          </Link>

          {/* Our Team */}
          <Link href="/ourTeam">
            <div
              className={`links text-lg px-4 py-2 rounded-full border transition-all duration-200 ${
                pathname === '/ourTeam'
                  ? 'border-red-500 text-red-500'
                  : 'border-black text-black hover:bg-gray-100'
              }`}
            >
              Our Team
            </div>
          </Link>
        </div>

        <div className="signIn cursor-pointer hover:underline">Sign In</div>
      </div>
    </div>
  );
};

export default Navbar;
