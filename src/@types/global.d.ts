declare module "*.css" {
  const exports: { [exportName: string]: string };
  export = exports;
}

declare module "*.webp";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.mp4";
declare module "*.wav";
declare module "*.png";
declare module "*.svg";
declare module "*.m4a";

declare module "*.svg?react" {
  import React from "react";
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare interface process {
  env: {};
}
