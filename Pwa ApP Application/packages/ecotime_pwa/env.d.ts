/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_APP_URL_TESTING: string

    // more env variables...
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
}
