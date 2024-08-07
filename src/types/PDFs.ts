/** Document00 */

interface TypeAccount {
  name: string;
  select: boolean;
}

interface OptionAccount {
  numberAccount: string;
  entityAccount: string;
}

export interface DocumentTypes00 {
  TitlePrevExplain: string;
  prevExplain: string;
  headerTitle: string;
  firstExplainText: string;
  secondTitle: string;
  optionAccount: OptionAccount;
  threeTitle: string;
  justifyText: string;
  numberOnce: string;
  textOnce: string;
  finalTitle: string;
  subFinalText: string;
  finalText: string;
}

/** Types of Document01 */

export type Document01Type = {
  firstParagraph: string;
  firstText: string;
  secondText: string;
  secondParagraph: string;
  inst01: string;
  inst02: string;
  inst03: string;
  inst04: string;
  inst05: string;
  finalSecondParagraph: string;
  threeParagraph: string;
  fourParagraph: string;
};

/** Types of Document02 */
export type Document02SubType = {
  title: string;
  firstParagraph: string;
  subFirstParagraph: string;
  TwoSubFirstParagraph: string;
  ThreeSubFirstParagraph: string;
  FourSubFirstParagraph: string;
  FiveSubFirstParagraph: string;
};

export type Document02Type = {
  title: string;
  firstParagraph: string;
  subFirstParagraph: string;
  secondParagraph: string;
  thirdParagraph: string;
  footer: string;
};

/** Types of Document04 */

interface NumeroPagare {
  publicText: string;
  publicId: string;
}

interface FechaVencimiento {
  publicText: string;
  date: string;
}

interface FirstParagraph {
  namePerson: string;
  publicfirstText: string;
  numberDocument: string;
  publicSecondText: string;
  payDay: string;
  publicFiveText: string;
  payQuantity: string;
}

interface FiveParagraph {
  publicFirstText: string;
  publicSecondText: string;
  dayPay: string;
}

export interface DocumentTypes04 {
  logoHeader: string;
  numero_pagare: NumeroPagare;
  fecha_vencimiento: FechaVencimiento;
  firstParagraph: FirstParagraph;
  secondParagraph: string;
  threeParagraph: string;
  fourParagraph: string;
  fiveParagraph: FiveParagraph;
  signature: string;
  numberDocument: string;
}
