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
    "appointment-history-list",
    "cancel-appointment",
    "appointment-canceled-full-details"
]


async function runApp() {
    const app = new Vue({
        el: '#app',
        data: {
            state: "wellcome-to-service",
            recordData: {
                patientID: await getPatientID()
            },
            hospitals: await getHospitals(),
            services: await getServices(),
            resources: await getResources(),
            slots: getSlots(),
            appointments: getAppointmentHistoryList()
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
// await sendRequest("http://localhost:3001/fer", "GetPatientInfo", executeTemplate(GetPatientInfoRequest, getPatientData()))
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
// await sendRequest("http://localhost:3001/fer", "GetMOInfoExtended", GetMOInfoExtendedRequest)
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
// await sendRequest("http://localhost:3001/fer", "GetServiceSpecsInfo", executeTemplate(GetServiceSpecsInfoRequest, getServiceSpecsInfoData()))
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
// await sendRequest("http://localhost:3001/fer", "GetResourceInfo", executeTemplate(GetResourceInfoRequest, getResourceInfoData()))
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
// await sendRequest("http://localhost:3001/fer", "GetScheduleInfo", executeTemplate(GetScheduleInfoRequest, getScheduleInfoData()))
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
// await sendRequest("http://localhost:3001/fer", "CreateAppointment", executeTemplate(CreateAppointmentRequest, getCreateAppointmentData()))
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
// await sendRequest("http://localhost:3001/fer", "CancelAppointment", executeTemplate(CancelAppointmentRequest, getCancelAppointmentData()))
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


// Mockdata
function getHospitalsMock() {
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

function getServicesMock() {
    return [
        {
            "Service_Id": "1",
            "Service_Name": "Врач-оториноларинголог"
        },
        {
            "Service_Id": "2",
            "Service_Name": "Врач-терапевт"
        },
        {
            "Service_Id": "3",
            "Service_Name": "Врач-стоматолог"
        },
    ]
}

function getResourcesMock() {
    return [
        {
            "Resource_Id": "10",
            "Resource_Name": "Хауз Грегори Михайлович"
        },
        {
            "Resource_Id": "20",
            "Resource_Name": "Робберт Чейз Иванович"
        },
        {
            "Resource_Id": "30",
            "Resource_Name": "Лиза Кадди Сергеевна"
        },
        {
            "Resource_Id": "40",
            "Resource_Name": "Эрик Форман Петрович"
        },
    ]
}

function getSlots() {
    return [
        {
            "Slot_Id": "194701-78825-66165-60300-61200",
            "VisitTime": "2022-02-25T16:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66165-62100-63000",
            "VisitTime": "2022-02-25T17:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66165-63000-63900",
            "VisitTime": "2022-02-25T17:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66165-63900-64800",
            "VisitTime": "2022-02-25T17:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66165-64800-65700",
            "VisitTime": "2022-02-25T18:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66165-65700-66600",
            "VisitTime": "2022-02-25T18:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-58500-59400",
            "VisitTime": "2022-02-28T16:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-59400-60300",
            "VisitTime": "2022-02-28T16:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-60300-61200",
            "VisitTime": "2022-02-28T16:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-61200-62100",
            "VisitTime": "2022-02-28T17:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-62100-63000",
            "VisitTime": "2022-02-28T17:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-63900-64800",
            "VisitTime": "2022-02-28T17:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-64800-65700",
            "VisitTime": "2022-02-28T18:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66168-65700-66600",
            "VisitTime": "2022-02-28T18:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-57600-58500",
            "VisitTime": "2022-03-01T16:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-58500-59400",
            "VisitTime": "2022-03-01T16:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-59400-60300",
            "VisitTime": "2022-03-01T16:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-60300-61200",
            "VisitTime": "2022-03-01T16:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-61200-62100",
            "VisitTime": "2022-03-01T17:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-62100-63000",
            "VisitTime": "2022-03-01T17:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-63000-63900",
            "VisitTime": "2022-03-01T17:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-63900-64800",
            "VisitTime": "2022-03-01T17:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-64800-65700",
            "VisitTime": "2022-03-01T18:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66169-65700-66600",
            "VisitTime": "2022-03-01T18:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-57600-58500",
            "VisitTime": "2022-03-02T16:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-58500-59400",
            "VisitTime": "2022-03-02T16:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-59400-60300",
            "VisitTime": "2022-03-02T16:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-60300-61200",
            "VisitTime": "2022-03-02T16:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-61200-62100",
            "VisitTime": "2022-03-02T17:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-62100-63000",
            "VisitTime": "2022-03-02T17:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-63000-63900",
            "VisitTime": "2022-03-02T17:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-63900-64800",
            "VisitTime": "2022-03-02T17:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-64800-65700",
            "VisitTime": "2022-03-02T18:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66170-65700-66600",
            "VisitTime": "2022-03-02T18:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-57600-58500",
            "VisitTime": "2022-03-03T16:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-58500-59400",
            "VisitTime": "2022-03-03T16:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-59400-60300",
            "VisitTime": "2022-03-03T16:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-60300-61200",
            "VisitTime": "2022-03-03T16:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-61200-62100",
            "VisitTime": "2022-03-03T17:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-62100-63000",
            "VisitTime": "2022-03-03T17:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-63000-63900",
            "VisitTime": "2022-03-03T17:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-63900-64800",
            "VisitTime": "2022-03-03T17:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-64800-65700",
            "VisitTime": "2022-03-03T18:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66171-65700-66600",
            "VisitTime": "2022-03-03T18:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-57600-58500",
            "VisitTime": "2022-03-04T16:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-58500-59400",
            "VisitTime": "2022-03-04T16:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-59400-60300",
            "VisitTime": "2022-03-04T16:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-60300-61200",
            "VisitTime": "2022-03-04T16:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-61200-62100",
            "VisitTime": "2022-03-04T17:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-62100-63000",
            "VisitTime": "2022-03-04T17:15:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-63000-63900",
            "VisitTime": "2022-03-04T17:30:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-63900-64800",
            "VisitTime": "2022-03-04T17:45:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-64800-65700",
            "VisitTime": "2022-03-04T18:00:00.000"
        },
        {
            "Slot_Id": "194701-78825-66172-65700-66600",
            "VisitTime": "2022-03-04T18:15:00.000"
        }
    ].map( s => {
        s.VisitTime = new Date(s.VisitTime)
        return s
    })
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
    const resp = await sendRequest("http://localhost:3001/fer", "GetPatientInfo", executeTemplate(GetPatientInfoRequest, getPatientData()))
    return resp["soapenv:Envelope"]["soapenv:Body"]["er:GetPatientInfoResponse"].Patient_Id
}

async function getHospitals() {
    const resp = await sendRequest("http://localhost:3001/fer", "GetMOInfoExtended", GetMOInfoExtendedRequest)
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
    const resp = await sendRequest("http://localhost:3001/fer", "GetServiceSpecsInfo", executeTemplate(GetServiceSpecsInfoRequest, getServiceSpecsInfoData()))
    const services = resp["soapenv:Envelope"]["soapenv:Body"]["er:GetServiceSpecsInfoResponse"].ListServiceSpecs.ServiceSpec.map( s => {
        return {
            Service_Id: s.ServiceSpec_Id,
            Service_Name: s.ServiceSpec_Name
        }
    })
    return services
}

async function getResources() {
    const resp = await sendRequest("http://localhost:3001/fer", "GetResourceInfo", executeTemplate(GetResourceInfoRequest, getResourceInfoData()))
    const resources = resp["soapenv:Envelope"]["soapenv:Body"]["er:GetResourceInfoResponse"].ListResource.Resource
    return resources
}
