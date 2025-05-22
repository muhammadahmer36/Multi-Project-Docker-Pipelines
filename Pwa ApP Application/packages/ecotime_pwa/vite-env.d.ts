import { FC, SVGProps } from 'react';

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.svg' {
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}
