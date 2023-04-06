*** Settings ***
Resource    ../Resources/Global.robot


*** Variables ***
${scrolls}      0
@{urls}=    https://preprod.weareplanet.com/    https://preprod.weareplanet.com/es/inicio    https://preprod.weareplanet.com/payments    https://preprod.weareplanet.com/hospitality    https://preprod.weareplanet.com/retail    https://preprod.weareplanet.com/de/retail    https://preprod.weareplanet.com/partners    https://preprod.weareplanet.com/resources    https://preprod.weareplanet.com/about    https://preprod.weareplanet.com/contact    https://preprod.weareplanet.com/single-payment-platform    https://preprod.weareplanet.com/hotel-networking    https://preprod.weareplanet.com/vat-refund    https://preprod.weareplanet.com/online-payments    https://preprod.weareplanet.com/dcc

*** Keywords ***
#Close GDPR Bar
    #Click Button     //div[@id='onetrust-close-btn-container']/button
    #Click Button      //button[@class='onetrust-close-btn-handler banner-close-button ot-close-link'][contains(.,'Continue without Accepting')]

Open URLs from text file

    ${user_width}    ${user_height} =    Get Window Size
    Log    User Height: ${user_height}
    ${page} =    Set Variable    ${1}

    ${urlsTotal} =    Get length    ${urls}

    FOR    ${url}    IN    @{urls}
        Log to console    \n==> URL ${page} of ${urlsTotal} - ${url}
        Go to    ${url}
        Sleep    1 second
        #Run Keyword And Ignore Error    Close GDPR Bar
        Take Screenshot    ${user_height}    ${page}
        ${page} =    Evaluate    ${page}+1
    END

Take Screenshot
    [Arguments]    ${user_height}    ${page}

    ${page_height} =    Execute Javascript
    ...    var body = document.body,html = document.documentElement; var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight ); return height;
    ${scrolls} =    Evaluate    ${page_height}/${user_height}
    ${scrolls} =    Evaluate    math.ceil(${scrolls})

    FOR    ${i}    IN RANGE    1    ${scrolls}+1
        Capture Page Screenshot    ${BROWSER}_${DEVICE}_page_${page}_part_${i}.png
        Sleep    1 second
        Execute JavaScript    window.scrollTo(0, ${user_height}*${i})
    END
