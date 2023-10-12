import React, {useState} from 'react'
import {Text} from '../../components/Text'
import style from '../../components/Text/Text.module.css'
import {Trans, useTranslation} from "react-i18next"
import {useLocation} from 'react-router-dom'
import SSIPrimaryButton from '../../components/SSIPrimaryButton'
import {
    EcosystemGeneralConfig,
    getCurrentEcosystemGeneralConfig, SSIInformationSharedSuccessPageConfig
} from "../../ecosystem-config"
import {NonMobile} from '../..'
import {useMediaQuery} from "react-responsive"
import {useFlowRouter} from "../../router/flow-router"

type State = {
    Voornaam: string
    Achternaam: string
    emailAddress: string
    isManualIdentification: boolean
}

const SSIInformationSuccessPage: React.FC = () => {
    const flowRouter = useFlowRouter<SSIInformationSharedSuccessPageConfig>()
    const location = useLocation();
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 767px)'})

    const state: State | undefined = location.state;

    const config= flowRouter.getPageConfig()
    const [currentEcosystemId] = useState<string>()
    const generalConfig: EcosystemGeneralConfig = getCurrentEcosystemGeneralConfig(currentEcosystemId);
    const {t} = useTranslation()

    return (
        <div style={{display: 'flex', flexDirection: 'row', height: '100vh', userSelect: 'none'}}>
            <NonMobile>
                {state?.isManualIdentification
                    ? <SSIInformationSharedSuccessPageLeftPanel/>
                    : <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            background: `url(${config.photoLeft})`,
                            backgroundSize: 'cover',
                        }}
                    >
                        <div style={{marginTop: 'auto', marginBottom: 153}}>
                            <Text
                                className={`${style.text} poppins-medium-36`}
                                lines={t('common_left_pane_title').split('\n')}
                            />
                        </div>
                    </div>
                }
            </NonMobile>
            <div style={{
                display: 'flex',
                width: `${isTabletOrMobile ? '100%' : '40%'}`,
                height: '100%',
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '70%',
                    marginTop: '6%'
                }}>
                    <Trans>
                        <Text
                            style={{
                                whiteSpace: 'pre-line',
                                flexGrow: 1,
                                textAlign: 'center'
                            }}
                            title={t('sharing_data_success_right_pane_title', {Voornaam: state?.Voornaam}).split('\n')}
                            lines={t(`${config.textRight && !state?.isManualIdentification? 'sharing_data_success_right_pane_paragraph_short': 'sharing_data_success_right_pane_paragraph'}`, {downloadUrl: generalConfig.downloadUrl}).split('\r\n')}
                        />
                    </Trans>
                    <div style={{
                        width: '342px',
                        height: '397px',
                        flexGrow: 1
                    }}>
                        <img src={config.photoRight} alt="success"/>
                    </div>
                    <div style={{
                        width: '100%',
                        alignSelf: 'flex-end',
                    }}>
                        <SSIPrimaryButton
                            caption={t('sharing_data_success_right_pane_button_caption')}
                            style={{width: '100%'}}
                            onClick={async () => await flowRouter.nextStep()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const SSIInformationSharedSuccessPageLeftPanel: React.FC = () => {
    const flowRouter = useFlowRouter<SSIInformationSharedSuccessPageConfig>()
    const config = flowRouter.getPageConfig()
    const location = useLocation();
    const state = location.state;
    const {t} = useTranslation()
    if (process.env.REACT_APP_ENVIRONMENT !== 'sphereon') {
        return (<NonMobile>
                    <div id={"photo"} style={{
                        display: 'flex',
                        width: '60%',
                        height: '100%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        ...((config.photoLeft || config.photoLeftManual) && { background: `url(${state?.isManualIdentification? `${config.photoLeftManual}` : `${config.photoLeft}`}) 0% 0% / cover`}),
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
                    </div>
                </NonMobile>
        )
    }
    return (<div style={{
        maxHeight: "fit-content",
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'url("/mobile_store_background.svg")',
        backgroundSize: 'cover',
        backgroundColor: '#202537'
    }}
    >
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{
                display: 'flex',
                flex: 1,
                aspectRatio: 1.732710280373832,
                marginLeft: 77,
                marginRight: 77,
                background: 'url("/phone_perspective.svg")',
                backgroundSize: 'cover',
            }}/>
        </div>
        <div style={{
            marginTop: 'auto',
            marginBottom: 74,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <text
                className={"inter-normal-24 normal-400"}
                style={{
                    color: '#FBFBFB',
                    height: 39,
                    marginBottom: 17,
                }}
            >
                {t('sharing_data_success_get_mobile_app_message')}
            </text>
            <div style={{display: 'flex', flexDirection: 'row', margin: 'auto'}}>
                <a href="https://play.google.com/store/apps/details?id=com.sphereon.ssi.wallet"
                   target="_blank"
                   style={{
                       background: 'url("/google_play.svg")',
                       height: 60,
                       width: 203,
                       marginRight: 9
                   }}
                />
                <a href="https://apps.apple.com/nl/app/sphereon-wallet/id1661096796"
                   target="_blank"
                   style={{
                       background: 'url("/apple_store.svg")',
                       height: 60,
                       width: 203
                   }}/>
            </div>
        </div>
    </div>)
}

export default SSIInformationSuccessPage;
