"use client";

import React from "react";
import styles from "./nav.module.css";
import Image from "next/image";
import logoNav from "@/assets/creditoya_logo_minimalist.png";

import { TbLogout, TbUserCircle } from "react-icons/tb";
import { useGlobalContext } from "@/context/Auth";
import Avatar from "react-avatar";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import SideBar from "./SideBar";

function NavBar() {
  const { user, handleLogout } = useGlobalContext();
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 800px)" });

  return (
    <>
      <nav className={styles.containerNav}>
        <div className={styles.NavBoxLogo}>
          <Image
            className={styles.logoNav}
            src={logoNav}
            alt="logoNav"
            priority={true}
            onClick={() => router.push("/")}
          />
        </div>
        {isTabletOrMobile ? (
          <SideBar />
        ) : (
          <>
            <div className={styles.optsBox}>
              <div className={styles.centerOptsBox}>
                {user && (
                  <p
                    className={styles.btnOpt}
                    onClick={() => router.push("/dashboard")}
                  >
                    Solicitar prestamo
                  </p>
                )}
                <div
                  className={styles.btnOptLogin}
                  onClick={
                    user
                      ? () => router.push(`/profile/${user?.id}`)
                      : () => router.push(`/auth`)
                  }
                >
                  <div className={styles.centerIconBtn}>
                    {user ? (
                      <Avatar
                        src={user.avatar}
                        className={styles.avatar}
                        round={true}
                        size="25"
                      />
                    ) : (
                      <TbUserCircle className={styles.iconBtn} size={25} />
                    )}
                  </div>
                  {user ? <p>{user.names?.split(" ")[0]}</p> : <p>Cuenta</p>}
                </div>
                {user && (
                  <div className={styles.boxLogout} onClick={handleLogout}>
                    <div className={styles.boxIconLogout}>
                      <TbLogout size={20} />
                    </div>
                    <p>Cerrar Session</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}

export default NavBar;
