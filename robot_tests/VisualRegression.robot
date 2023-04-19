*** Settings ***
Resource            Resources/Global.robot
Resource            Resources/VisualRegression.robot



#Suite Setup         Run Keyword    Set Screenshot Directory    image-diff
##...                 AND             Set Environment Variable       webdriver.chrome.driver    C:\Users\vmilanez\AppData\Local\rasjani\WebDriverManager\bin\chromedriver.exe
Test Teardown       Close Browser


*** Test Cases ***
Desktop Large
    [TAGS]  desktop
    Set Global Variable    ${DEVICE}    DesktopLarge
    Open Browser for Testing  1920  1080
    Go To    ${URL}
    #Close GDPR Bar
    Open URLs from text file

Desktop Small
    [TAGS]  desktop
    Set Global Variable    ${DEVICE}    DesktopSmall
    Open Browser for Testing  1280  1024
    Go To    ${URL}
    #Close GDPR Bar
    Open URLs from text file

Mobile
    [Tags]  mobile
    Set Global Variable    ${DEVICE}    Mobile
    Open Browser for Mobile Testing
    Go To    ${URL}
    #Close GDPR Bar
    Open URLs from text file
