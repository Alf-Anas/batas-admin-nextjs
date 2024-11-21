import Script from "next/script";

const GA_MEASUREMENT_ID = "G-E5LPEWFZRS";

export default function GoogleAnalytics() {
    if (!GA_MEASUREMENT_ID) {
        return null;
    }
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    );
}
