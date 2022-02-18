document.addEventListener("DOMContentLoaded", runApp);

const states = [
    "wellcome-to-service",
    "get-patient-data",
    "get-mo-info-extended",
    "get-service-specs-info",
    "get-resource-info",
    "get-schedule-info",
    "create-appointment",
    "appointment-full-details",
    "appointment-history-list"
]


function runApp() {
    const app = new Vue({
        el: '#app',
        data: {
            state: "get-mo-info-extended",
            hospitals: getHospitals()
        },
        methods: {
            setScreenState(state) {
                this.state = state
            },
            setScreenStateBack() {
                const backStateIndex = states.indexOf(this.state) - 1
                if (backStateIndex >= 0) {
                    this.state = states[backStateIndex]
                }
            }
        }
    })
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
}

async function sendRequest(url, action, request) {
    const headers = new Headers();
    headers.append("Content-Type", "application/xml");
    headers.append("SOAPAction", action);

    var requestOptions = {
        method: 'POST',
        headers,
        body: request,
        redirect: 'follow'
    };

    const responseRaw = await fetch(url, requestOptions)
    const responseText = await responseRaw.text()
    const responseXML = new DOMParser().parseFromString(responseText, 'text/xml');
    const responseJson = xmlToJson(responseXML)
    return responseJson;
}

function executeTemplate(tmp, data) {
    for (key in data) {
        tmp = tmp.replace(`{{${key}}}`, data[key])
    }
    return tmp
            .replaceAll('  ', '')
            .replaceAll('\n', '')
}
  
const GetValidatePatientInfoRequest = 
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
        <ns2:GetValidatePatientInfoRequest xmlns:ns2="http://www.rt-eu.ru/med/hc/">
            <Session_ID>{{SessionID}}</Session_ID>
            <Patient_Data>
                <OMS_Number>{{Patient.OMSNumber}}</OMS_Number>
                <OMS_Series>{{Patient.OMSSeries}}</OMS_Series>
                <SNILS>{{Patient.SNILS}}</SNILS>
                <First_Name>{{Patient.FirstName}}</First_Name>
                <Last_Name>{{Patient.LastName}}</Last_Name>
                <Middle_Name>{{Patient.MiddleName}}</Middle_Name>
                <Birth_Date>{{Patient.BirthDate}}</Birth_Date>
                <Sex>{{Patient.Sex}}</Sex>
            </Patient_Data>
            <Applicant_Data>
                <Last_Name>{{Applicant.LastName}}</Last_Name>
                <First_Name>{{Applicant.FirstName}}</First_Name>
                <Middle_Name>{{Applicant.MiddleName}}</Middle_Name>
                <SNILS>{{Applicant.SNILS}}</SNILS>
                <Mobile_Phone>{{Applicant.Phone}}</Mobile_Phone>
                <Email>{{Applicant.Email}}</Email>
            </Applicant_Data>
            <Cod_Kladr_Fias>{{CodKladrFias}}</Cod_Kladr_Fias>
            <Address_Str>{{AddressStr}}</Address_Str>
            <Adr_Region>{{Region}}</Adr_Region>
            <Adr_Area></Adr_Area>
            <Adr_City>{{City}}</Adr_City>
            <Adr_City_Area></Adr_City_Area>
            <Adr_Place></Adr_Place>
            <Adr_Street>{{Street}}</Adr_Street>
            <Adr_Additional_Area></Adr_Additional_Area>
            <Adr_Additional_Street></Adr_Additional_Street>
            <Adr_House>{{House}}</Adr_House>
            <Adr_Housing></Adr_Housing>
            <Adr_Structure></Adr_Structure>
            <Adr_Apartment>{{Apartment}}</Adr_Apartment>
            <Adr_Post_Index>{{PostIndex}}</Adr_Post_Index>
            <Reason_Task>{{ReasonTask}}</Reason_Task>
        </ns2:GetValidatePatientInfoRequest>
    </soapenv:Body>
</soapenv:Envelope>`

const GetHouseCallScheduleInfoRequest = 
`<?xml version="1.0" encoding="UTF-8" ?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:s='http://www.w3.org/2001/XMLSchema' xmlns:wsa='http://www.w3.org/2005/08/addressing'>
    <SOAP-ENV:Header>
        <wsa:MessageID>urn:uuid:{{MessageID}}</wsa:MessageID>
    </SOAP-ENV:Header>
    <SOAP-ENV:Body>
        <GetHouseCallScheduleInfoRequest xmlns="http://www.rt-eu.ru/med/hc/">
            <Session_ID xmlns="">{{SessionID}}</Session_ID>
            <Resource_Id xmlns="">{{ResourceID}}</Resource_Id>
            <StartDateRange xmlns="">{{StartDate}}</StartDateRange>
            <EndDateRange xmlns="">{{EndDate}}</EndDateRange>
        </GetHouseCallScheduleInfoRequest>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

