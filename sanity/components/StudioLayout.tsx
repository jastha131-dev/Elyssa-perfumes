import { LayoutProps } from 'sanity'

const FIXEL_CSS = `
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-Thin.woff2') format('woff2');
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-ThinItalic.woff2') format('woff2');
  font-weight: 100;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-ExtraLight.woff2') format('woff2');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-ExtraLightItalic.woff2') format('woff2');
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-LightItalic.woff2') format('woff2');
  font-weight: 300;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-RegularItalic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-MediumItalic.woff2') format('woff2');
  font-weight: 500;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-SemiBoldItalic.woff2') format('woff2');
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-ExtraBold.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-ExtraBoldItalic.woff2') format('woff2');
  font-weight: 800;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'FixelText';
  src: url('/fonts/FixelText-BlackItalic.woff2') format('woff2');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}

#sanity,
#sanity *,
[data-ui="Studio"] *,
body {
  font-family: 'FixelText', -apple-system, BlinkMacSystemFont, sans-serif !important;
}
`

export function StudioLayout(props: LayoutProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FIXEL_CSS }} />
      {props.renderDefault(props)}
    </>
  )
}
