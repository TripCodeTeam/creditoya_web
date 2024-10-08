"use client";

import { useGlobalContext } from "@/context/Auth";
import {
  ScalarDocument,
  ScalarEmployee,
  ScalarLoanApplication,
  ScalarUser,
} from "@/types/User";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbArrowLeft } from "react-icons/tb";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import DateToPretty from "@/handlers/DateToPretty";
import { stringToPriceCOP } from "@/handlers/StringToCop";
import LoadingPage from "@/components/Loaders/LoadingPage";
import Modal from "@/components/modal/Modal";
import Document00 from "@/components/pdfs/pdfCard00";
import { Document01 } from "@/components/pdfs/pdfCard01";
import Document03 from "@/components/pdfs/pdfCard03";
import Document02 from "@/components/pdfs/pdfCard02";
import CopyText from "@/components/accesories/CopyText";
import { RefreshDataLoan } from "@/handlers/requests/RefreshLoanData";
import { toast } from "sonner";
import { BankTypes, handleKeyToStringBank } from "@/handlers/typeBankPretty";

function RequestInfo({ params }: { params: { loanId: string } }) {
  const { user } = useGlobalContext();

  const [infoLoan, setInfoLoan] = useState<ScalarLoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoEmployee, setInfoEmployee] = useState<ScalarEmployee | null>(null);
  const [documentsInfo, setDocumentsInfo] = useState<ScalarDocument | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<ScalarUser | null>(null);

  const [optionOpenDocs, setOptionOpenDocs] = useState<number | null>(null);
  const [openModelDocs, setOpenModelDocs] = useState<boolean>(false);
  const [linkSelect, setLinkSelect] = useState<string | null>(null);

  const [openDocsScan, setOpenDocsScan] = useState(false);
  const [linkDocsScan, setLinkDocsScan] = useState<string | null>(null);

  const [newFileUpload00, setNewFileUpload00] = useState<File | null>(null);
  const [newFileUpload01, setNewFileUpload01] = useState<File | null>(null);
  const [newFileUpload02, setNewFileUpload02] = useState<File | null>(null);
  const [newFileUpload03, setNewFileUpload03] = useState<File | null>(null);

  const [openModelAutoDoc, setOpenModelAutoDoc] = useState<boolean>(false);
  const router = useRouter();

  const handleOpenModel = (option: number, link: string) => {
    setOptionOpenDocs(option);
    setLinkSelect(link);
    setOpenModelDocs(true);
  };

  const handleAutoOpenModel = (option: number) => {
    setOptionOpenDocs(option);
    setOpenModelAutoDoc(true);
  };

  const handleOtherDocsDownloadFile = (option: number) => {
    console.log(option);

    if (option == 0) {
      Document00({
        numberDocument: documentsInfo?.number as string,
        entity: infoLoan?.entity as string,
        numberBank: infoLoan?.bankNumberAccount as string,
        signature: infoLoan?.signature,
        autoDownload: true,
      });
    }
  };

  const handleAceptChangeCantity = async (option: boolean) => {
    if (option == null) throw new Error("Option is required!");

    const desicion = await axios.post(
      "/api/loan/change_cantity",
      {
        loanId: infoLoan?.id,
        newCantityOpt: option,
      },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    console.log(desicion);

    if (desicion.data.success) {
      const updataLoan = await RefreshDataLoan(
        infoLoan?.id as string,
        user?.token as string
      );
      setInfoLoan(updataLoan);
      toast.success("Desicion tomada, gracias");
    }
  };

  const handleReUpload = async ({
    // upId,
    userId,
    name,
    loanId,
    newFile,
  }: {
    // upId: string;
    userId: string;
    name: string;
    loanId: string;
    newFile: File;
  }) => {
    try {
      // if (!upId) throw new Error("upId is required!");
      if (!userId) throw new Error("userId is required!");
      if (!loanId) throw new Error("loan is required!");
      if (!name) throw new Error("name is required!");

      const file = newFile;

      // console.log(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      // formData.append("upId", upId);
      formData.append("name", name);
      formData.append("loanId", loanId);

      const modifyLoad = await axios.post("/api/loan/change_docs", formData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      // console.log(modifyLoad);

      if (modifyLoad.data.success == true) {
        const dataFresh = await RefreshDataLoan(
          infoLoan?.id as string,
          user?.token as string
        );
        if (name == "labor_card") {
          setNewFileUpload00(null);
        } else if (name == "paid_flyer_01") {
          setNewFileUpload01(null);
        } else if (name == "paid_flyer_02") {
          setNewFileUpload02(null);
        } else if (name == "paid_flyer_03") {
          setNewFileUpload03(null);
        }
        setInfoLoan(dataFresh);
        toast.success("Documento enviado, gracias");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = event.target.files?.[0];
    // console.log(file, idx);
    if (file) {
      if (idx == 0) {
        console.log("este");
        setNewFileUpload00(file);
      } else if (idx == 1) {
        console.log("este");
        setNewFileUpload01(file);
      } else if (idx == 2) {
        console.log("este");
        setNewFileUpload02(file);
      } else if (idx == 3) {
        console.log("este");
        setNewFileUpload03(file);
      }
    }
  };

  useEffect(() => {
    // Check if the user is authenticated and authorized
    if (user === undefined || user === null) return;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // if (user.id !== params.loanId) {
    //   window.location.href = "/";
    //   return;
    // }

    const loanInfo = async () => {
      const loanId: string = params.loanId;

      const response = await axios
        .post(
          "/api/loan/id",
          {
            loanId,
          },
          { headers: { Authorization: `Bearer ${user?.token as string}` } }
        )
        .catch((error) => console.log(error));

      if (response?.data.success) {
        const loan: ScalarLoanApplication = response.data.data;
        setInfoLoan(loan);

        const responseDoc = await axios
          .post(
            "/api/user/doc_id",
            {
              userId: loan.userId,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          )
          .catch((error) => console.log(error));

        if (responseDoc && responseDoc.data.success == true) {
          setDocumentsInfo(responseDoc.data.data);
        }

        if (loan.employeeId !== "Standby") {
          const infoEmployee = await axios
            .post(
              "/api/employee/id",
              {
                employeeId: loan.employeeId,
              },
              { headers: { Authorization: `Bearer ${user?.token}` } }
            )
            .catch((error) => console.log(error));

          if (infoEmployee && infoEmployee.data.data == "Standby")
            setInfoEmployee(null);

          const employee: ScalarEmployee =
            infoEmployee && infoEmployee.data.data;
          // console.log(employee);
          setInfoEmployee(employee);

          if (response.data.success == true) {
            setInfoLoan(response.data.data);

            const responseClient = await axios.post(
              "/api/user/id",
              {
                userId: infoLoan?.userId,
              },
              { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            if (responseClient.data.success) {
              setUserInfo(responseClient.data.data);
            }
          }
        }

        setLoading(false);
      }
    };

    loanInfo();
  }, [params.loanId, user, user?.token, infoLoan?.userId, router]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <main className={styles.mainLoan}>
        <div className={styles.metadataloan}>
          <div className={styles.barBack}>
            <div
              className={styles.centerBarBack}
              onClick={() => (window.location.href = "/dashboard")}
            >
              <div className={styles.boxIcon}>
                <TbArrowLeft size={20} className={styles.iconArrow} />
              </div>
              <p className={styles.labelBtn}>Volver</p>
            </div>
          </div>

          <h1 className={styles.titleReq}>Solicitud de prestamo</h1>

          <div className={styles.cardInfoBank} style={{ marginTop: "1em" }}>
            <h5>Solicitud Id</h5>
            <CopyText text={infoLoan?.id as string} copy={true} />
          </div>

          <h3 className={styles.banckTitle}>Cantidad requerida</h3>
          <h1>{stringToPriceCOP(infoLoan?.cantity as string)}</h1>

          {infoLoan?.newCantity && (
            <>
              <h3 className={styles.banckTitle}>Cantidad aprobada</h3>
              <h1>{stringToPriceCOP(infoLoan?.newCantity as string)}</h1>
            </>
          )}

          {infoLoan &&
            infoLoan.status == "Aplazado" &&
            infoLoan.reasonReject && (
              <div className={styles.cardInfoBank} style={{ marginTop: "1em" }}>
                <h5>Razon del rechazo</h5>
                <p>{infoLoan?.reasonReject}</p>
              </div>
            )}

          {infoLoan?.reasonChangeCantity && (
            <>
              <div className={styles.cardInfoBank} style={{ marginTop: "1em" }}>
                <h5>Razon del cambio de cantidad solicitada</h5>
                <CopyText
                  text={infoLoan?.reasonChangeCantity as string}
                  copy={true}
                />
              </div>

              {infoLoan.newCantityOpt && (
                <>
                  <div
                    className={styles.cardInfoBank}
                    style={{ marginTop: "1em" }}
                  >
                    <h5>Acepta el cambio de cantidad solicitada?</h5>
                    <p>
                      {infoLoan.newCantityOpt == true ? "Aceptado" : "Aplazado"}
                    </p>
                  </div>
                </>
              )}

              {infoLoan.status == "Pendiente" &&
                infoLoan.newCantityOpt == null && (
                  <div
                    className={styles.cardInfoBank}
                    style={{ marginTop: "1em" }}
                  >
                    <h5>Acepta el cambio de cantidad solicitada?</h5>
                    <div className={styles.boxAceptCantity}>
                      <p
                        className={styles.btnAcceptCantity}
                        onClick={() => handleAceptChangeCantity(true)}
                      >
                        Aceptar
                      </p>
                      <p
                        className={styles.btnRejectCantity}
                        onClick={() => handleAceptChangeCantity(false)}
                      >
                        Rechazar
                      </p>
                    </div>
                  </div>
                )}
            </>
          )}

          <h3 className={styles.banckTitle}>Informacion financiera</h3>
          <div className={styles.boxCards}>
            <div className={styles.cardInfoBank}>
              <h5>Numero de cuenta</h5>
              <CopyText
                text={infoLoan?.bankNumberAccount as string}
                copy={true}
              />
            </div>

            <div className={styles.cardInfoBank}>
              <h5>Tipo de cuenta</h5>
              <p>{infoLoan?.bankSavingAccount && "Cuenta Ahorros"}</p>
            </div>

            <div className={styles.cardInfoBank}>
              <h5>Entidad bancaria</h5>
              <p>{handleKeyToStringBank(infoLoan?.entity as BankTypes)}</p>
            </div>
          </div>

          <h3 className={styles.banckTitle}>Informacion Solicitud</h3>
          <div className={styles.boxCards}>
            <div className={styles.cardInfoBank}>
              <h5>Estatus</h5>
              <p>{infoLoan?.status}</p>
            </div>

            <div className={styles.cardInfoBank}>
              <h5>Fecha de solicitud</h5>
              <p>{DateToPretty(String(infoLoan?.created_at), false)}</p>
            </div>

            {infoLoan?.status !== "Pendiente" && (
              <div className={styles.cardInfoBank}>
                <h5>Asesor encargado</h5>
                <div className={styles.boxEmployeeInfo}>
                  <div className={styles.centerEmpInfo}>
                    <Avatar
                      round={true}
                      size="20"
                      src={infoEmployee?.avatar as string}
                      alt={"avatar"}
                    />
                  </div>
                  <p>{`${infoEmployee?.name} ${infoEmployee?.lastNames}`}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.containerPayments}>
          <div>
            <div className={styles.titleSection}>
              <h3>Carta Laboral</h3>
            </div>
            <div className={styles.boxLaborCard}>
              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      size={20}
                      className={styles.iconDocument}
                    />
                  </div>
                  <p className={styles.textHeader}>
                    {infoLoan?.labor_card !== "No definido" &&
                    infoLoan?.upid_labor_card !== "No definido"
                      ? "Carta laboral actualizada"
                      : "Carta laboral rechazada, vuelve a subir"}
                  </p>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.barBtns}>
                    {infoLoan?.labor_card !== "No definido" &&
                      infoLoan?.upid_labor_card !== "No definido" && (
                        <>
                          <button
                            onClick={() =>
                              handleOpenModel(0, infoLoan?.labor_card as string)
                            }
                          >
                            Ver
                          </button>

                          <button
                            onClick={() =>
                              router.push(`${infoLoan?.labor_card as string}`)
                            }
                          >
                            Descargar
                          </button>
                        </>
                      )}

                    {infoLoan?.labor_card === "No definido" &&
                      infoLoan?.upid_labor_card === "No definido" &&
                      !newFileUpload00 && (
                        <>
                          <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, 0)}
                          />
                          <button
                            onClick={() => {
                              document.getElementById("fileInput")?.click();
                            }}
                          >
                            Subir
                          </button>
                        </>
                      )}

                    {newFileUpload00 &&
                      infoLoan?.labor_card == "No definido" &&
                      infoLoan?.upid_labor_card == "No definido" && (
                        <button
                          onClick={() =>
                            handleReUpload({
                              name: "labor_card",
                              // upId: documentsInfo?.upId as string,
                              userId: infoLoan?.userId as string,
                              loanId: infoLoan?.id as string,
                              newFile: newFileUpload00,
                            })
                          }
                        >
                          Confirmar Subida
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.backgroundCarts}>
            <div className={styles.titleSection}>
              <h3>Ultimos volantes de pago</h3>
            </div>
            <div className={styles.barCards}>
              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      size={20}
                      className={styles.iconDocument}
                    />
                  </div>
                  <h4 className={styles.textHeader}>Primer volante de pago</h4>
                </div>

                <div className={styles.infoBox}>
                  {infoLoan?.fisrt_flyer !== "No definido" &&
                    infoLoan?.upid_first_flayer !== "No definido" && (
                      <div className={styles.barBtns}>
                        <button
                          onClick={() =>
                            handleOpenModel(1, infoLoan?.fisrt_flyer as string)
                          }
                        >
                          Ver
                        </button>

                        <button
                          onClick={() =>
                            router.push(`${infoLoan?.fisrt_flyer}`)
                          }
                        >
                          Descargar
                        </button>
                      </div>
                    )}

                  {infoLoan?.fisrt_flyer === "No definido" &&
                    infoLoan?.upid_first_flayer === "No definido" &&
                    !newFileUpload01 && (
                      <>
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, 1)}
                        />
                        <button
                          onClick={() => {
                            document.getElementById("fileInput")?.click();
                          }}
                        >
                          Subir
                        </button>
                      </>
                    )}

                  {newFileUpload01 &&
                    infoLoan?.fisrt_flyer === "No definido" &&
                    infoLoan.upid_first_flayer === "No definido" && (
                      <button
                        onClick={() =>
                          handleReUpload({
                            name: "paid_flyer_01",
                            // upId: infoLoan?.upid_first_flayer as string,
                            userId: infoLoan?.userId as string,
                            loanId: infoLoan?.id as string,
                            newFile: newFileUpload01,
                          })
                        }
                      >
                        Confirmar Subida
                      </button>
                    )}
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      className={styles.iconDocument}
                      size={20}
                    />
                  </div>
                  <p className={styles.textHeader}>Segundo volante de pago</p>
                </div>

                <div className={styles.infoBox}>
                  {infoLoan?.second_flyer !== "No definido" &&
                    infoLoan?.upid_second_flyer !== "No definido" && (
                      <div className={styles.barBtns}>
                        <button
                          onClick={() =>
                            handleOpenModel(1, infoLoan?.second_flyer as string)
                          }
                        >
                          Ver
                        </button>

                        <button
                          onClick={() =>
                            router.push(`${infoLoan?.second_flyer}`)
                          }
                        >
                          Descargar
                        </button>
                      </div>
                    )}

                  {infoLoan?.second_flyer === "No definido" &&
                    infoLoan.upid_second_flyer === "No definido" &&
                    !newFileUpload02 && (
                      <>
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, 2)}
                        />
                        <button
                          onClick={() => {
                            document.getElementById("fileInput")?.click();
                          }}
                        >
                          Subir
                        </button>
                      </>
                    )}

                  {newFileUpload02 &&
                    infoLoan?.second_flyer === "No definido" &&
                    infoLoan.upid_second_flyer === "No definido" && (
                      <button
                        onClick={() =>
                          handleReUpload({
                            name: "paid_flyer_02",
                            // upId: infoLoan?.upid_second_flyer as string,
                            userId: infoLoan?.userId as string,
                            loanId: infoLoan?.id as string,
                            newFile: newFileUpload02,
                          })
                        }
                      >
                        Confirmar Subida
                      </button>
                    )}
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      className={styles.iconDocument}
                      size={20}
                    />
                  </div>
                  <p className={styles.textHeader}>Tercer volante de pago</p>
                </div>

                <div className={styles.infoBox}>
                  {infoLoan?.third_flyer !== "No definido" &&
                    infoLoan?.upid_third_flayer !== "No definido" && (
                      <div className={styles.barBtns}>
                        <button
                          onClick={() =>
                            handleOpenModel(1, infoLoan?.third_flyer as string)
                          }
                        >
                          Ver
                        </button>

                        <button
                          onClick={() =>
                            router.push(`${infoLoan?.third_flyer}`)
                          }
                        >
                          Descargar
                        </button>
                      </div>
                    )}

                  {infoLoan?.third_flyer === "No definido" &&
                    infoLoan?.upid_third_flayer === "No definido" &&
                    !newFileUpload03 && (
                      <>
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, 3)}
                        />
                        <button
                          onClick={() => {
                            document.getElementById("fileInput")?.click();
                          }}
                        >
                          Subir
                        </button>
                      </>
                    )}

                  {newFileUpload03 &&
                    infoLoan?.third_flyer === "No definido" &&
                    infoLoan.upid_third_flayer === "No definido" && (
                      <button
                        onClick={() =>
                          handleReUpload({
                            name: "paid_flyer_03",
                            // upId: infoLoan?.upid_third_flayer as string,
                            userId: infoLoan?.userId as string,
                            loanId: infoLoan?.id as string,
                            newFile: newFileUpload03,
                          })
                        }
                      >
                        Confirmar Subida
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.titleSection}>
              <h3>Documento de identidad</h3>
            </div>
            <div className={styles.cardFlyerDocs}>
              <div className={styles.centerHeaderFlyer}>
                <div className={styles.boxDocument}>
                  <HiOutlineDocumentChartBar
                    className={styles.iconDocument}
                    size={20}
                  />
                </div>
                <p className={styles.textHeader}>Cedula de ciudadania</p>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.barBtns}>
                  <button
                    onClick={() =>
                      handleOpenModel(0, documentsInfo?.documentSides as string)
                    }
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.backgroundOtherFiles}>
            <div className={styles.titleSection}>
              <h3>Otros documentos</h3>
            </div>
            <div className={styles.barCards}>
              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      className={styles.iconDocument}
                      size={20}
                    />
                  </div>
                  <p className={styles.textHeader}>
                    Autorizacion centrales de riesgo
                  </p>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.barBtns}>
                    <button onClick={() => handleAutoOpenModel(4)}>Ver</button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      className={styles.iconDocument}
                      size={20}
                    />
                  </div>
                  <p className={styles.textHeader}>Carta instrucciones</p>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.barBtns}>
                    <button onClick={() => handleAutoOpenModel(5)}>Ver</button>

                    <button onClick={() => handleOtherDocsDownloadFile(0)}>
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      className={styles.iconDocument}
                      size={20}
                    />
                  </div>
                  <p className={styles.textHeader}>
                    Autorizacion descuento nomina
                  </p>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.barBtns}>
                    <button onClick={() => handleAutoOpenModel(6)}>Ver</button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.centerHeaderFlyer}>
                  <div className={styles.boxDocument}>
                    <HiOutlineDocumentChartBar
                      className={styles.iconDocument}
                      size={20}
                    />
                  </div>
                  <p className={styles.textHeader}>Pagare</p>
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.barBtns}>
                    <button onClick={() => handleAutoOpenModel(7)}>Ver</button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={openModelDocs}
        link={linkSelect}
        onClose={() => setOpenModelDocs(false)}
      >
        <p>Hola</p>
      </Modal>

      <Modal
        isOpen={openDocsScan}
        link={linkDocsScan}
        onClose={() => setOpenDocsScan(false)}
      >
        <p>Hola</p>
      </Modal>

      <Modal
        isOpen={openModelAutoDoc}
        onClose={() => setOpenModelAutoDoc(false)}
      >
        {optionOpenDocs == 4 && (
          <Document00
            numberDocument={documentsInfo?.number as string}
            entity={infoLoan?.entity as string}
            numberBank={infoLoan?.bankNumberAccount as string}
            signature={infoLoan?.signature}
          />
        )}

        {optionOpenDocs == 5 && (
          <Document01
            numberDocument={documentsInfo?.number as string}
            name={`${userInfo?.names} ${userInfo?.firstLastName} ${userInfo?.secondLastName}`}
            signature={infoLoan?.signature as string}
          />
        )}

        {optionOpenDocs == 6 && (
          <Document02
            numberDocument={documentsInfo?.number as string}
            name={`${userInfo?.names} ${userInfo?.firstLastName} ${userInfo?.secondLastName}`}
            signature={infoLoan?.signature as string}
          />
        )}

        {optionOpenDocs == 7 && (
          <Document03
            name={`${userInfo?.names} ${userInfo?.firstLastName} ${userInfo?.secondLastName}`}
            numberDocument={documentsInfo?.number as string}
            signature={infoLoan?.signature}
          />
        )}
      </Modal>
    </>
  );
}

export default RequestInfo;
