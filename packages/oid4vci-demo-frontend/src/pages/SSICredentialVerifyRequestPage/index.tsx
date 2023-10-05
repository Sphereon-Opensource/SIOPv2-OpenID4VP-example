import React, {ReactElement, useState} from 'react'
import {Text} from "../../components/Text";
import style from '../../components/Text/Text.module.css'
import DeepLink from "../../components/DeepLink";
import {useTranslation} from "react-i18next";
import {AuthorizationResponsePayload} from "@sphereon/did-auth-siop";
import {useLocation, useNavigate} from "react-router-dom"
import MemoizedAuthenticationQR from '../../components/AuthenticationQR';
import {
    getCurrentEcosystemGeneralConfig,
    getCurrentEcosystemPageOrComponentConfig,
    SSICredentialVerifyRequestPageConfig
} from "../../ecosystem-config";
import SSIPrimaryButton from "../../components/SSIPrimaryButton";
import {useMediaQuery} from "react-responsive";
import {Mobile, MobileOS, NonMobile} from "../../index"
import {Sequencer} from "../../router/sequencer"

export default function SSICredentialVerifyRequestPage(): React.ReactElement | null {
    const location = useLocation()
    const navigate = useNavigate()
    const config = getCurrentEcosystemPageOrComponentConfig('SSICredentialVerifyRequestPage') as SSICredentialVerifyRequestPageConfig
    const {t} = useTranslation()
    const credentialName = getCurrentEcosystemGeneralConfig().credentialName
    const [sequencer] = useState<Sequencer>(new Sequencer())
    const [deepLink, setDeepLink] = useState<string>('')
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 767px)'})
    const onSignInComplete = async (data: AuthorizationResponsePayload) => {
        sequencer.setCurrentRoute(location.pathname, navigate)
        console.log('onSignInComplete')
        const state = {
            data: {
                vp_token: data.vp_token
            }
        };
        console.log('calling sequencer.next')
        await sequencer.next(state)
    }

    return (
        <div style={{display: 'flex', height: '100vh', width: '100%'}}>
            <NonMobile>
                <div style={{
                    display: 'flex',
                    width: '60%',
                    height: '100%',
                    flexDirection: 'column',
                    ...(config.photoLeft && { background: `url(${config.photoLeft}) 0% 0% / cover`}),
                    ...(config.backgroundColor && { backgroundColor: config.backgroundColor }),
                    ...(config.logo && { justifyContent: 'center', alignItems: 'center' })
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
            <div style={{
                display: 'flex',
                width: `${isTabletOrMobile ? '100%' : '40%'}`,
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                ...(isTabletOrMobile && { gap: 24, ...(config.mobile?.backgroundColor && { backgroundColor: config.mobile.backgroundColor }) }),
                ...(!isTabletOrMobile && { justifyContent: 'center', backgroundColor: '#FFFFFF' }),
            }}>
                {(isTabletOrMobile && config?.logo) &&
                    <img
                        src={config.mobile?.logo?.src}
                        alt={config.mobile?.logo?.alt}
                        width={config.mobile?.logo?.width ?? 150}
                        height={config.mobile?.logo?.height ?? 150}
                    />
                }
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '60%'
                }}>
                    <Text style={{textAlign: 'center'}}
                          className={style.pReduceLineSpace}
                          title={t('credential_verify_request_right_pane_top_title', {credentialName}).split('\n')}
                          lines={t('credential_verify_request_right_pane_top_paragraph', {credentialName}).split('\n')}/>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '70%',
                        marginBottom: isTabletOrMobile ? 40 : '25%',
                        marginTop: isTabletOrMobile ? 40 : '25%',
                        alignItems: 'center'
                    }}>
                        <div style={{flexGrow: 1, display: 'flex', justifyContent: 'center', marginBottom: 0}}>
                            {/*Whether the QR code is shown (mobile) is handled in the component itself */}
                            {<MemoizedAuthenticationQR onAuthRequestRetrieved={console.log}
                                                       onSignInComplete={onSignInComplete}
                                                       setQrCodeData={setDeepLink}/>}
                        </div>
                        <MobileOS>
                            <div style={{gap: 24, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                { config.mobile?.image &&
                                    <img src={config.mobile?.image} alt="success"/>
                                }
                                <DeepLink style={{flexGrow: 1}} link={deepLink}/>
                            </div>
                        </MobileOS>
                    </div>
                    <Mobile><Text style={{flexGrow: 1}} className={`${style.pReduceLineSpace} poppins-semi-bold-16`}
                                  lines={t('credential_verify_request_right_pane_bottom_paragraph_mobile').split('\n')}/></Mobile>
                    <NonMobile><Text style={{flexGrow: 1}} className={`${style.pReduceLineSpace} poppins-semi-bold-16`}
                                     lines={t('credential_verify_request_right_pane_bottom_paragraph').split('\n')}/></NonMobile>
                    {config.enableRightPaneButton && (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <SSIPrimaryButton
                                caption={t('credential_verify_request_right_pane_button_caption')}
                                onClick={async () => {
                                    sequencer.goToStep(config.rightPaneButtonStepId ?? 'infoRequest')
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

