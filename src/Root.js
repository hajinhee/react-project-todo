import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

const muiThemePaletteKeys = [
  "background",
  "common",
  "error",
  "grey",
  "info",
  "primary",
  "secondary",
  "success",
  "text",
  "warning",
];

function Root() {
  const theme = createTheme({
    typography: {
      fontFamily: ["GmarketSansMedium"],
    },
    palette: {
      primary: {
        main: "#FFF2B2",
        light: "#FFF4C1",
        dark: "#B2A97C",
        contrastText: "#010101",
      },
      secondary: {
        main: "#B2A97C",
        light: "#F8D8DF",
        dark: "#AC9097",
        contrastText: "#000000",
      },
    },
  });

  useEffect(() => {
    const r = document.querySelector(":root");

    muiThemePaletteKeys.forEach((paletteKey) => {
      const themeColorObj = theme.palette[paletteKey];

      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, [theme.palette]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <HashRouter>
            <App />
          </HashRouter>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}

export default Root;
