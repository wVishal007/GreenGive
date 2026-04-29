declare module "react-confetti" {
  import * as React from "react";
  export interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    run?: boolean;
    colors?: string[];
  }
  export default function Confetti(props: ConfettiProps): JSX.Element;
}