const CreateHouseCallRequest =
`<?xml version="1.0" encoding="UTF-8" ?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:s='http://www.w3.org/2001/XMLSchema' xmlns:wsa='http://www.w3.org/2005/08/addressing'>
    <SOAP-ENV:Header>
        <wsa:MessageID>urn:uuid:{{MessageID}}</wsa:MessageID>
    </SOAP-ENV:Header>
    <SOAP-ENV:Body>
        <CreateHouseCallRequest xmlns="http://www.rt-eu.ru/med/hc/">
            <Session_ID xmlns="">{{SessionID}}</Session_ID>
            <Slot_Id xmlns="">{{SlotID}}</Slot_Id>
        </CreateHouseCallRequest>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

const CancelHouseCallRequest = 
`<?xml version="1.0" encoding="UTF-8" ?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:s='http://www.w3.org/2001/XMLSchema' xmlns:wsa='http://www.w3.org/2005/08/addressing'>
    <SOAP-ENV:Header>
        <wsa:MessageID>urn:uuid:{{MessageID}}</wsa:MessageID>
    </SOAP-ENV:Header>
    <SOAP-ENV:Body>
        <ns2:CancelHouseCallRequest xmlns:ns6="http://epgu.rtlabs.ru/equeue/ws/types/" xmlns:ns5="http://epgu.rtlabs.ru/equeue/ws/" xmlns:ns2="http://www.rt-eu.ru/med/hc/" xmlns:ns4="http://www.w3.org/2004/08/xop/include" xmlns:ns3="http://smev.gosuslugi.ru/rev120315">
            <HC_Id_Rmis>{{RmisID}}</HC_Id_Rmis>
        </ns2:CancelHouseCallRequest>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`

// From:   https://www.npmjs.com/package/uuid4
// Author: Michael J. Ryan
function uuid4() {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    return uuid.split(/[:\/]/g).pop().toLowerCase();
}

// From:   https://gist.github.com/chinchang/8106a82c56ad007e27b1
//         chinchang/xmlToJson.js
// Author: Kushagra Gour
function xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 3) {
      obj = xml.nodeValue;
    }

    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
      return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
        return text + node.nodeValue;
      }, "");
    } else if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
}


// Mockdata
function getHospitals() {
    return [
        {
            "MO_Id": "194701",
            "Reg_Phone": "(4242) 30-00-34",
            "Organization_Name": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска",
            "Address_MO": "Южно-Сахалинск, пр-кт Мира, 85"
        },
        {
            "MO_Id": "194702",
            "Reg_Phone": "(4242) 70-50-91",
            "Organization_Name": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска Дальнее",
            "Address_MO": "г.Южно-Сахалинск, с.Дальнее, ул.Новая, 20"
        },
        {
            "MO_Id": "1943",
            "Reg_Phone": "(4242) 72–21–09, (4242) 72–29–67",
            "Organization_Name": "Сахалинский областной центр по профилактике и борьбе со СПИД",
            "Address_MO": "Южно-Сахалинск, ул.Амурская, 53-А"
        },
        {
            "MO_Id": "9494",
            "Reg_Phone": "(4242) 510–710, (4242) 510–717, (4242) 510–718",
            "Organization_Name": "Сахалинский областной кожно-венерологический диспансер",
            "Address_MO": "Южно-Сахалинск, ул. Больничная, 46-Б"
        },
        {
            "MO_Id": "65111101",
            "Reg_Phone": "(4242) 72-84-99 - Регистратура",
            "Organization_Name": "Городская травматологическая поликлиника",
            "Address_MO": "Южно-Сахалинск, проспект Мира 56а/3"
        },
        {
            "MO_Id": "78963",
            "Reg_Phone": "(4242) 77-22-95 - Регистратура",
            "Organization_Name": "Областная психиатрическая больница. Медосмотры",
            "Address_MO": "Южно-Сахалинск, ул.Лермонтова, 110"
        },
        {
            "MO_Id": "74125",
            "Reg_Phone": "(4242) 76-08-82 - Регистратура",
            "Organization_Name": "Областной наркологический диспансер. Медосмотры",
            "Address_MO": "Южно-Сахалинск, ул.Горького, 12А"
        }
    ]
}
