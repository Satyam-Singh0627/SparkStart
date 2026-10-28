@echo off
set ELECTRON_RUN_AS_NODE=
npm run build
npx electron .
