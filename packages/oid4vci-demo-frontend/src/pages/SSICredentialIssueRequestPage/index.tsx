import React, {ReactElement, useEffect, useState} from 'react'
import {Text} from "../../components/Text";
import style from '../../components/Text/Text.module.css'
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from 'react-router-dom';
import agent from '../../agent';
import {QRData, QRRenderingProps, QRType, URIData} from '@sphereon/ssi-sdk.qr-code-generator';
import {
    EcosystemGeneralConfig,
    getCurrentEcosystemGeneralConfig,
    getCurrentEcosystemPageOrComponentConfig,
    SSICredentialIssueRequestPageConfig, SSISecondaryButtonConfig
} from "../../ecosystem-config"
import {IssueStatus, IssueStatusResponse} from "@sphereon/oid4vci-common";
import DeepLink from "../../components/DeepLink";
import {Mobile, NonMobile} from '../..';
import {useMediaQuery} from "react-responsive";
import {Sequencer} from "../../router/sequencer"

type State = {
    uri: string,
    preAuthCode: string,
    isManualIdentification: boolean,
}

const SSICredentialIssueRequestPage: React.FC = () => {
    const [sequencer] = useState<Sequencer>(new Sequencer())
    const navigate = useNavigate()
    const config: SSICredentialIssueRequestPageConfig = getCurrentEcosystemPageOrComponentConfig('SSICredentialIssueRequestPage') as SSICredentialIssueRequestPageConfig
    const generalConfig: EcosystemGeneralConfig = getCurrentEcosystemGeneralConfig();
    const buttonConfig = getCurrentEcosystemPageOrComponentConfig('SSISecondaryButton') as SSISecondaryButtonConfig;
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 767px)'})
    const location = useLocation();
    const state: State | undefined = location.state;
    const [qrCode, setQrCode] = useState<ReactElement>();

    useEffect(() => {
        sequencer.setCurrentRoute(location.pathname, navigate)
        const intervalId = setInterval(() => {
            agent.oid4vciClientGetIssueStatus({id: state?.preAuthCode!})
                .then((status: IssueStatusResponse) => {
                    if (status.status === IssueStatus.CREDENTIAL_ISSUED) {
                        clearInterval(intervalId);
                        sequencer.next()
                    } else if (status.status === IssueStatus.ERROR) {
                        // TODO: Add feedback to user
                        console.error(status.error)
                        clearInterval(intervalId)
                    }
                })
                .catch((error: Error) => {
                    clearInterval(intervalId)
                    console.error(`ERROR: ${error.message}`)
                })
        }, 1000);
    }, []);

    const qrData: QRData<QRType.URI, URIData> = {
        object: state?.uri!,
        type: QRType.URI,
        id: '567',
    }

    const renderingProps: QRRenderingProps = {
        bgColor: '#FBFBFB',
        fgColor: 'black',
        level: 'L',
        size: 330,
    }

    useEffect(() => {
        agent.qrURIElement({
            data: qrData,
            renderingProps
        }).then((qrCode: JSX.Element) => setQrCode(qrCode))
    }, []);

    const {t} = useTranslation()
    return (
        <div style={{display: 'flex', height: '100vh', width: '100%'}}>
            <NonMobile>
                <div style={{
                    display: 'flex',
                    width: '60%',
                    height: '100%',
                    background: `url(${state?.isManualIdentification ? `${config.photoManual}` : `${config.photoWallet}`})`,
                    backgroundSize: 'cover',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ...((config.photoManual || config.photoWallet) && { background: `url(${state?.isManualIdentification? `${config.photoManual}` : `${config.photoWallet}`}) 0% 0% / cover`}),
                    ...(config.backgroundColor && { backgroundColor: config.backgroundColor }),
                    ...(config.logo && { justifyContent: 'center' })
                }}>
                    { config.logo &&
                        <img
                            src={config.logo.src}
                            alt={config.logo.alt}
                            width={config.logo.width}
                            height={config.logo.height}
                        />
                    }
                    {(config.textLeft && !state?.isManualIdentification) && (
                        <text
                            className={"poppins-medium-36"}
                            style={{maxWidth: 735, color: '#FBFBFB', marginTop: "auto", marginBottom: 120}} // TODO add this to all except kvk
                        >
                            {t('common_left_pane_title')}
                        </text>
                    )}
                </div>
            </NonMobile>
            <div style={{
                display: 'flex',
                width: `${isTabletOrMobile ? '100%' : '40%'}`,
                height: '100%',
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{textAlign: 'center'}}
                        className={style.pReduceLineSpace}
                        title={
                            state?.isManualIdentification
                                ? t('credentials_right_pane_top_title', {credentialName: generalConfig.credentialName}).split('\n')
                                : t(config.title ? config.title : 'qrcode_right_pane_top_title', {credentialName: generalConfig.credentialName}).split('\n')
                        }
                        lines={
                            state?.isManualIdentification
                                ? t('credentials_right_pane_top_paragraph', {credentialName: generalConfig.credentialName}).split('\n')
                                : t(config.topParagraph ? config.topParagraph : 'qrcode_right_pane_top_paragraph', {credentialName: generalConfig.credentialName}).split('\n')
                        }
                    />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '55%',
                        marginBottom: '15%',
                        marginTop: '15%',
                        alignItems: 'center'
                    }}>
                        <NonMobile>
                            <div style={{flexGrow: 1, marginBottom: 34}}>
                                {qrCode}
                            </div>
                        </NonMobile>
                        <DeepLink style={{flexGrow: 1}} link={state?.uri!}/>
                    </div>
                    <NonMobile>
                        <Text
                        style={{flexGrow: 1, maxWidth: 378 }}
                            className={`${style.pReduceLineSpace} poppins-semi-bold-16`}
                        lines={state?.isManualIdentification ? t('credentials_right_pane_bottom_paragraph').split('\n') : t(config.bottomParagraph ? config.bottomParagraph : 'qrcode_right_pane_bottom_paragraph').split('\n')}
                        />
                    </NonMobile>
                    <Mobile>
                        <Text
                            style={{flexGrow: 1}}
                            className={`${style.pReduceLineSpace} poppins-semi-bold-16`}
                            lines={t('credentials_right_pane_bottom_paragraph_mobile').split('\n')}
                        />
                    </Mobile>
                </div>
            </div>
        </div>
    )
}

export default SSICredentialIssueRequestPage;
