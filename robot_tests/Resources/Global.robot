*** Settings ***
Library     SeleniumLibrary
Library     OperatingSystem
Library     String


*** Variables ***
${BROWSER}      Chrome
${DEVICE}       ${EMPTY}

# ================================================================================
# BASIC AUTHENTICATION
# ================================================================================

${USER}         planet_user
${PASS}         FI4Y$HJVZP
${URL}          https://${USER}:${PASS}@preprod.weareplanet.com/

#${URL}          https://google.com
# ================================================================================


*** Keywords ***
Open Browser for Mobile Testing
    &{device metrics}    Create Dictionary    width=${390}    height=${844}    pixelRatio=${3.0}
    &{mobile_emulation}    Create Dictionary    deviceMetrics=${device metrics}
    Open Browser
    ...    about:blank
    ...    ${BROWSER}
    #...    options=add_argument("--ignore-certificate-errors");add_experimental_option("mobileEmulation",${mobile_emulation});add_argument("--headless")  executable_path=/home/rzanetti/.local/share/WebDriverManager/bin/chromedriver
    ...    options=add_argument("--ignore-certificate-errors");add_experimental_option("mobileEmulation",${mobile_emulation});add_argument("--headless")
    Set Selenium Speed    0
    Set Selenium Timeout    60

Open Browser for Testing
     [Arguments]    ${height}    ${width}
    #Open Browser    about:blank    ${BROWSER}    options=add_argument("--ignore-certificate-errors");add_argument("--headless")  executable_path=/home/rzanetti/.local/share/WebDriverManager/bin/chromedriver
    Open Browser    about:blank    ${BROWSER}    options=add_argument("--ignore-certificate-errors");add_argument("--headless")
    ##Set Window Size    1920    1080
    Set Window Size    ${height}    ${width}
    Set Selenium Speed    0
    Set Selenium Timeout    60

Click on Element
    [Arguments]    ${locator}

    Wait Until Element Is Visible    ${locator}
    Click Button    ${locator}

Type on Element
    [Arguments]    ${locator}    ${text}

    Wait Until Element Is Visible    ${locator}
    Input Text    ${locator}    ${text}

Type Password on Element
    [Arguments]    ${locator}    ${text}

    Wait Until Element Is Visible    ${locator}
    Input Password    ${locator}    ${text}
