"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import SignatureCanvas, {
  ReactSignatureCanvasProps,
} from "react-signature-canvas";
import { useMediaQuery } from "react-responsive";

import styles from "./signature.module.css";
import { TbCircleCheck, TbCircleX, TbLoader } from "react-icons/tb";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";
import { uploadRandomKey } from "@/handlers/randomUploadKey";

function Signature({
  success,
  src,
  userId,
}: {
  success: () => void;
  src: (url: string, upSignatureId: string, base64: string) => void;
  userId: string;
}) {
  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);
  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // const { loan, setLoanInfo } = useContractContext();
  const { user } = useGlobalContext();

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  };

  const saveSignature = async () => {
    if (signatureCanvasRef.current) {
      const signatureImage = signatureCanvasRef.current.toDataURL();
      setUploadSuccess(true);
      setPreviewSignature(signatureImage);
      const upSignatureId = uploadRandomKey();

      const blob = await (await fetch(signatureImage)).blob();
      const formData = new FormData();

      // Agregar el blob (archivo) y el nombre al FormData
      formData.append("file", blob, `signature-${userId}-${upSignatureId}.png`);
      formData.append("name", upSignatureId);

      // Hacer la petición al nuevo endpoint usando axios
      const tempSigUrl = await axios.post("/api/temp/files/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // console.log(tempSigUrl.data.data);

      if (tempSigUrl.data.success == true) {
        const link = tempSigUrl.data.data;
        setUploadSuccess(false);
        src(link, upSignatureId, signatureImage);
        success();
      }
    }
  };

  const canvasProps: ReactSignatureCanvasProps["canvasProps"] = {
    className: styles.signatureCanvas,
  };

  return (
    <>
      <div className={styles.SignatureContainer}>
        {!previewSignature && (
          <div className={styles.signatureProcc}>
            <SignatureCanvas
              ref={signatureCanvasRef}
              penColor="purple"
              canvasProps={canvasProps}
            />
          </div>
        )}

        {previewSignature && (
          <div className={styles.signatureProcc}>
            <Image
              src={previewSignature}
              alt={"signature"}
              width={300}
              height={100}
              className={styles.imgPreview}
            />
          </div>
        )}

        <div className={styles.previewImg}>
          <div className={styles.centerPreviewImg}>
            {!previewSignature && (
              <div className={styles.clearSig} onClick={clearSignature}>
                <div className={styles.centerClearSig}>
                  <div className={styles.boxIconSaveSig}>
                    <TbCircleX size={20} className={styles.iconClear} />
                  </div>
                  <p>Limpiar Firma</p>
                </div>
              </div>
            )}

            <div className={styles.saveSig} onClick={saveSignature}>
              <div className={styles.centerSaveSig}>
                <div className={styles.boxIconSaveSig}>
                  <TbCircleCheck size={20} className={styles.iconSave} />
                </div>
                {previewSignature && (
                  <p
                    onClick={() => {
                      setPreviewSignature(null);
                      success();
                    }}
                  >
                    Editar firma
                  </p>
                )}
                {!previewSignature && <p>Guardar firma</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className={styles.containerLoaderDocs}>
          <div className={styles.centerContainerDocs}>
            <div className={styles.boxIconLoader}>
              <TbLoader size={20} className={styles.loaderIcon} />
            </div>
            <p className={styles.textGenDocs}>
              Generando documentos con tu firma
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Signature;
