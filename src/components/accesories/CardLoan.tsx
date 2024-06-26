import { ScalarEmployee, ScalarLoanApplication } from "@/types/User";
import React, { useEffect, useState } from "react";
import styles from "./styles/cardLoan.module.css";
import {
  TbArrowBarToDown,
  TbArrowNarrowRight,
  TbArrowUpRight,
  TbChecklist,
  TbFileFilled,
  TbMailFilled,
  TbPhoneFilled,
  TbViewportWide,
} from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";
import Avatar from "react-avatar";

function CardLoan({ loan }: { loan: ScalarLoanApplication }) {
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useGlobalContext();
  const [infoEmployee, setInfoEmployee] = useState<ScalarEmployee | null>(null);

  const formattedPrice = (price: string) => {
    const number = parseFloat(price);

    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);
    return formattedNumber;
  };

  if (loan.employeeId !== "Standby") {
    useEffect(() => {
      const getEmployee = async () => {
        const response = await axios.post(
          "/api/employee/id",
          {
            employeeId: loan.employeeId,
          },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        console.log(response.data);
        if (response.data.success) setInfoEmployee(response.data.data);
      };

      getEmployee();
    }, [user?.token, loan.employeeId]);
  }

  return (
    <>
      <div className={styles.cardLoan}>
        <h1 className={styles.titleCardLoan}>
          <div className={styles.prevInfo}>
            <h5 className={styles.titleId}>Solicitud</h5>
            <h5 className={styles.textId}>{loan.id}</h5>
            {/* <h4>Prestamo</h4> */}
          </div>
        </h1>
        <div className={styles.requirements}>
          <div className={styles.boxAmount}>
            <p>Cantidad Solicitada</p>
            <h1>{formattedPrice(loan.cantity)}</h1>
          </div>
        </div>

        <div className={styles.boxBtnsDesicion}>
          <div className={styles.centerBoxBtnsDesicion}>
            <div className={styles.boxStatusLoan}>
              <h5>Estado de prestamo</h5>
              {loan.status === "Pendiente" && (
                <h1 className={styles.statusTextPendiente}>{loan.status}</h1>
              )}
              {loan.status === "Aprobado" && (
                <h1 className={styles.statusTextSuccess}>{loan.status}</h1>
              )}
              {loan.status === "Rechazado" && (
                <h1 className={styles.statusTextReject}>{loan.status}</h1>
              )}
            </div>
            {loan.status === "Aprobado" && (
              <div className={styles.employeeInfo}>
                <div className={styles.boxAvatar}>
                  <Avatar src={infoEmployee?.avatar} round={true} size={"30"} />
                </div>
                <div className={styles.boxInfoAdvisor}>
                  <div className={styles.boxInfoAdvisorCenter}>
                    <h5>Asesor encargado</h5>
                    <p>{`${infoEmployee?.name} ${infoEmployee?.lastNames}`}</p>
                  </div>
                </div>
                <div className={styles.boxContactAses}>
                  <div className={styles.boxAvatar}>
                    <TbPhoneFilled
                      className={styles.asesContactIcon}
                      size={20}
                    />
                  </div>
                  <div className={styles.boxAvatar}>
                    <TbMailFilled
                      size={20}
                      className={styles.asesContactIcon}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={styles.widgetsViews}
          onClick={() => router.push(`/req/${loan.id}`)}
        >
          <div className={styles.subTextBarView}>
            <div className={styles.centerList}>
              <div className={styles.iconCheckList}>
                <TbChecklist className={styles.iconListCheck} size={30} />
              </div>
              <p>Datos completos</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardLoan;
