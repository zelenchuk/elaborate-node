import React, {useState} from "react";


const ElaborateReport = () => {

    const [iframeLink, setIframeLink] = useState();  // make request to get iframe link
    const [isReportLoading, setIsReportLoading] = false; // when iframe is loading
    const [reportError, setReportError] = false;// when iframe is not loading

    // make request and get secure iframe link from your backend
    // write code here ...

    return <>

        {reportError && <div>{reportError}<div/>}

        {iframeLink &&
            <iframe
                loading={isReportLoading}
                title={'Elaborate report'}
                src={iframeLink}
            />
        }
    </>;
}

export default ElaborateReport;