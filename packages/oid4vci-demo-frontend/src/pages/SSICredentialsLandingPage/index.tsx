import React from 'react'
import {SSIMiniCardView} from '@sphereon/ui-components.ssi-react'
import {useTranslation} from 'react-i18next'
import {SSICredentialCardConfig, SSICredentialsLandingPageConfig} from "../../ecosystem-config"
import {Mobile, NonMobile} from "../../index"
import {useMediaQuery} from "react-responsive"
import {useFlowRouter} from "../../router/flow-router"

function handleCredentialClick(value: SSICredentialCardConfig) {
    window.location.href = value.route
}

const SSICredentialsLandingPage: React.FC = () => {
    const {t} = useTranslation()
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 767px)'})
    const flowRouter = useFlowRouter()
    const config: SSICredentialsLandingPageConfig = flowRouter.getPageConfig() as SSICredentialsLandingPageConfig

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            alignContent: 'center',

            flex: 1,
            height: '100vh',
        }}>

            <NonMobile>
                <div id={"photo"} style={{
                    display: 'flex',
                    width: '35%',
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ...(config.backgroundColor && {backgroundColor: config.backgroundColor}),
                    ...(config.logo && {justifyContent: 'center'})
                }}>
                    {config.logo &&
                        <img
                            src={config.logo.src}
                            alt={config.logo.alt}
                            width={300}
                            height={56}
                        />
                    }
                </div>
            </NonMobile>
            <div style={{
                width: isTabletOrMobile ? '100%' : '65%',
                height: isTabletOrMobile ? '90%' : '60%'
            }}>
                <div style={{
                    margin: 'auto',
                    gap: isTabletOrMobile ? 28 : 65,
                    flexDirection: 'column',
                    display: 'flex',
                    width: '70%',
                    height: '60%',
                    alignItems: 'center'
                }}>
                    <Mobile>
                        <img
                            style={{marginBottom: 30}}
                            src={config.mobile?.logo?.src ?? 'wallets/sphereon_logo.png'}
                            alt={config.mobile?.logo?.alt ?? 'logo'}
                            width={config.mobile?.logo?.width ?? 100}
                            height={config.mobile?.logo?.height ?? 100}
                        />
                    </Mobile>
                    <div style={{
                        display: 'flex',
                        alignSelf: 'stretch',
                        textAlign: isTabletOrMobile ? 'left' : 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        width: `${isTabletOrMobile ? '300px' : '620px'}`,
                        margin: 'auto'
                    }}>
                        <Mobile>
                            <span style={{fontWeight: '600', fontSize: '24px', width: '100%'}}>{t(config.pageTitle)}</span><br/>
                            <span style={{fontSize: '11px'}}>{t(config.text)}</span>
                        </Mobile>
                        <NonMobile>
                            <span style={{fontWeight: '600', fontSize: '32px'}}>{t(config.pageTitle)}</span><br/>
                            <span style={{fontSize: '20px'}}>{t(config.text)}</span>
                        </NonMobile>
                    </div>
                    {config.credentials.map(value => (
                        <div onClick={() => handleCredentialClick(value)}>
                            <Mobile>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-evenly',
                                    alignContent: 'space-between',
                                    cursor: 'pointer'
                                }}>
                                    <SSIMiniCardView
                                        backgroundImage={{uri: value.backgroundImage}}
                                        logo={{
                                            uri: value.logo?.src,
                                            ...((value.logo?.height && value.logo?.width) && {
                                                dimensions: {
                                                    height: value.logo?.height,
                                                    width: value.logo?.width,
                                                }
                                            })

                                        }}
                                    />
                                    <div style={{width: 200, paddingLeft: '5px'}}>
                                        <span style={{fontSize: '14px', fontWeight: '600'}}>{value.name}</span><br/>
                                        <span style={{fontSize: '10px'}}>{value.description}</span>
                                    </div>
                                </div>
                            </Mobile>
                            <NonMobile>
                                <div style={{
                                    display: 'flex',
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <SSIMiniCardView
                                        style={{width: 140, height: 90}}
                                        backgroundImage={{
                                            uri: value.backgroundImage
                                        }}
                                        logo={{
                                            uri: value.logo?.src,
                                            ...((value.logo?.height && value.logo?.width) && {
                                                dimensions: {
                                                    height: value.logo?.height,
                                                    width: value.logo?.width,
                                                }
                                            })

                                        }}
                                    />
                                    <div style={{width: '450px', textAlign: 'left', paddingLeft: '3%'}}>
                                        <span style={{
                                            fontSize: '30px',
                                            fontWeight: '500',
                                            color: '#303030'
                                        }}>{value.name}</span><br/>
                                        <span style={{fontSize: '18px', color: '#303030',}}>{value.description}</span>
                                    </div>
                                </div>
                            </NonMobile>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SSICredentialsLandingPage;
