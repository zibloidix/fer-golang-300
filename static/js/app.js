document.addEventListener("DOMContentLoaded", runApp);

const ENDPOINT = "http://95.143.188.122:3001/fer"
if (window.__DEV__) {
    "http://localhost:3001/fer"
}

const states = [
    "wellcome-to-service",
    "get-patient-data",
    "get-mo-info-extended",
    "get-service-specs-info",
    "get-resource-info",
    "get-schedule-info",
    "create-appointment",
    "appointment-full-details",
    "appointment-history-list",
    "cancel-appointment",
    "appointment-canceled-full-details"
]

async function runApp() {
    const app = new Vue({
        el: '#app',
        data: {
            state: "wellcome-to-service",
            patientID: await getPatientID(),
            hospitals: await getHospitals(),
            services: await getServices(),
            resources: await getResources(),
            slots: await getSlots(),
            appointments: getAppointmentHistoryList(),
            appointmentCreated: await getCreateAppointment()
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
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor;
    }
    
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

// Отправка запроса GetPatientInfo
// await sendRequest(ENDPOINT, "GetPatientInfo", executeTemplate(GetPatientInfoRequest, getPatientData()))
function getPatientData() {
    return {
        oms: "6555320880000082",
        snils: "077-507-507 77",
        firstName: "Брюс",
        lastName: "Виллис",
        middleName: "Герой-Боевиков",
        birthDate: "1976-04-07",
        sex: "M"
    }
}

const GetPatientInfoRequest = 
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header></soapenv:Header>
    <soapenv:Body wsu:Id="id-1b4bd661-8dfc-4db2-8fa9-7281a709b7bf" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <ns2:GetPatientInfoRequest xmlns:ns2="http://www.rt-eu.ru/med/er/" xmlns:ns3="http://www.rt-eu.ru/med/er/v2_0" xmlns:ns4="http://smev.gosuslugi.ru/rev120315" xmlns:ns5="http://www.w3.org/2004/08/xop/include" xmlns:ns6="http://epgu.rtlabs.ru/equeue/ws/" xmlns:ns7="http://epgu.rtlabs.ru/equeue/ws/types/">
            <Session_ID>7d7c0110-d97b-476a-8f9e-008cbb903335</Session_ID>
            <Patient_Data xmlns="">
                <OMS_Number>{{oms}}</OMS_Number>
                <SNILS>{{snils}}</SNILS>
                <First_Name>{{firstName}}</First_Name>
                <Last_Name>{{lastName}}</Last_Name>
                <Middle_Name>{{middleName}}</Middle_Name>
                <Birth_Date>{{birthDate}}</Birth_Date>
                <Sex>{{sex}}</Sex>
                <Email xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
                <Phone xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
            </Patient_Data>
        </ns2:GetPatientInfoRequest>
    </soapenv:Body>
</soapenv:Envelope>`



// Отправка запроса GetMOInfoExtended
// await sendRequest(ENDPOINT, "GetMOInfoExtended", GetMOInfoExtendedRequest)
const GetMOInfoExtendedRequest = 
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
    </soapenv:Header>
    <soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-e8a0becb-8dbb-4876-81c5-f6094ad90929">
        <ns2:GetMOInfoExtendedRequest xmlns:ns2="http://www.rt-eu.ru/med/er/">
            <Session_ID>7d7c0110-d97b-476a-8f9e-008cbb903335</Session_ID>
        </ns2:GetMOInfoExtendedRequest>
    </soapenv:Body>
</soapenv:Envelope>`


// Отправка запроса GetServiceSpecsInfo
// await sendRequest(ENDPOINT, "GetServiceSpecsInfo", executeTemplate(GetServiceSpecsInfoRequest, getServiceSpecsInfoData()))
function getServiceSpecsInfoData() {
    return {
        moID: "194701"
    }
}

const GetServiceSpecsInfoRequest =
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
    </soapenv:Header>
    <soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-e8a0becb-8dbb-4876-81c5-f6094ad90929">
        <ns2:GetServiceSpecsInfoRequest xmlns:ns2="http://www.rt-eu.ru/med/er/">
            <Session_ID>7d7c0110-d97b-476a-8f9e-008cbb903335</Session_ID>
            <MO_Id xmlns="">{{moID}}</MO_Id>
        </ns2:GetServiceSpecsInfoRequest>
    </soapenv:Body>
</soapenv:Envelope>`


// Отправка запроса GetResourceInfo
// await sendRequest(ENDPOINT, "GetResourceInfo", executeTemplate(GetResourceInfoRequest, getResourceInfoData()))
function getResourceInfoData() {
    return {
        serviceSpecID: "541 194701"
    }
}

const GetResourceInfoRequest = 
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
    </soapenv:Header>
    <soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-e8a0becb-8dbb-4876-81c5-f6094ad90929">
        <ns2:GetResourceInfoRequest xmlns:ns2="http://www.rt-eu.ru/med/er/">
            <Session_ID>7d7c0110-d97b-476a-8f9e-008cbb903335</Session_ID>
            <ServiceSpec_Id xmlns="">{{serviceSpecID}}</ServiceSpec_Id>
        </ns2:GetResourceInfoRequest>
    </soapenv:Body>
</soapenv:Envelope>`

// Отправка запроса GetScheduleInfo
// await sendRequest(ENDPOINT, "GetScheduleInfo", executeTemplate(GetScheduleInfoRequest, getScheduleInfoData()))
function getScheduleInfoData() {
    return {
        resourceID: "15350401926.59143",
        startDateRange: "2021-07-21",
        endDateRange: "2021-08-04",
        startTimeRange: "00:00:00",
        endTimeRange: "23:59:00"
    }
}

const GetScheduleInfoRequest = 
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
	</soapenv:Header>
    <soapenv:Body wsu:Id="id-146d2871-c54e-43db-ad0b-e7d9e92d65d0" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <ns2:GetScheduleInfoRequest xmlns:ns2="http://www.rt-eu.ru/med/er/" xmlns:ns3="http://www.rt-eu.ru/med/er/v2_0" xmlns:ns4="http://smev.gosuslugi.ru/rev120315" xmlns:ns5="http://www.w3.org/2004/08/xop/include" xmlns:ns6="http://epgu.rtlabs.ru/equeue/ws/" xmlns:ns7="http://epgu.rtlabs.ru/equeue/ws/types/">
            <Session_ID>7d7c0110-d97b-476a-8f9e-008cbb903335</Session_ID>
            <Resource_Id>{{resourceID}}</Resource_Id>
            <StartDateRange>{{startDateRange}}</StartDateRange>
            <EndDateRange>{{endDateRange}}</EndDateRange>
            <StartTimeRange>{{startTimeRange}}</StartTimeRange>
            <EndTimeRange>{{endTimeRange}}</EndTimeRange>
        </ns2:GetScheduleInfoRequest>
    </soapenv:Body>
</soapenv:Envelope>`


// Отправка запроса CreateAppointment
// await sendRequest(ENDPOINT, "CreateAppointment", executeTemplate(CreateAppointmentRequest, getCreateAppointmentData()))
function getCreateAppointmentData() {
    return {
        slotID: "194701-59143-65959-61560-61620"
    }
}

const CreateAppointmentRequest = 
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
    </soapenv:Header>
    <soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-e8a0becb-8dbb-4876-81c5-f6094ad90929">
        <ns2:CreateAppointmentRequest xmlns:ns2="http://www.rt-eu.ru/med/er/">
            <Session_ID>7d7c0110-d97b-476a-8f9e-008cbb903335</Session_ID>
            <Slot_Id xmlns="">{{slotID}}</Slot_Id>
        </ns2:CreateAppointmentRequest>
    </soapenv:Body>
</soapenv:Envelope>`


// Отправка запроса CancelAppointment
// await sendRequest(ENDPOINT, "CancelAppointment", executeTemplate(CancelAppointmentRequest, getCancelAppointmentData()))
function getCancelAppointmentData() {
    return {
        bookIDMis: "05BDE828-E9D7-11EB-A253-005056AFD4A3"
    }
}

const CancelAppointmentRequest =
`<?xml version='1.0' encoding='UTF-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header>
    </soapenv:Header>
    <soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-e8a0becb-8dbb-4876-81c5-f6094ad90929">
        <ns2:CancelAppointmentRequest xmlns:ns2="http://www.rt-eu.ru/med/er/">
            <Book_Id_Mis>{{bookIDMis}}</Book_Id_Mis>
        </ns2:CancelAppointmentRequest>
    </soapenv:Body>
</soapenv:Envelope>`


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

function getAppointmentHistoryList() {
    return [
        {
            "title": "Запись подтверждена на прием к врачу",
            "date": "2022-02-19T02:08:45.917Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска",
            "isActive": true
        },
        {
            "title": "Запись отменена заявителем на прием к врачу",
            "date": "2022-02-18T12:44:52.956Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска"
        },
        {
            "title": "Запись отменена заявителем на прием к врачу",
            "date": "2022-02-18T12:39:37.890Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска"
        },
        {
            "title": "Запись отменена заявителем на вызов врача",
            "date": "2022-02-15T04:10:25.783Z",
            "hospital": "ГБУЗ \"Городская поликлиника №2 города Южно-Сахалинска\""
        },
        {
            "title": "Запись подтверждена на прием к врачу",
            "date": "2021-08-12T12:45:00.000Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска"
        },
        {
            "title": "Запись подтверждена на прием к врачу",
            "date": "2021-08-12T08:45:00.000Z",
            "hospital": "Городская поликлиника № 4 г.Южно-Сахалинска"
        },
        {
            "title": "Запись подтверждена на прием к врачу",
            "date": "2021-07-29T19:05:00.523Z",
            "hospital": "ГБУЗ \"Городская поликлиника №2 города Южно-Сахалинска\"",
            "isActive": true
        },
        {
            "title": "Запись отменена заявителем на прием к врачу",
            "date": "2021-07-29T18:30:42.394Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска"
        },
        {
            "title": "Запись отменена заявителем на прием к врачу",
            "date": "2021-07-29T18:06:27.428Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска"
        },
        {
            "title": "Запись отменена заявителем на прием к врачу",
            "date": "2021-07-29T17:38:20.996Z",
            "hospital": "ГБУЗ Городская поликлиника №2 г.Южно-Сахалинска"
        }
    ]
}

async function getPatientID() {
    const resp = await sendRequest(ENDPOINT, "GetPatientInfo", executeTemplate(GetPatientInfoRequest, getPatientData()))
    return resp["soapenv:Envelope"]["soapenv:Body"]["er:GetPatientInfoResponse"].Patient_Id
}

async function getHospitals() {
    const resp = await sendRequest(ENDPOINT, "GetMOInfoExtended", GetMOInfoExtendedRequest)
    const hospitals = resp["soapenv:Envelope"]["soapenv:Body"]["er:GetMOInfoExtendedResponse"].ListMO.MO.map( m => {
        return {
            MO_Id: m.MO_Id,
            Reg_Phone: m.MO_Phone,
            Organization_Name: m.MO_Name,
            Reg_Phone: m.MO_Phone,
            Address_MO: m.MO_Address
        }
    })
    return hospitals
}

async function getServices() {
    const resp = await sendRequest(ENDPOINT, "GetServiceSpecsInfo", executeTemplate(GetServiceSpecsInfoRequest, getServiceSpecsInfoData()))
    const services = resp["soapenv:Envelope"]["soapenv:Body"]["er:GetServiceSpecsInfoResponse"].ListServiceSpecs.ServiceSpec.map( s => {
        return {
            Service_Id: s.ServiceSpec_Id,
            Service_Name: s.ServiceSpec_Name
        }
    })
    return services
}

async function getResources() {
    const resp = await sendRequest(ENDPOINT, "GetResourceInfo", executeTemplate(GetResourceInfoRequest, getResourceInfoData()))
    const resources = resp["soapenv:Envelope"]["soapenv:Body"]["er:GetResourceInfoResponse"].ListResource.Resource
    return resources
}

async function getSlots() {
    const resp = await sendRequest(ENDPOINT, "GetScheduleInfo", executeTemplate(GetScheduleInfoRequest, getScheduleInfoData()))
    const slots = resp["soapenv:Envelope"]["soapenv:Body"]["er:GetScheduleInfoResponse"].Schedule.Slots.map(s => {
        s.VisitTime = dateToString( s.VisitTime )
        return s
    })
    return slots
}

async function getCreateAppointment() {
    const resp = await sendRequest(ENDPOINT, "CreateAppointment", executeTemplate(CreateAppointmentRequest, getCreateAppointmentData()))
    const slot = resp["soapenv:Envelope"]["soapenv:Body"]["er:CreateAppointmentResponse"]
    const { Book_Id_Mis, Comment, Session_ID, Slot_Id, Status_Code, VisitTime } = slot
    return {
        Book_Id_Mis,
        Comment,
        Session_ID,
        Slot_Id,
        Status_Code,
        VisitTime
    }
}

function dateToString(srcDate) {
    const date = new Date(srcDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2,0);
    const day = `${date.getDate()}`.padStart(2,0);
    const hh = date.getHours()
    const mm = date.getMinutes()
    return `${day}.${month}.${year} ${hh}:${mm}:00`;
  }
